/**
 * 대시보드 페이지용 Content Script
 * 웹사이트에서 사용자 정보를 읽어서 익스텐션 storage에 저장
 */

interface UserInfo {
  email: string;
  name: string;
  employeeId: string;
  cateringType: string;
}

/**
 * 대시보드 페이지에서 사용자 정보 추출
 */
function extractUserInfo(): UserInfo | null {
  try {
    // 이메일 필드에서 읽기 (readonly 또는 disabled 속성)
    const emailInput = document.querySelector<HTMLInputElement>(
      'input[type="email"]'
    );

    // 이름 필드 찾기 (placeholder="홍길동" 또는 value가 있는 input)
    const nameInput =
      document.querySelector<HTMLInputElement>(
        'input[type="text"][placeholder="홍길동"]'
      ) ||
      Array.from(
        document.querySelectorAll<HTMLInputElement>('input[type="text"]')
      ).find(
        (input) =>
          input.placeholder === "홍길동" || (input.value && !input.placeholder)
      );

    // 사번 필드 찾기 (placeholder="800000")
    const employeeIdInput =
      document.querySelector<HTMLInputElement>(
        'input[type="text"][placeholder="800000"]'
      ) ||
      Array.from(
        document.querySelectorAll<HTMLInputElement>('input[type="text"]')
      ).find((input) => input.placeholder === "800000");

    // 케이터링 타입 select 찾기
    const cateringSelect = document.querySelector<HTMLSelectElement>("select");

    const email = emailInput?.value || "";
    const name = nameInput?.value || "";
    const employeeId = employeeIdInput?.value || "";
    const cateringType = cateringSelect?.value || "";

    console.log("[Catering] Extracted user info:", {
      email,
      name,
      employeeId,
      cateringType,
    });

    // 이메일이 있어야만 유효한 정보로 간주
    if (!email) {
      console.log("[Catering] No email found, skipping sync");
      return null;
    }

    return {
      email,
      name,
      employeeId,
      cateringType,
    };
  } catch (error) {
    console.error("[Catering] Error extracting user info:", error);
    return null;
  }
}

/**
 * 익스텐션 storage에 사용자 정보 저장
 */
async function saveUserInfoToExtension(userInfo: UserInfo): Promise<void> {
  try {
    // 현재 스케줄 가져오기
    const response = await chrome.runtime.sendMessage({ type: "GET_STATUS" });
    const schedule = response?.schedule || {
      enabled: false,
      targetHour: 15,
      targetMinute: 0,
      reservationData: null,
    };

    // 사용자 정보가 있으면 reservationData 업데이트
    if (userInfo.email) {
      schedule.reservationData = {
        email: userInfo.email,
        name: userInfo.name,
        employeeId: userInfo.employeeId,
        cateringType: userInfo.cateringType,
      };

      // 스케줄 업데이트
      await chrome.runtime.sendMessage({
        type: "UPDATE_SCHEDULE",
        schedule,
      });

      console.log("[Catering] User info saved to extension:", userInfo);
    }
  } catch (error) {
    console.error("[Catering] Error saving user info:", error);
  }
}

/**
 * 폼 변경 감지 및 자동 저장
 */
function setupFormWatcher(): void {
  // MutationObserver로 폼 변경 감지
  const observer = new MutationObserver(() => {
    const userInfo = extractUserInfo();
    if (userInfo) {
      saveUserInfoToExtension(userInfo);
    }
  });

  // 폼 영역 감시
  const formArea = document.querySelector("form");
  if (formArea) {
    observer.observe(formArea, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["value", "disabled", "readonly"],
    });
  }

  // 입력 필드 변경 이벤트 리스너
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      const userInfo = extractUserInfo();
      if (userInfo) {
        saveUserInfoToExtension(userInfo);
      }
    });

    input.addEventListener("input", () => {
      // debounce를 위해 약간의 지연
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          saveUserInfoToExtension(userInfo);
        }
      }, 500);
    });
  });

  // 저장 버튼 클릭 감지 (저장 후 즉시 동기화)
  const saveButton = document.querySelector('button[type="submit"]');
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      // 저장 후 약간의 지연 후 동기화 (API 응답 대기)
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          console.log("[Catering] Save button clicked, syncing user info");
          saveUserInfoToExtension(userInfo);
        }
      }, 1000);
    });
  }

  // 폼 제출 감지
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      // 제출 후 약간의 지연 후 동기화
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          console.log("[Catering] Form submitted, syncing user info");
          saveUserInfoToExtension(userInfo);
        }
      }, 1500);
    });
  }
}

/**
 * 초기 사용자 정보 저장
 */
async function initUserInfoSync(): Promise<void> {
  // 페이지 로드 완료 후 사용자 정보 추출
  const tryExtract = () => {
    // React가 렌더링될 시간을 주기 위해 약간의 지연
    setTimeout(() => {
      const userInfo = extractUserInfo();
      if (userInfo) {
        console.log("[Catering] Initial sync:", userInfo);
        saveUserInfoToExtension(userInfo);
        setupFormWatcher();
      } else {
        // 정보가 아직 없으면 다시 시도
        console.log("[Catering] User info not ready, retrying...");
        setTimeout(tryExtract, 1000);
      }
    }, 500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryExtract);
  } else {
    tryExtract();
  }
}

/**
 * 예약하기 버튼 클릭 처리
 */
function setupReservationButton(): void {
  // 예약하기 버튼 찾기 (data-testid 또는 특정 텍스트로 찾기)
  const findReservationButton = (): HTMLButtonElement | null => {
    // data-testid로 찾기
    const button = document.querySelector<HTMLButtonElement>(
      '[data-testid="reservation-button"]'
    );
    if (button) return button;

    // 텍스트로 찾기
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find(
      (btn) =>
        btn.textContent?.includes("예약하기") &&
        btn.textContent?.includes("테스트")
    ) as HTMLButtonElement | null;
  };

  // 버튼이 나타날 때까지 대기
  const observer = new MutationObserver(() => {
    const button = findReservationButton();
    if (button && !button.dataset.listenerAdded) {
      button.dataset.listenerAdded = "true";
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("[Catering] 예약하기 버튼 클릭됨");

        // 사용자 정보 추출
        const userInfo = extractUserInfo();
        if (
          !userInfo ||
          !userInfo.email ||
          !userInfo.name ||
          !userInfo.employeeId ||
          !userInfo.cateringType
        ) {
          console.error("[Catering] 예약 정보가 불완전합니다:", userInfo);
          return;
        }

        try {
          // 테스트 모드 활성화
          await chrome.storage.local.set({ testMode: true });

          // 예약 데이터를 pendingReservation으로 설정
          const reservationData = {
            email: userInfo.email,
            name: userInfo.name,
            employeeId: userInfo.employeeId,
            cateringType: userInfo.cateringType,
          };

          await chrome.storage.local.set({
            pendingReservation: reservationData,
          });

          // background script에 페이지 열기 요청
          const targetUrl = "https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/";
          chrome.runtime.sendMessage({
            type: "OPEN_RESERVATION_PAGE",
            url: targetUrl,
          });

          console.log(
            "[Catering] 예약 페이지 열기 요청 완료, 테스트 모드 활성화됨"
          );
        } catch (error) {
          console.error("[Catering] 예약 실행 오류:", error);
        }
      });

      console.log("[Catering] 예약하기 버튼 리스너 등록 완료");
    }
  });

  // 초기 확인
  const button = findReservationButton();
  if (button && !button.dataset.listenerAdded) {
    observer.disconnect();
    button.dataset.listenerAdded = "true";
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("[Catering] 예약하기 버튼 클릭됨");

      const userInfo = extractUserInfo();
      if (
        !userInfo ||
        !userInfo.email ||
        !userInfo.name ||
        !userInfo.employeeId ||
        !userInfo.cateringType
      ) {
        console.error("[Catering] 예약 정보가 불완전합니다:", userInfo);
        return;
      }

      try {
        await chrome.storage.local.set({ testMode: true });

        const reservationData = {
          email: userInfo.email,
          name: userInfo.name,
          employeeId: userInfo.employeeId,
          cateringType: userInfo.cateringType,
        };

        await chrome.storage.local.set({ pendingReservation: reservationData });

        const targetUrl = "https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/";
        chrome.runtime.sendMessage({
          type: "OPEN_RESERVATION_PAGE",
          url: targetUrl,
        });

        console.log(
          "[Catering] 예약 페이지 열기 요청 완료, 테스트 모드 활성화됨"
        );
      } catch (error) {
        console.error("[Catering] 예약 실행 오류:", error);
      }
    });
  } else {
    // 버튼이 아직 없으면 감시 시작
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// 초기화 실행
initUserInfoSync();

// 예약하기 버튼 설정
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupReservationButton);
} else {
  setupReservationButton();
}
