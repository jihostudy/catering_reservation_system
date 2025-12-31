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
    // 이메일 필드에서 읽기
    const emailInput = document.querySelector<HTMLInputElement>(
      'input[type="email"][readonly]'
    );
    const nameInput = document.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder="홍길동"]'
    );
    const employeeIdInput = document.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder="800000"]'
    );
    const cateringSelect = document.querySelector<HTMLSelectElement>(
      'select'
    );

    const email = emailInput?.value || '';
    const name = nameInput?.value || '';
    const employeeId = employeeIdInput?.value || '';
    const cateringType = cateringSelect?.value || '';

    // 이메일이 있어야만 유효한 정보로 간주
    if (!email) {
      return null;
    }

    return {
      email,
      name,
      employeeId,
      cateringType,
    };
  } catch (error) {
    console.error('[Catering] Error extracting user info:', error);
    return null;
  }
}

/**
 * 익스텐션 storage에 사용자 정보 저장
 */
async function saveUserInfoToExtension(userInfo: UserInfo): Promise<void> {
  try {
    // 현재 스케줄 가져오기
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
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
        type: 'UPDATE_SCHEDULE',
        schedule,
      });

      console.log('[Catering] User info saved to extension:', userInfo);
    }
  } catch (error) {
    console.error('[Catering] Error saving user info:', error);
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
  const formArea = document.querySelector('form');
  if (formArea) {
    observer.observe(formArea, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value'],
    });
  }

  // 입력 필드 변경 이벤트 리스너
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      const userInfo = extractUserInfo();
      if (userInfo) {
        saveUserInfoToExtension(userInfo);
      }
    });

    input.addEventListener('input', () => {
      // debounce를 위해 약간의 지연
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          saveUserInfoToExtension(userInfo);
        }
      }, 500);
    });
  });
}

/**
 * 초기 사용자 정보 저장
 */
async function initUserInfoSync(): Promise<void> {
  // 페이지 로드 완료 후 사용자 정보 추출
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const userInfo = extractUserInfo();
      if (userInfo) {
        saveUserInfoToExtension(userInfo);
        setupFormWatcher();
      }
    });
  } else {
    const userInfo = extractUserInfo();
    if (userInfo) {
      await saveUserInfoToExtension(userInfo);
      setupFormWatcher();
    }
  }
}

// 초기화 실행
initUserInfoSync();

