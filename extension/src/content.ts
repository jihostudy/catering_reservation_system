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
  // readonly 속성 제거 (이메일 필드가 readonly일 수 있음)
  if (input.hasAttribute("readonly")) {
    input.removeAttribute("readonly");
  }

  // focus 이벤트 발생
  input.focus();

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

  // React가 인식할 수 있도록 여러 이벤트 발생
  input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
  input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));

  // React의 SyntheticEvent를 위한 추가 이벤트
  const nativeEvent = new Event("input", { bubbles: true, cancelable: true });
  Object.defineProperty(nativeEvent, "target", {
    writable: false,
    value: input,
  });
  input.dispatchEvent(nativeEvent);

  // blur 이벤트 발생 (React가 상태를 업데이트하도록)
  input.blur();
  input.focus();
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

    // 페이지가 완전히 로드될 때까지 대기
    if (document.readyState !== "complete") {
      await new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(undefined);
        } else {
          window.addEventListener("load", () => resolve(undefined));
        }
      });
    }

    // 추가 대기 (React가 DOM을 렌더링할 시간)
    await new Promise((r) => setTimeout(r, 1000));

    console.log("[Catering] Waiting for form elements...");

    // 이메일 입력
    const emailInput = await waitForElement<HTMLInputElement>(
      FORM_SELECTORS.email,
      15000
    );
    if (!emailInput) {
      console.error("[Catering] Email input not found");
      return {
        success: false,
        message: "이메일 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    console.log("[Catering] Email input found:", emailInput);
    setInputValue(emailInput, reservationData.email);
    console.log("[Catering] Email set to:", reservationData.email);

    // 이름 입력
    const nameInput = await waitForElement<HTMLInputElement>(
      FORM_SELECTORS.name,
      15000
    );
    if (!nameInput) {
      console.error("[Catering] Name input not found");
      return {
        success: false,
        message: "이름 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    console.log("[Catering] Name input found:", nameInput);
    setInputValue(nameInput, reservationData.name);
    console.log("[Catering] Name set to:", reservationData.name);

    // 사번 입력 (실제 필드명: empNo)
    const empNoInput = await waitForElement<HTMLInputElement>(
      FORM_SELECTORS.empNo,
      15000
    );
    if (!empNoInput) {
      console.error("[Catering] Employee ID input not found");
      return {
        success: false,
        message: "사번 입력 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    console.log("[Catering] Employee ID input found:", empNoInput);
    setInputValue(empNoInput, reservationData.employeeId);
    console.log("[Catering] Employee ID set to:", reservationData.employeeId);

    // 케이터링 타입 선택 (실제 필드명: type, 값은 01-05)
    const typeSelect = await waitForElement<HTMLSelectElement>(
      FORM_SELECTORS.type,
      15000
    );
    if (!typeSelect) {
      console.error("[Catering] Type select not found");
      return {
        success: false,
        message: "케이터링 타입 선택 필드를 찾을 수 없습니다",
        timestamp,
      };
    }
    console.log("[Catering] Type select found:", typeSelect);

    // 사용자 입력값을 실제 옵션 값으로 변환 (01, 02, 03, 04, 05)
    const mappedType =
      CATERING_TYPE_MAP[reservationData.cateringType] ||
      reservationData.cateringType;
    console.log(
      "[Catering] Mapping catering type:",
      reservationData.cateringType,
      "->",
      mappedType
    );
    setInputValue(typeSelect, mappedType);
    console.log("[Catering] Type set to:", mappedType);

    // React가 상태를 업데이트할 시간을 위해 대기
    await new Promise((r) => setTimeout(r, 500));

    // 입력값 검증 (다시 확인)
    const finalEmail = emailInput.value;
    const finalName = nameInput.value;
    const finalEmpNo = empNoInput.value;
    const finalType = typeSelect.value;

    console.log("[Catering] Final form values:", {
      email: finalEmail,
      name: finalName,
      empNo: finalEmpNo,
      type: finalType,
    });

    if (!finalName || !finalEmpNo || !finalType) {
      console.error("[Catering] Validation failed:", {
        name: finalName,
        empNo: finalEmpNo,
        type: finalType,
      });
      return {
        success: false,
        message: `입력값 검증 실패: 이름=${finalName}, 사번=${finalEmpNo}, 타입=${finalType}`,
        timestamp,
      };
    }

    console.log("[Catering] ✅ Form filled successfully");

    // 테스트 모드 확인 (로깅용)
    const storage = await chrome.storage.local.get("testMode");
    const isTestMode = storage.testMode === true;

    if (isTestMode) {
      console.log(
        "[Catering] 테스트 모드: 폼 입력 완료, 제출 버튼을 클릭합니다."
      );
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
    console.log("[Catering] Form submitted, waiting for result...");

    // 제출 후 결과 확인 (SOTA: 성공/실패/이미 예약 확인)
    const result = await waitForReservationResult(isTestMode);
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("[Catering] Form fill error:", error);
    return { success: false, message: errorMessage, timestamp };
  }
}

/**
 * 제출 후 예약 결과 확인 (성공/실패/이미 예약)
 * SOTA: 페이지 변화 감지 및 메시지 파싱
 */
async function waitForReservationResult(
  isTestMode: boolean,
  timeoutMs = 10000
): Promise<ReservationResult> {
  const timestamp = Date.now();
  const startTime = Date.now();

  return new Promise((resolve) => {
    // 1. 즉시 확인: 페이지에 이미 메시지가 있는지
    const immediateCheck = checkReservationStatus();
    if (immediateCheck) {
      console.log("[Catering] Immediate status check:", immediateCheck);
      resolve({
        success: immediateCheck.success,
        message: immediateCheck.message,
        timestamp,
      });
      return;
    }

    // 2. MutationObserver로 페이지 변화 감지
    const observer = new MutationObserver(() => {
      const status = checkReservationStatus();
      if (status) {
        observer.disconnect();
        console.log("[Catering] Status detected via MutationObserver:", status);
        resolve({
          success: status.success,
          message: status.message,
          timestamp,
        });
      }
    });

    // 페이지 전체 감시
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // 3. 주기적으로 확인 (MutationObserver가 놓칠 수 있음)
    const intervalId = setInterval(() => {
      const status = checkReservationStatus();
      if (status) {
        clearInterval(intervalId);
        observer.disconnect();
        console.log("[Catering] Status detected via interval check:", status);
        resolve({
          success: status.success,
          message: status.message,
          timestamp,
        });
      } else if (Date.now() - startTime > timeoutMs) {
        // 타임아웃
        clearInterval(intervalId);
        observer.disconnect();
        console.warn("[Catering] Timeout waiting for reservation result");
        resolve({
          success: false,
          message: "예약 결과 확인 시간 초과 (페이지 변화를 감지하지 못함)",
          timestamp,
        });
      }
    }, 500); // 0.5초마다 확인

    // 4. 최종 타임아웃
    setTimeout(() => {
      clearInterval(intervalId);
      observer.disconnect();
      if (Date.now() - startTime < timeoutMs) {
        // 아직 결과를 받지 못했지만 타임아웃
        const finalCheck = checkReservationStatus();
        if (finalCheck) {
          resolve({
            success: finalCheck.success,
            message: finalCheck.message,
            timestamp,
          });
        } else {
          resolve({
            success: false,
            message: "예약 결과를 확인할 수 없습니다",
            timestamp,
          });
        }
      }
    }, timeoutMs);
  });
}

/**
 * 페이지에서 예약 상태 확인 (성공/실패/이미 예약)
 */
function checkReservationStatus(): {
  success: boolean;
  message: string;
} | null {
  const bodyText = document.body.textContent || "";
  const bodyHTML = document.body.innerHTML || "";

  // 성공 메시지 패턴
  const successPatterns = [
    /예약.*성공/i,
    /신청.*완료/i,
    /예약.*완료/i,
    /신청.*성공/i,
    /success/i,
    /완료되었습니다/i,
  ];

  // 실패 메시지 패턴
  const failurePatterns = [
    /예약.*실패/i,
    /신청.*실패/i,
    /오류/i,
    /error/i,
    /에러/i,
    /불가/i,
    /불가능/i,
  ];

  // 이미 예약한 경우 패턴
  const alreadyReservedPatterns = [
    /이미.*예약/i,
    /이미.*신청/i,
    /중복/i,
    /already/i,
    /duplicate/i,
    /예약.*있습니다/i,
    /신청.*있습니다/i,
  ];

  // 페이지 URL 변경 확인 (성공 시 리다이렉트될 수 있음)
  const currentUrl = window.location.href;
  if (currentUrl.includes("/success") || currentUrl.includes("/complete")) {
    return {
      success: true,
      message: "예약 성공 (URL 확인)",
    };
  }

  if (currentUrl.includes("/error") || currentUrl.includes("/fail")) {
    return {
      success: false,
      message: "예약 실패 (URL 확인)",
    };
  }

  // 텍스트 기반 확인
  for (const pattern of alreadyReservedPatterns) {
    if (pattern.test(bodyText) || pattern.test(bodyHTML)) {
      return {
        success: false,
        message: "이미 예약하셨습니다",
      };
    }
  }

  for (const pattern of successPatterns) {
    if (pattern.test(bodyText) || pattern.test(bodyHTML)) {
      return {
        success: true,
        message: "예약 성공",
      };
    }
  }

  for (const pattern of failurePatterns) {
    if (pattern.test(bodyText) || pattern.test(bodyHTML)) {
      return {
        success: false,
        message: "예약 실패",
      };
    }
  }

  // 폼이 사라지고 다른 내용이 나타났는지 확인
  const form = document.querySelector("form");
  const submitButton = findSubmitButton();

  // 폼이 사라졌고 제출 버튼도 없으면 성공으로 간주 (페이지가 변경됨)
  if (!form && !submitButton && bodyText.length > 100) {
    // 충분한 내용이 있으면 페이지가 변경된 것으로 간주
    return {
      success: true,
      message: "예약 완료 (페이지 변화 감지)",
    };
  }

  return null; // 아직 결과를 확인할 수 없음
}

/**
 * 예약 결과를 background script로 전송
 * SOTA: 백그라운드 실행 후 탭 자동 닫기
 */
function sendResultToBackground(result: ReservationResult): void {
  chrome.runtime.sendMessage({ type: "RESERVATION_RESULT", result }, () => {
    // 예약 완료 후 백그라운드 탭 자동 닫기 (사용자 방해 없음)
    // 약간의 지연을 주어 제출이 완료될 시간 확보
    setTimeout(() => {
      chrome.runtime
        .sendMessage({
          type: "CLOSE_RESERVATION_TAB",
        })
        .catch(() => {
          // 메시지 전송 실패는 무시 (탭이 이미 닫혔을 수 있음)
        });
    }, 2000); // 2초 후 탭 닫기
  });
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
