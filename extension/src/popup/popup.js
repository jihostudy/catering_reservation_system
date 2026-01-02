// 관리 웹사이트 URL
// 프로덕션: https://cateringreservationsystem.vercel.app
// 개발: http://localhost:3000
const DASHBOARD_URL = "https://cateringreservationsystem.vercel.app";
const AUTH_STATUS_API = `${DASHBOARD_URL}/api/auth/status`;
const USER_API = `${DASHBOARD_URL}/api/users`;

let currentSchedule = null;
let isAuthenticated = false;

/**
 * 로딩 표시 제어 함수
 */
function showLoading(text = "데이터를 불러오는 중...") {
  const overlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");
  if (overlay && loadingText) {
    loadingText.textContent = text;
    overlay.classList.add("show");
  }
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 초기 로딩 표시
  showLoading("초기화 중...");

  try {
    // 로그인 상태 확인 및 버튼 표시
    showLoading("로그인 상태 확인 중...");
    await checkAuthAndUpdateButtons();

    // 로그인한 경우 웹사이트에서 사용자 정보 가져오기
    if (isAuthenticated) {
      showLoading("사용자 정보 불러오는 중...");
      await syncUserDataFromWeb();
    } else {
      // 로그인하지 않은 경우: 로컬 데이터 초기화
      showLoading("로컬 데이터 확인 중...");
      clearLocalDataIfNotAuthenticated();
      loadStatusFromStorage();
    }
  } catch (error) {
    console.error("[Catering] 초기화 중 오류:", error);
  } finally {
    // 로딩 완료
    hideLoading();
  }

  // 토글 버튼 클릭
  document
    .getElementById("toggleSwitch")
    .addEventListener("click", async () => {
      // 로그인 상태 확인
      const authStatus = await checkAuthStatus();

      if (!authStatus) {
        // 로그인하지 않은 경우 메인 페이지 열기
        chrome.tabs.create({ url: DASHBOARD_URL });
        return;
      }

      // 로그인한 경우에만 토글 동작
      if (!currentSchedule) return;

      const newEnabled = !currentSchedule.enabled;
      const newSchedule = {
        ...currentSchedule,
        enabled: newEnabled,
      };

      // Chrome Storage 업데이트
      showLoading("설정 저장 중...");
      chrome.runtime.sendMessage(
        {
          type: "UPDATE_SCHEDULE",
          schedule: newSchedule,
        },
        async (response) => {
          if (response?.success) {
            currentSchedule = newSchedule;
            updateStatusUI(newSchedule);

            // 웹사이트 DB에도 동기화
            try {
              await fetch(USER_API, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  enabled: newEnabled,
                }),
              });
            } catch (error) {
              console.error("Failed to sync enabled status to web:", error);
            } finally {
              hideLoading();
            }
          } else {
            hideLoading();
          }
        }
      );
    });

  // 로그인 버튼
  document.getElementById("loginButton").addEventListener("click", () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
  });

  // 홈페이지 아이콘
  document.getElementById("homeIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
  });

  // 깃허브 아이콘
  document.getElementById("githubIcon").addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://github.com/jihostudy/catering_reservation_system",
    });
  });

  // 디버깅: 현재 저장된 데이터 확인
  console.log("[Catering] Popup loaded, checking storage...");

  // 방법 1: Chrome Storage 직접 접근 (background script 없이도 작동)
  chrome.storage.local.get(["schedule", "lastResult", "history"], (data) => {
    console.log("[Catering] 📦 Direct Chrome Storage access:", data);
    if (data.schedule?.reservationData) {
      console.log(
        "[Catering] ✅ Reservation data found in storage:",
        data.schedule.reservationData
      );
    } else {
      console.log("[Catering] ⚠️ No reservation data in storage");
    }
  });

  // 방법 2: Background script를 통한 접근 (background script가 작동하는 경우)
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "[Catering] ❌ Background script error:",
        chrome.runtime.lastError.message
      );
      console.log(
        "[Catering] 💡 Tip: Try reloading the extension or check if background.js is loaded"
      );
    } else if (response) {
      console.log("[Catering] ✅ Background script response:", {
        schedule: response.schedule,
        reservationData: response.schedule?.reservationData,
        lastResult: response.lastResult,
      });
    } else {
      console.log("[Catering] ⚠️ Background script returned no data");
    }
  });
});

async function checkAuthStatus() {
  try {
    const response = await fetch(AUTH_STATUS_API, {
      credentials: "include",
    });
    const data = await response.json();
    return data.authenticated || false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

async function checkAuthAndUpdateButtons() {
  try {
    showLoading("로그인 상태 확인 중...");
    const response = await fetch(AUTH_STATUS_API, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    isAuthenticated = data.authenticated || false;

    const loginButton = document.getElementById("loginButton");

    if (isAuthenticated) {
      // 로그인한 경우: 로그인 버튼 숨김
      loginButton.style.display = "none";
    } else {
      // 로그인하지 않은 경우: 로그인 버튼 표시
      loginButton.style.display = "block";
      // 로그인하지 않은 경우 Chrome Storage 데이터 초기화
      clearLocalDataIfNotAuthenticated();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    isAuthenticated = false;
    // 에러 시 로그인 버튼 표시
    const loginButton = document.getElementById("loginButton");
    loginButton.style.display = "block";
    // 에러 시에도 로컬 데이터 초기화
    clearLocalDataIfNotAuthenticated();
  } finally {
    // 로딩은 상위 함수에서 처리
  }
}

/**
 * 로그인하지 않은 경우 로컬 데이터 초기화
 */
function clearLocalDataIfNotAuthenticated() {
  // UI만 초기화 (Chrome Storage는 유지)
  updateStatusUI({
    enabled: false,
    targetHour: 16,
    targetMinute: 15,
    reservationData: null,
  });
}

/**
 * 웹사이트에서 사용자 정보를 가져와서 Chrome Storage에 동기화
 */
async function syncUserDataFromWeb() {
  try {
    showLoading("사용자 정보 동기화 중...");
    console.log("[Catering] Fetching user data from:", USER_API);
    const response = await fetch(USER_API, {
      credentials: "include",
      mode: "cors",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch user data:",
        response.status,
        response.statusText
      );
      // 실패해도 기존 데이터로 UI 업데이트
      loadStatusFromStorage();
      hideLoading();
      return;
    }

    const userData = await response.json();
    console.log("[Catering] User data received:", userData);

    // 현재 스케줄 가져오기
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
        if (!response) {
          loadStatusFromStorage();
          resolve();
          return;
        }

        const { schedule } = response;
        // schedule이 없으면 기본값 사용
        const baseSchedule = schedule || {
          enabled: false,
          targetHour: 15,
          targetMinute: 0,
          reservationData: null,
        };

        const updatedSchedule = {
          ...baseSchedule,
          enabled:
            userData.enabled !== undefined
              ? userData.enabled
              : baseSchedule.enabled ?? false,
          reservationData: {
            email:
              userData.email || baseSchedule?.reservationData?.email || null,
            name: userData.name || baseSchedule?.reservationData?.name || null,
            employeeId:
              userData.employee_id ||
              baseSchedule?.reservationData?.employeeId ||
              null,
            cateringType:
              userData.catering_type ||
              baseSchedule?.reservationData?.cateringType ||
              null,
          },
        };

        // Chrome Storage에 업데이트
        chrome.runtime.sendMessage(
          {
            type: "UPDATE_SCHEDULE",
            schedule: updatedSchedule,
          },
          (updateResponse) => {
            if (updateResponse?.success) {
              currentSchedule = updatedSchedule;
              updateStatusUI(updatedSchedule);
              // lastResult도 함께 로드
              loadLastResult();
            } else {
              loadStatusFromStorage();
            }
            resolve();
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to sync user data from web:", error);
    // 에러 발생 시 기존 데이터로 UI 업데이트
    loadStatusFromStorage();
    hideLoading();
  }
}

/**
 * Chrome Storage에서 상태 로드
 * Background script 연결 오류 시 직접 Storage 접근
 */
function loadStatusFromStorage() {
  showLoading("데이터 불러오는 중...");
  // 방법 1: Background script를 통한 접근 시도
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError) {
      // Background script 오류 시 직접 Storage 접근
      console.warn(
        "[Catering] Background script error, using direct storage access:",
        chrome.runtime.lastError.message
      );
      chrome.storage.local.get(["schedule", "lastResult"], (data) => {
        const schedule = data.schedule || {
          enabled: false,
          targetHour: 15,
          targetMinute: 0,
          reservationData: null,
        };
        currentSchedule = schedule;
        updateStatusUI(schedule);
        updateLastResultUI(data.lastResult || null);
        hideLoading();
      });
    } else if (response) {
      const { schedule, lastResult } = response;
      currentSchedule = schedule;
      updateStatusUI(schedule);
      updateLastResultUI(lastResult);
      hideLoading();
    } else {
      // 응답이 없으면 직접 Storage 접근
      chrome.storage.local.get(["schedule", "lastResult"], (data) => {
        const schedule = data.schedule || {
          enabled: false,
          targetHour: 15,
          targetMinute: 0,
          reservationData: null,
        };
        currentSchedule = schedule;
        updateStatusUI(schedule);
        updateLastResultUI(data.lastResult || null);
        hideLoading();
      });
    }
  });
}

/**
 * 최근 실행 결과만 로드
 */
function loadLastResult() {
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (!response) return;
    updateLastResultUI(response.lastResult);
  });
}

function updateStatusUI(schedule) {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const emailEl = document.getElementById("userEmail");
  const userNameEl = document.getElementById("userName");
  const employeeIdEl = document.getElementById("employeeId");
  const cateringTimeEl = document.getElementById("cateringTime");

  // 토글 스위치 상태 업데이트
  if (schedule?.enabled) {
    toggleSwitch.classList.add("active");
  } else {
    toggleSwitch.classList.remove("active");
  }

  // 케이터링 타입 표시 텍스트 매핑
  const cateringTypeMap = {
    "1차수": "1차수 (11:30~12:00)",
    "2차수": "2차수 (12:00~12:30)",
    "3차수": "3차수 (12:30~13:00)",
    콤보: "콤보 (11:30~15:00)",
    샐러드: "샐러드 (11:30~15:00)",
  };

  // 사용자 정보가 있으면 표시
  if (schedule?.reservationData) {
    emailEl.textContent = schedule.reservationData.email || "-";
    userNameEl.textContent = schedule.reservationData.name || "-";
    employeeIdEl.textContent = schedule.reservationData.employeeId || "-";

    // 케이터링 시간 텍스트로 표시
    if (schedule.reservationData.cateringType) {
      const displayText =
        cateringTypeMap[schedule.reservationData.cateringType] ||
        schedule.reservationData.cateringType;
      cateringTimeEl.textContent = displayText;
    } else {
      cateringTimeEl.textContent = "-";
    }
  } else {
    // 사용자 정보가 없으면 모두 '-' 표시
    emailEl.textContent = "-";
    userNameEl.textContent = "-";
    employeeIdEl.textContent = "-";
    cateringTimeEl.textContent = "-";
  }
}

function updateLastResultUI(lastResult) {
  const sectionEl = document.getElementById("lastResultSection");
  const resultEl = document.getElementById("lastResult");

  if (!lastResult) {
    sectionEl.style.display = "none";
    return;
  }

  sectionEl.style.display = "block";
  const date = new Date(lastResult.timestamp).toLocaleString("ko-KR");
  const status = lastResult.success ? "성공" : "실패";
  resultEl.innerHTML = `
    <div>${date}</div>
    <div><strong>${status}</strong>: ${lastResult.message}</div>
  `;
}
