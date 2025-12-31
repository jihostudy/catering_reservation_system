/**
 * 폼 자동 입력 테스트 스크립트
 *
 * 사용법:
 *   cd extension
 *   pnpm install puppeteer
 *   pnpm tsx test-form-fill.ts
 *
 * 또는 직접 실행:
 *   npx tsx extension/test-form-fill.ts
 */

import puppeteer from "puppeteer";

const TARGET_URL = "https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/";

// 테스트용 예약 데이터
const TEST_DATA = {
  email: "test@oliveyoung.co.kr",
  name: "홍길동",
  employeeId: "800000",
  cateringType: "1차수", // '1차수', '2차수', '3차수', '콤보', '샐러드'
};

// 케이터링 타입 매핑 (실제 사이트의 select 옵션 값)
const CATERING_TYPE_MAP: Record<string, string> = {
  "1차수": "01",
  "2차수": "02",
  "3차수": "03",
  콤보: "04",
  샐러드: "05",
};

async function testFormFill() {
  console.log("🚀 브라우저를 시작합니다...");

  const browser = await puppeteer.launch({
    headless: false, // 브라우저를 보이게 실행
    defaultViewport: null,
    args: ["--start-maximized"],
    // Puppeteer가 자동으로 설치한 Chrome을 사용
  });

  try {
    const page = await browser.newPage();

    console.log(`📄 타겟 페이지로 이동: ${TARGET_URL}`);
    await page.goto(TARGET_URL, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log("⏳ 페이지 로딩 대기 중...");
    await page.waitForTimeout(2000);

    // 폼 필드 선택자
    const selectors = {
      email: 'input[name="email"]',
      name: 'input[name="name"]',
      empNo: 'input[name="empNo"]',
      type: 'select[name="type"]',
      submitButton: 'button[type="submit"]',
    };

    console.log("📝 폼 필드 찾는 중...");

    // 이메일 입력
    console.log("  - 이메일 입력 중...");
    const emailInput = await page.$(selectors.email);
    if (!emailInput) {
      throw new Error("이메일 입력 필드를 찾을 수 없습니다");
    }
    await emailInput.click({ clickCount: 3 }); // 기존 값 선택
    await emailInput.type(TEST_DATA.email);
    console.log(`    ✓ 이메일: ${TEST_DATA.email}`);

    // 이름 입력
    console.log("  - 이름 입력 중...");
    const nameInput = await page.$(selectors.name);
    if (!nameInput) {
      throw new Error("이름 입력 필드를 찾을 수 없습니다");
    }
    await nameInput.click({ clickCount: 3 });
    await nameInput.type(TEST_DATA.name);
    console.log(`    ✓ 이름: ${TEST_DATA.name}`);

    // 사번 입력
    console.log("  - 사번 입력 중...");
    const empNoInput = await page.$(selectors.empNo);
    if (!empNoInput) {
      throw new Error("사번 입력 필드를 찾을 수 없습니다");
    }
    await empNoInput.click({ clickCount: 3 });
    await empNoInput.type(TEST_DATA.employeeId);
    console.log(`    ✓ 사번: ${TEST_DATA.employeeId}`);

    // 케이터링 타입 선택
    console.log("  - 케이터링 타입 선택 중...");
    const typeSelect = await page.$(selectors.type);
    if (!typeSelect) {
      throw new Error("케이터링 타입 선택 필드를 찾을 수 없습니다");
    }
    const mappedType =
      CATERING_TYPE_MAP[TEST_DATA.cateringType] || TEST_DATA.cateringType;
    await typeSelect.select(mappedType);
    console.log(
      `    ✓ 케이터링 타입: ${TEST_DATA.cateringType} (${mappedType})`
    );

    // 입력값 확인
    console.log("\n📋 입력된 값 확인:");
    const emailValue = await page.$eval(
      selectors.email,
      (el: HTMLInputElement) => el.value
    );
    const nameValue = await page.$eval(
      selectors.name,
      (el: HTMLInputElement) => el.value
    );
    const empNoValue = await page.$eval(
      selectors.empNo,
      (el: HTMLInputElement) => el.value
    );
    const typeValue = await page.$eval(
      selectors.type,
      (el: HTMLSelectElement) => el.value
    );

    console.log(`  이메일: ${emailValue}`);
    console.log(`  이름: ${nameValue}`);
    console.log(`  사번: ${empNoValue}`);
    console.log(`  타입: ${typeValue}`);

    // React 등 프레임워크가 상태를 업데이트할 시간을 위해 대기
    console.log("\n⏳ 상태 업데이트 대기 중...");
    await page.waitForTimeout(500);

    // 제출 버튼 찾기
    console.log("\n🔍 제출 버튼 찾는 중...");
    let submitButton = await page.$(selectors.submitButton);

    // 버튼을 찾지 못하면 텍스트로 찾기
    if (!submitButton) {
      const buttonText = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const found = buttons.find(
          (btn) =>
            btn.textContent?.includes("신청하기") ||
            btn.textContent?.includes("신청")
        );
        return found ? (found as HTMLElement).textContent : null;
      });

      if (buttonText) {
        // 텍스트로 버튼 클릭
        await page.evaluate((text) => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const btn = buttons.find(
            (b) =>
              b.textContent?.includes("신청하기") ||
              b.textContent?.includes("신청")
          ) as HTMLButtonElement | undefined;
          if (btn && !btn.disabled) {
            btn.click();
          }
        }, buttonText);
        console.log("✅ 제출 버튼을 클릭했습니다 (텍스트로 찾음)");
      } else {
        console.log("⚠️  제출 버튼을 찾을 수 없습니다. 수동으로 확인해주세요.");
        console.log("브라우저를 30초간 열어둡니다...");
        await page.waitForTimeout(30000);
        return;
      }
    } else {
      // 버튼이 비활성화되어 있는지 확인
      const isDisabled = await page.evaluate((btn) => {
        return (btn as HTMLButtonElement).disabled;
      }, submitButton);

      if (isDisabled) {
        console.log("⚠️  제출 버튼이 비활성화되어 있습니다.");
        console.log("브라우저를 30초간 열어둡니다...");
        await page.waitForTimeout(30000);
        return;
      }

      console.log("✅ 제출 버튼을 클릭합니다...");
      await submitButton.click();
    }

    console.log("\n✅ 폼 제출 완료!");
    console.log("브라우저를 10초간 열어둡니다...");
    await page.waitForTimeout(10000);
  } catch (error) {
    console.error("\n❌ 오류 발생:", error);
    console.log("브라우저를 30초간 열어둡니다...");
    await page.waitForTimeout(30000);
  } finally {
    console.log("\n🔒 브라우저를 닫습니다...");
    await browser.close();
  }
}

// 스크립트 실행
testFormFill().catch(console.error);
