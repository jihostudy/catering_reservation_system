import type { ReservationData, ReservationResult } from "./types";

/**
 * 폼 필드 선택자 (실제 타겟 사이트 구조 기반)
 */
const FORM_SELECTORS = {
  email: 'input[name="email"]',
  name: 'input[name="name"]',
  empNo: 'input[name="empNo"]',
  type: 'select[name="type"]',
  submitButton: 'button[type="submit"]',
} as const;

/**
 * 제출 버튼 찾기 (타입과 텍스트 모두 확인)
 */
function findSubmitButton(): HTMLButtonElement | null {
  // 먼저 type="submit" 버튼 찾기
  const button = findElement<HTMLButtonElement>(FORM_SELECTORS.submitButton);
  if (button && button.textContent?.includes("신청")) {
    return button;
  }
  // 텍스트로도 찾기
  const allButtons = document.querySelectorAll("button");
  for (const btn of Array.from(allButtons)) {
    if (
      btn.textContent?.includes("신청하기") ||
      btn.textContent?.includes("신청")
    ) {
      return btn as HTMLButtonElement;
    }
  }
  return button;
}

/**
 * 케이터링 타입 값 매핑
 * 실제 사이트의 select 옵션 값과 매핑
 */
const CATERING_TYPE_MAP: Record<string, string> = {
  "1차수": "01",
  "2차수": "02",
  "3차수": "03",
  콤보: "04",
  샐러드: "05",
  // 영어 버전도 지원
  lunch: "01",
  dinner: "02",
  combo: "04",
  salad: "05",
};

/**
 * DOM 요소 찾기 (여러 선택자 시도)
 */
function findElement<T extends Element>(selectors: string): T | null {
  const selectorList = selectors.split(", ");
  for (const selector of selectorList) {
    const element = document.querySelector<T>(selector.trim());
    if (element) return element;
  }
  return null;
}

/**
 * 요소가 나타날 때까지 대기
 */
function waitForElement<T extends Element>(
  selectors: string,
  timeoutMs = 10000
): Promise<T | null> {
  return new Promise((resolve) => {
    const element = findElement<T>(selectors);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const foundElement = findElement<T>(selectors);
      if (foundElement) {
        observer.disconnect();
        resolve(foundElement);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMs);
  });
}

/**
 * input 이벤트 발생시켜 React 등 프레임워크 호환성 확보
 */
function setInputValue(
  input: HTMLInputElement | HTMLSelectElement,
  value: string
): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    input.tagName === "SELECT"
      ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype,
    "value"
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * 폼 자동 입력 실행
 */
async function fillReservationForm(
  reservationData: ReservationData
): Promise<ReservationResult> {
  const timestamp = Date.now();

  try {
    console.log("[Catering] Starting form fill with data:", reservationData);

    // 이메일 입력
    const emailInput = await waitForElement<HTMLInputElement>(
      FORM_SELECTORS.email
    );
    if (!emailInput) {
      return {
        success: false,
        message: "이메일 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    setInputValue(emailInput, reservationData.email);

    // 이름 입력
    const nameInput = findElement<HTMLInputElement>(FORM_SELECTORS.name);
    if (!nameInput) {
      return {
        success: false,
        message: "이름 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    setInputValue(nameInput, reservationData.name);

    // 사번 입력 (실제 필드명: empNo)
    const empNoInput = findElement<HTMLInputElement>(FORM_SELECTORS.empNo);
    if (!empNoInput) {
      return {
        success: false,
        message: "사번 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    setInputValue(empNoInput, reservationData.employeeId);

    // 케이터링 타입 선택 (실제 필드명: type, 값은 01-05)
    const typeSelect = findElement<HTMLSelectElement>(FORM_SELECTORS.type);
    if (!typeSelect) {
      return {
        success: false,
        message: "케이터링 타입 선택 필드를 찾을 수 없습니다",
        timestamp,
      };
    }

    // 사용자 입력값을 실제 옵션 값으로 변환 (01, 02, 03, 04, 05)
    const mappedType =
      CATERING_TYPE_MAP[reservationData.cateringType] ||
      reservationData.cateringType;
    setInputValue(typeSelect, mappedType);

    // 입력값 검증
    if (!nameInput.value || !empNoInput.value || !typeSelect.value) {
      return {
        success: false,
        message: `입력값 검증 실패: 이름=${nameInput.value}, 사번=${empNoInput.value}, 타입=${typeSelect.value}`,
        timestamp,
      };
    }

    console.log("[Catering] Form filled:", {
      email: emailInput.value,
      name: nameInput.value,
      empNo: empNoInput.value,
      type: typeSelect.value,
    });

    // React 등 프레임워크가 상태를 업데이트할 시간을 위해 대기
    await new Promise((r) => setTimeout(r, 300));

    // 테스트 모드 확인
    const storage = await chrome.storage.local.get("testMode");
    const isTestMode = storage.testMode === true;

    if (isTestMode) {
      console.log("[Catering] 테스트 모드: 폼 입력 완료, 제출하지 않습니다.");
      console.log("[Catering] 브라우저 창을 열어둡니다. 수동으로 확인하세요.");
      return { 
        success: true, 
        message: "테스트 모드: 폼 입력 완료 (제출 안 함)", 
        timestamp 
      };
    }

    // 제출 버튼 클릭
    const submitButton = findSubmitButton();
    if (!submitButton) {
      return {
        success: false,
        message: "제출 버튼을 찾을 수 없습니다",
        timestamp,
      };
    }

    // 버튼이 비활성화되어 있지 않은지 확인
    if (submitButton.disabled) {
      return {
        success: false,
        message: "제출 버튼이 비활성화되어 있습니다",
        timestamp,
      };
    }

    submitButton.click();
    console.log("[Catering] Form submitted");

    return { success: true, message: "예약 신청 완료", timestamp };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("[Catering] Form fill error:", error);
    return { success: false, message: errorMessage, timestamp };
  }
}

/**
 * 예약 결과를 background script로 전송
 */
function sendResultToBackground(result: ReservationResult): void {
  chrome.runtime.sendMessage({ type: "RESERVATION_RESULT", result });
}

/**
 * 페이지 로드 시 pending 예약 확인 및 실행
 */
async function checkAndExecutePendingReservation(): Promise<void> {
  const storage = await chrome.storage.local.get("pendingReservation");
  const pendingData = storage.pendingReservation as ReservationData | null;

  if (!pendingData) {
    console.log("[Catering] No pending reservation");
    return;
  }

  console.log("[Catering] Found pending reservation, executing...");

  // pending 데이터 삭제
  await chrome.storage.local.remove("pendingReservation");

  // 폼 입력 실행
  const result = await fillReservationForm(pendingData);
  sendResultToBackground(result);
}

// 페이지 로드 완료 후 실행
if (document.readyState === "complete") {
  checkAndExecutePendingReservation();
} else {
  window.addEventListener("load", checkAndExecutePendingReservation);
}
