/**
 * 테스트용 알람 설정 스크립트
 * 
 * 사용법:
 *   cd extension
 *   pnpm tsx test-alarm.ts
 * 
 * 현재 시간 + 2분 후에 알람이 설정됩니다.
 * 브라우저가 열리고 데이터 입력까지만 진행됩니다 (제출 안 함).
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setTestAlarm() {
  const now = new Date();
  const testTime = new Date(now.getTime() + 2 * 60 * 1000); // 현재 시간 + 2분
  
  const hours = testTime.getHours();
  const minutes = testTime.getMinutes();
  
  console.log(`⏰ 테스트 알람 설정: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  console.log(`   (현재 시간: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')})`);
  
  // Chrome Storage에 테스트 스케줄 설정
  const testScript = `
    (async () => {
      const schedule = {
        enabled: true,
        targetHour: ${hours},
        targetMinute: ${minutes},
        reservationData: {
          email: "test@oliveyoung.co.kr",
          name: "홍길동",
          employeeId: "800000",
          cateringType: "1차수"
        }
      };
      
      await chrome.storage.local.set({ schedule });
      
      // 알람 설정을 위해 background script에 메시지 전송
      chrome.runtime.sendMessage({
        type: 'UPDATE_SCHEDULE',
        schedule: schedule
      }, (response) => {
        if (response?.success) {
          console.log('✅ 테스트 알람이 설정되었습니다!');
          console.log('설정된 시간:', ${hours}:${minutes});
        } else {
          console.error('❌ 알람 설정 실패');
        }
      });
    })();
  `;
  
  // Chrome DevTools Protocol을 통해 스크립트 실행
  // 또는 익스텐션의 popup을 통해 실행할 수 있도록 안내
  console.log('\n📋 다음 단계:');
  console.log('1. Chrome 브라우저에서 익스텐션 팝업을 엽니다');
  console.log('2. 개발자 도구 콘솔에서 다음 코드를 실행합니다:\n');
  console.log(testScript);
  console.log('\n또는 익스텐션의 background script 콘솔에서 실행하세요.');
}

setTestAlarm().catch(console.error);

