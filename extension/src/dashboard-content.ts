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
    const nameInput = document.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder="홍길동"]'
    ) || Array.from(document.querySelectorAll<HTMLInputElement>('input[type="text"]'))
        .find(input => input.placeholder === '홍길동' || (input.value && !input.placeholder));
    
    // 사번 필드 찾기 (placeholder="800000")
    const employeeIdInput = document.querySelector<HTMLInputElement>(
      'input[type="text"][placeholder="800000"]'
    ) || Array.from(document.querySelectorAll<HTMLInputElement>('input[type="text"]'))
        .find(input => input.placeholder === '800000');
    
    // 케이터링 타입 select 찾기
    const cateringSelect = document.querySelector<HTMLSelectElement>(
      'select'
    );

    const email = emailInput?.value || '';
    const name = nameInput?.value || '';
    const employeeId = employeeIdInput?.value || '';
    const cateringType = cateringSelect?.value || '';

    console.log('[Catering] Extracted user info:', { email, name, employeeId, cateringType });

    // 이메일이 있어야만 유효한 정보로 간주
    if (!email) {
      console.log('[Catering] No email found, skipping sync');
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
      attributeFilter: ['value', 'disabled', 'readonly'],
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

  // 저장 버튼 클릭 감지 (저장 후 즉시 동기화)
  const saveButton = document.querySelector('button[type="submit"]');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      // 저장 후 약간의 지연 후 동기화 (API 응답 대기)
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          console.log('[Catering] Save button clicked, syncing user info');
          saveUserInfoToExtension(userInfo);
        }
      }, 1000);
    });
  }

  // 폼 제출 감지
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', () => {
      // 제출 후 약간의 지연 후 동기화
      setTimeout(() => {
        const userInfo = extractUserInfo();
        if (userInfo) {
          console.log('[Catering] Form submitted, syncing user info');
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
        console.log('[Catering] Initial sync:', userInfo);
        saveUserInfoToExtension(userInfo);
        setupFormWatcher();
      } else {
        // 정보가 아직 없으면 다시 시도
        console.log('[Catering] User info not ready, retrying...');
        setTimeout(tryExtract, 1000);
      }
    }, 500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryExtract);
  } else {
    tryExtract();
  }
}

// 초기화 실행
initUserInfoSync();

