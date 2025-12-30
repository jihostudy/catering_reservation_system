import { DEFAULT_SCHEDULE, type ReservationSchedule, type ReservationResult } from './types';

const ALARM_NAME = 'katering-reservation-alarm';
const TARGET_URL = 'https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/';

/**
 * 익스텐션 설치/업데이트 시 초기화
 */
chrome.runtime.onInstalled.addListener(async () => {
  const storage = await chrome.storage.local.get('schedule');
  if (!storage.schedule) {
    await chrome.storage.local.set({ schedule: DEFAULT_SCHEDULE, history: [] });
  }
  console.log('[Katering] Extension installed/updated');
});

/**
 * 알람 설정 - 매일 지정 시간에 실행
 */
async function setupDailyAlarm(schedule: ReservationSchedule): Promise<void> {
  await chrome.alarms.clear(ALARM_NAME);

  if (!schedule.enabled || !schedule.reservationData) {
    console.log('[Katering] Alarm disabled or no reservation data');
    return;
  }

  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(schedule.targetHour, schedule.targetMinute, 0, 0);

  // 이미 지난 시간이면 다음 날로 설정
  if (targetTime.getTime() <= now.getTime()) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delayInMinutes = (targetTime.getTime() - now.getTime()) / (1000 * 60);

  chrome.alarms.create(ALARM_NAME, {
    when: targetTime.getTime(),
    periodInMinutes: 24 * 60, // 매일 반복
  });

  console.log(`[Katering] Alarm set for ${targetTime.toLocaleString()}, delay: ${delayInMinutes.toFixed(1)} minutes`);
}

/**
 * 알람 트리거 시 예약 실행
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  console.log('[Katering] Alarm triggered at', new Date().toLocaleString());

  const storage = await chrome.storage.local.get('schedule');
  const schedule = storage.schedule as ReservationSchedule;

  if (!schedule?.enabled || !schedule.reservationData) {
    console.log('[Katering] Reservation disabled or no data');
    return;
  }

  // 타겟 페이지 열기
  const tab = await chrome.tabs.create({ url: TARGET_URL, active: true });

  // content script에 예약 데이터 전달을 위해 저장
  await chrome.storage.local.set({ pendingReservation: schedule.reservationData });

  console.log('[Katering] Opened target page, tab:', tab.id);
});

/**
 * content script로부터 결과 수신
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'RESERVATION_RESULT') {
    const result = message.result as ReservationResult;
    handleReservationResult(result);
    sendResponse({ received: true });
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['schedule', 'lastResult']).then((data) => {
      sendResponse(data);
    });
    return true; // async response
  }

  if (message.type === 'UPDATE_SCHEDULE') {
    const newSchedule = message.schedule as ReservationSchedule;
    chrome.storage.local.set({ schedule: newSchedule }).then(() => {
      setupDailyAlarm(newSchedule);
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});

/**
 * 예약 결과 처리 및 히스토리 저장
 */
async function handleReservationResult(result: ReservationResult): Promise<void> {
  const storage = await chrome.storage.local.get('history');
  const history = (storage.history as ReservationResult[]) || [];

  history.unshift(result);
  // 최근 30개만 유지
  const trimmedHistory = history.slice(0, 30);

  await chrome.storage.local.set({
    lastResult: result,
    history: trimmedHistory,
  });

  // 알림 표시
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('public/icons/icon128.png'),
    title: result.success ? '예약 성공!' : '예약 실패',
    message: result.message,
  });

  console.log('[Katering] Result saved:', result);
}

// 시작 시 알람 재설정
chrome.storage.local.get('schedule').then((data) => {
  if (data.schedule) {
    setupDailyAlarm(data.schedule as ReservationSchedule);
  }
});
