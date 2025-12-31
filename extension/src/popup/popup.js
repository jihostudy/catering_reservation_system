// 관리 웹사이트 URL
// 프로덕션: https://cateringreservationsystem.vercel.app
// 개발: http://localhost:3000
const DASHBOARD_URL = 'https://cateringreservationsystem.vercel.app';
const AUTH_STATUS_API = `${DASHBOARD_URL}/api/auth/status`;
const USER_API = `${DASHBOARD_URL}/api/users`;

let currentSchedule = null;
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', async () => {
  // 로그인 상태 확인 및 버튼 표시
  await checkAuthAndUpdateButtons();
  
  // 로그인한 경우 웹사이트에서 사용자 정보 가져오기
  if (isAuthenticated) {
    await syncUserDataFromWeb();
  } else {
    // 로그인하지 않은 경우: 로컬 데이터 초기화
    clearLocalDataIfNotAuthenticated();
  }

  // 토글 버튼 클릭
  document.getElementById('toggleSwitch').addEventListener('click', async () => {
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
      enabled: newEnabled
    };
    
    // Chrome Storage 업데이트
    chrome.runtime.sendMessage({ 
      type: 'UPDATE_SCHEDULE', 
      schedule: newSchedule 
    }, async (response) => {
      if (response?.success) {
        currentSchedule = newSchedule;
        updateStatusUI(newSchedule);
        
        // 웹사이트 DB에도 동기화
        try {
          await fetch(USER_API, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              enabled: newEnabled,
            }),
          });
        } catch (error) {
          console.error('Failed to sync enabled status to web:', error);
        }
      }
    });
  });

  // 케이터링 시간 드롭다운 변경
  document.getElementById('cateringTime').addEventListener('change', async (e) => {
    if (!currentSchedule) return;
    
    const newCateringType = e.target.value;
    const newSchedule = {
      ...currentSchedule,
      reservationData: currentSchedule.reservationData ? {
        ...currentSchedule.reservationData,
        cateringType: newCateringType
      } : null
    };
    
    chrome.runtime.sendMessage({ 
      type: 'UPDATE_SCHEDULE', 
      schedule: newSchedule 
    }, (response) => {
      if (response?.success) {
        currentSchedule = newSchedule;
      }
    });
  });

  // 로그인 버튼
  document.getElementById('loginButton').addEventListener('click', () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
  });

  // 홈페이지 아이콘
  document.getElementById('homeIcon').addEventListener('click', () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
  });
});

async function checkAuthStatus() {
  try {
    const response = await fetch(AUTH_STATUS_API, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.authenticated || false;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

async function checkAuthAndUpdateButtons() {
  try {
    const response = await fetch(AUTH_STATUS_API, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    isAuthenticated = data.authenticated || false;
    
    const loginButton = document.getElementById('loginButton');
    const authStatusEl = document.getElementById('authStatus');
    
    if (isAuthenticated) {
      // 로그인한 경우: 로그인 버튼 숨김
      loginButton.style.display = 'none';
      if (authStatusEl) {
        authStatusEl.textContent = `로그인됨: ${data.email || ''}`;
        authStatusEl.style.color = '#28a745';
      }
    } else {
      // 로그인하지 않은 경우: 로그인 버튼 표시
      loginButton.style.display = 'block';
      if (authStatusEl) {
        authStatusEl.textContent = '로그인 필요';
        authStatusEl.style.color = '#dc3545';
      }
      // 로그인하지 않은 경우 Chrome Storage 데이터 초기화
      clearLocalDataIfNotAuthenticated();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    isAuthenticated = false;
    // 에러 시 로그인 버튼 표시
    const loginButton = document.getElementById('loginButton');
    const authStatusEl = document.getElementById('authStatus');
    loginButton.style.display = 'block';
    if (authStatusEl) {
      authStatusEl.textContent = '연결 오류 - 로그인 필요';
      authStatusEl.style.color = '#dc3545';
    }
    // 에러 시에도 로컬 데이터 초기화
    clearLocalDataIfNotAuthenticated();
  }
}

/**
 * 로그인하지 않은 경우 로컬 데이터 초기화
 */
function clearLocalDataIfNotAuthenticated() {
  // UI만 초기화 (Chrome Storage는 유지)
  updateStatusUI({
    enabled: false,
    targetHour: 15,
    targetMinute: 0,
    reservationData: null
  });
}

/**
 * 웹사이트에서 사용자 정보를 가져와서 Chrome Storage에 동기화
 */
async function syncUserDataFromWeb() {
  try {
    const response = await fetch(USER_API, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status);
      // 실패해도 기존 데이터로 UI 업데이트
      loadStatusFromStorage();
      return;
    }
    
    const userData = await response.json();
    
    // 현재 스케줄 가져오기
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
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
          reservationData: null
        };
        
        const updatedSchedule = {
          ...baseSchedule,
          enabled: userData.enabled !== undefined ? userData.enabled : (baseSchedule.enabled ?? false),
          reservationData: {
            email: userData.email || baseSchedule?.reservationData?.email || null,
            name: userData.name || baseSchedule?.reservationData?.name || null,
            employeeId: userData.employee_id || baseSchedule?.reservationData?.employeeId || null,
            cateringType: userData.catering_type || baseSchedule?.reservationData?.cateringType || null,
          }
        };
        
        // Chrome Storage에 업데이트
        chrome.runtime.sendMessage({
          type: 'UPDATE_SCHEDULE',
          schedule: updatedSchedule
        }, (updateResponse) => {
          if (updateResponse?.success) {
            currentSchedule = updatedSchedule;
            updateStatusUI(updatedSchedule);
            // lastResult도 함께 로드
            loadLastResult();
          } else {
            loadStatusFromStorage();
          }
          resolve();
        });
      });
    });
  } catch (error) {
    console.error('Failed to sync user data from web:', error);
    // 에러 발생 시 기존 데이터로 UI 업데이트
    loadStatusFromStorage();
  }
}

/**
 * Chrome Storage에서 상태 로드
 */
function loadStatusFromStorage() {
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    if (!response) return;

    const { schedule, lastResult } = response;
    currentSchedule = schedule;
    updateStatusUI(schedule);
    updateLastResultUI(lastResult);
  });
}

/**
 * 최근 실행 결과만 로드
 */
function loadLastResult() {
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    if (!response) return;
    updateLastResultUI(response.lastResult);
  });
}

function updateStatusUI(schedule) {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const emailEl = document.getElementById('userEmail');
  const userNameEl = document.getElementById('userName');
  const employeeIdEl = document.getElementById('employeeId');
  const cateringTimeSelect = document.getElementById('cateringTime');

  // 토글 스위치 상태 업데이트
  if (schedule?.enabled) {
    toggleSwitch.classList.add('active');
  } else {
    toggleSwitch.classList.remove('active');
  }

  // 사용자 정보가 있으면 표시
  if (schedule?.reservationData) {
    emailEl.textContent = schedule.reservationData.email || '-';
    userNameEl.textContent = schedule.reservationData.name || '-';
    employeeIdEl.textContent = schedule.reservationData.employeeId || '-';
    
    // 케이터링 시간 드롭다운 값 설정
    if (schedule.reservationData.cateringType) {
      cateringTimeSelect.value = schedule.reservationData.cateringType;
    } else {
      cateringTimeSelect.value = '';
    }
  } else {
    // 사용자 정보가 없으면 모두 '-' 표시
    emailEl.textContent = '-';
    userNameEl.textContent = '-';
    employeeIdEl.textContent = '-';
    cateringTimeSelect.value = '';
  }
}

function updateLastResultUI(lastResult) {
  const sectionEl = document.getElementById('lastResultSection');
  const resultEl = document.getElementById('lastResult');

  if (!lastResult) {
    sectionEl.style.display = 'none';
    return;
  }

  sectionEl.style.display = 'block';
  const date = new Date(lastResult.timestamp).toLocaleString('ko-KR');
  const status = lastResult.success ? '성공' : '실패';
  resultEl.innerHTML = `
    <div>${date}</div>
    <div><strong>${status}</strong>: ${lastResult.message}</div>
  `;
}
