import {
  DEFAULT_SCHEDULE,
  type ReservationResult,
  type ReservationSchedule,
} from "./types";

const ALARM_NAME = "catering-reservation-alarm";
const ALARM_NAME_10MIN = "catering-reservation-alarm-10min";
const ALARM_NAME_5MIN = "catering-reservation-alarm-5min";
const TARGET_URL = "https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/";

/**
 * 익스텐션 설치/업데이트 시 초기화
 */
chrome.runtime.onInstalled.addListener(async () => {
  const storage = await chrome.storage.local.get("schedule");
  if (!storage.schedule) {
    await chrome.storage.local.set({ schedule: DEFAULT_SCHEDULE, history: [] });
  }
  console.log("[Catering] Extension installed/updated");
});

/**
 * 알람 설정 - 매일 지정 시간에 실행
 * SOTA: 정확한 시간 계산 및 알람 상태 확인
 */
async function setupDailyAlarm(schedule: ReservationSchedule): Promise<void> {
  // 기존 알람 모두 제거
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.clear(ALARM_NAME_10MIN);
  await chrome.alarms.clear(ALARM_NAME_5MIN);

  if (!schedule.enabled || !schedule.reservationData) {
    console.log("[Catering] ⚠️ Alarm disabled or no reservation data", {
      enabled: schedule.enabled,
      hasData: !!schedule.reservationData,
    });
    return;
  }

  const now = new Date();
  const targetTime = new Date();
  // 자동 예약 시간: 20:40 (테스트용)
  targetTime.setHours(20, 40, 0, 0);
  targetTime.setSeconds(0, 0);

  // 이미 지난 시간이면 다음 날로 설정
  if (targetTime.getTime() <= now.getTime()) {
    targetTime.setDate(targetTime.getDate() + 1);
    console.log("[Catering] ⏰ Target time has passed, setting for tomorrow");
  }

  // 10분 전 시간 계산
  const time10MinBefore = new Date(targetTime);
  time10MinBefore.setMinutes(time10MinBefore.getMinutes() - 10);

  // 5분 전 시간 계산
  const time5MinBefore = new Date(targetTime);
  time5MinBefore.setMinutes(time5MinBefore.getMinutes() - 5);

  const delayInMinutes = (targetTime.getTime() - now.getTime()) / (1000 * 60);
  const delayInSeconds = (targetTime.getTime() - now.getTime()) / 1000;

  try {
    // 메인 알람 (예약 시간)
    await chrome.alarms.create(ALARM_NAME, {
      when: targetTime.getTime(),
      periodInMinutes: 24 * 60, // 매일 반복
    });

    // 10분 전 알람
    if (time10MinBefore.getTime() > now.getTime()) {
      await chrome.alarms.create(ALARM_NAME_10MIN, {
        when: time10MinBefore.getTime(),
        periodInMinutes: 24 * 60, // 매일 반복
      });
      console.log(
        "[Catering] ✅ 10분 전 알람 설정:",
        time10MinBefore.toLocaleString("ko-KR")
      );
    }

    // 5분 전 알람
    if (time5MinBefore.getTime() > now.getTime()) {
      await chrome.alarms.create(ALARM_NAME_5MIN, {
        when: time5MinBefore.getTime(),
        periodInMinutes: 24 * 60, // 매일 반복
      });
      console.log(
        "[Catering] ✅ 5분 전 알람 설정:",
        time5MinBefore.toLocaleString("ko-KR")
      );
    }

    // 알람이 실제로 설정되었는지 확인
    const alarms = await chrome.alarms.getAll();
    const createdAlarm = alarms.find((a) => a.name === ALARM_NAME);

    if (createdAlarm) {
      const scheduledTime = createdAlarm.scheduledTime
        ? new Date(createdAlarm.scheduledTime)
        : null;
      console.log("[Catering] ✅ Alarm successfully set:", {
        name: createdAlarm.name,
        scheduledTime: scheduledTime?.toLocaleString("ko-KR"),
        targetTime: targetTime.toLocaleString("ko-KR"),
        delayMinutes: delayInMinutes.toFixed(2),
        delaySeconds: delayInSeconds.toFixed(0),
        now: now.toLocaleString("ko-KR"),
      });
    } else {
      console.error(
        "[Catering] ❌ Failed to create alarm - alarm not found after creation"
      );
    }
  } catch (error) {
    console.error("[Catering] ❌ Error creating alarm:", error);
  }
}

/**
 * 알람 트리거 시 예약 실행
 * SOTA: 상세한 로깅 및 에러 처리
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("[Catering] 🔔 Alarm triggered:", {
    name: alarm.name,
    scheduledTime: alarm.scheduledTime
      ? new Date(alarm.scheduledTime).toLocaleString("ko-KR")
      : "unknown",
    currentTime: new Date().toLocaleString("ko-KR"),
  });

  // 10분 전 알람 처리
  if (alarm.name === ALARM_NAME_10MIN) {
    console.log("[Catering] ⏰ 10분 전 알림 표시");
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
        title: "예약 10분 전",
        message:
          "곧 예약이 시작됩니다. 크롬 브라우저를 끄지 말고 대기해주세요.",
        priority: 2,
        requireInteraction: false,
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error(
            "[Catering] 알림 생성 실패:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("[Catering] 알림 생성 성공, ID:", notificationId);
        }
      }
    );
    return;
  }

  // 5분 전 알람 처리
  if (alarm.name === ALARM_NAME_5MIN) {
    console.log("[Catering] ⏰ 5분 전 알림 표시");
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
        title: "예약 5분 전",
        message:
          "곧 예약이 시작됩니다. 크롬 브라우저를 끄지 말고 대기해주세요.",
        priority: 2,
        requireInteraction: false,
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error(
            "[Catering] 알림 생성 실패:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("[Catering] 알림 생성 성공, ID:", notificationId);
        }
      }
    );
    return;
  }

  // 메인 알람 (예약 실행)만 처리
  if (alarm.name !== ALARM_NAME) {
    console.log("[Catering] ⚠️ Ignoring alarm:", alarm.name);
    return;
  }

  try {
    const storage = await chrome.storage.local.get(["schedule", "lastResult"]);
    const schedule = storage.schedule as ReservationSchedule;
    const lastResult = storage.lastResult as ReservationResult | null;

    console.log("[Catering] 📋 Schedule status:", {
      enabled: schedule?.enabled,
      hasData: !!schedule?.reservationData,
      targetHour: schedule?.targetHour,
      targetMinute: schedule?.targetMinute,
    });

    if (!schedule?.enabled || !schedule.reservationData) {
      console.error("[Catering] ❌ Reservation disabled or no data:", {
        enabled: schedule?.enabled,
        hasData: !!schedule?.reservationData,
      });
      return;
    }

    // SOTA: 오늘 이미 예약했는지 확인
    if (lastResult?.success) {
      const lastResultDate = new Date(lastResult.timestamp);
      const today = new Date();

      // 같은 날인지 확인 (년, 월, 일 비교)
      const isSameDay =
        lastResultDate.getFullYear() === today.getFullYear() &&
        lastResultDate.getMonth() === today.getMonth() &&
        lastResultDate.getDate() === today.getDate();

      if (isSameDay) {
        console.log("[Catering] ⏭️ Already reserved today, skipping:", {
          lastResultTime: lastResultDate.toLocaleString("ko-KR"),
          today: today.toLocaleString("ko-KR"),
        });

        // 알림 표시
        chrome.notifications.create(
          {
            type: "basic",
            iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
            title: "이미 예약됨",
            message: "오늘은 이미 예약하셨습니다. 내일 다시 시도합니다.",
            priority: 1,
            requireInteraction: false,
          },
          (notificationId) => {
            if (chrome.runtime.lastError) {
              console.error(
                "[Catering] 알림 생성 실패:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("[Catering] 알림 생성 성공, ID:", notificationId);
            }
          }
        );

        // 다음 알람 재설정 (내일)
        setupDailyAlarm(schedule);
        return;
      }
    }

    // 오늘 이미 예약 실패했지만 "이미 예약" 메시지인 경우
    if (
      lastResult &&
      !lastResult.success &&
      lastResult.message.includes("이미 예약")
    ) {
      const lastResultDate = new Date(lastResult.timestamp);
      const today = new Date();
      const isSameDay =
        lastResultDate.getFullYear() === today.getFullYear() &&
        lastResultDate.getMonth() === today.getMonth() &&
        lastResultDate.getDate() === today.getDate();

      if (isSameDay) {
        console.log(
          "[Catering] ⏭️ Already reserved today (from error message), skipping"
        );
        setupDailyAlarm(schedule);
        return;
      }
    }

    // chrome.tabs와 chrome.storage가 존재하는지 확인
    if (!chrome.tabs) {
      console.error("[Catering] ❌ chrome.tabs가 사용할 수 없습니다.");
      return;
    }

    if (!chrome.storage || !chrome.storage.local) {
      console.error("[Catering] ❌ chrome.storage.local이 사용할 수 없습니다.");
      return;
    }

    // 타겟 페이지를 백그라운드에서 열기 (SOTA: 완전 백그라운드 실행)
    console.log("[Catering] 🌐 Opening target page in background:", TARGET_URL);
    const tab = await chrome.tabs.create({
      url: TARGET_URL,
      active: false, // 백그라운드에서 열기 (사용자 방해 없음)
    });

    // content script에 예약 데이터 전달을 위해 저장
    await chrome.storage.local.set({
      pendingReservation: schedule.reservationData,
      reservationTabId: tab.id, // 탭 ID 저장 (나중에 닫기 위해)
      reservationSource: "auto", // 실행 원인: 자동 예약
    });

    console.log(
      "[Catering] ✅ Target page opened in background, tab ID:",
      tab.id
    );
    console.log(
      "[Catering] 📦 Reservation data saved:",
      schedule.reservationData
    );

    // 다음 알람 재설정 (매일 반복)
    setupDailyAlarm(schedule);
  } catch (error) {
    console.error("[Catering] ❌ Error in alarm handler:", error);
  }
});

/**
 * content script로부터 결과 수신
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "RESERVATION_RESULT") {
    const result = message.result as ReservationResult;
    handleReservationResult(result);
    sendResponse({ received: true });
  }

  if (message.type === "GET_STATUS") {
    if (!chrome.storage || !chrome.storage.local) {
      console.error("[Catering] chrome.storage.local이 사용할 수 없습니다.");
      sendResponse({ schedule: null, lastResult: null, alarm: null });
      return true;
    }

    chrome.storage.local
      .get(["schedule", "lastResult"])
      .then(async (data) => {
        // 알람 상태도 함께 반환
        const alarms = await chrome.alarms.getAll();
        const alarm = alarms.find((a) => a.name === ALARM_NAME);

        sendResponse({
          ...data,
          alarm: alarm
            ? {
                name: alarm.name,
                scheduledTime: alarm.scheduledTime
                  ? new Date(alarm.scheduledTime).toLocaleString("ko-KR")
                  : null,
              }
            : null,
        });
      })
      .catch((error) => {
        console.error("[Catering] Error getting status:", error);
        sendResponse({ schedule: null, lastResult: null, alarm: null });
      });
    return true; // async response
  }

  if (message.type === "UPDATE_SCHEDULE") {
    if (!chrome.storage || !chrome.storage.local) {
      console.error("[Catering] chrome.storage.local이 사용할 수 없습니다.");
      sendResponse({
        success: false,
        error: "chrome.storage.local이 사용할 수 없습니다.",
      });
      return true;
    }

    const newSchedule = message.schedule as ReservationSchedule;
    chrome.storage.local
      .set({ schedule: newSchedule })
      .then(() => {
        setupDailyAlarm(newSchedule);
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("[Catering] Error updating schedule:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "OPEN_RESERVATION_PAGE") {
    const url = message.url || TARGET_URL;
    // 테스트 모드도 백그라운드에서 실행
    chrome.tabs.create({ url, active: false }).then((tab) => {
      console.log(
        "[Catering] 📝 Test reservation page opened in background, tab ID:",
        tab.id
      );
      // 테스트 모드 탭 ID도 저장
      chrome.storage.local.set({ reservationTabId: tab.id });
      sendResponse({ success: true, tabId: tab.id });
    });
    return true; // async response
  }

  if (message.type === "OPEN_RESERVATION_PAGE_WITH_DATA") {
    // SOTA: content script에서 직접 storage 접근 대신 background script를 통해 처리
    const url = message.url || TARGET_URL;
    const reservationData = message.reservationData;
    const testMode = message.testMode || false;

    // chrome.storage와 chrome.tabs가 존재하는지 확인
    if (!chrome.storage || !chrome.storage.local) {
      console.error("[Catering] chrome.storage.local이 사용할 수 없습니다.");
      sendResponse({
        success: false,
        error: "chrome.storage.local이 사용할 수 없습니다.",
      });
      return true;
    }

    if (!chrome.tabs) {
      console.error("[Catering] chrome.tabs가 사용할 수 없습니다.");
      sendResponse({
        success: false,
        error: "chrome.tabs가 사용할 수 없습니다.",
      });
      return true;
    }

    // Storage에 데이터 저장 (background script에서 안전하게 처리)
    chrome.storage.local
      .set({
        pendingReservation: reservationData,
        testMode: testMode,
        reservationSource: testMode ? "test" : "manual", // 실행 원인: 테스트 또는 수동
      })
      .then(() => {
        // 페이지 열기
        return chrome.tabs.create({ url, active: false });
      })
      .then((tab) => {
        console.log(
          "[Catering] 📝 Reservation page opened with data, tab ID:",
          tab.id
        );
        // 탭 ID 저장 시에도 에러 처리
        if (chrome.storage && chrome.storage.local) {
          chrome.storage.local
            .set({ reservationTabId: tab.id })
            .catch((error) => {
              console.warn(
                "[Catering] Failed to save reservationTabId:",
                error
              );
            });
        }
        sendResponse({ success: true, tabId: tab.id });
      })
      .catch((error) => {
        console.error("[Catering] Error opening reservation page:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        sendResponse({ success: false, error: errorMessage });
      });
    return true; // async response
  }

  if (message.type === "CLOSE_RESERVATION_TAB") {
    // 예약 완료 후 백그라운드 탭 자동 닫기
    if (!chrome.storage || !chrome.storage.local) {
      console.error("[Catering] chrome.storage.local이 사용할 수 없습니다.");
      sendResponse({
        success: false,
        error: "chrome.storage.local이 사용할 수 없습니다.",
      });
      return true;
    }

    if (!chrome.tabs) {
      console.error("[Catering] chrome.tabs가 사용할 수 없습니다.");
      sendResponse({
        success: false,
        error: "chrome.tabs가 사용할 수 없습니다.",
      });
      return true;
    }

    chrome.storage.local.get("reservationTabId", (data) => {
      if (data.reservationTabId) {
        chrome.tabs.remove(data.reservationTabId, () => {
          // 탭이 이미 닫혔거나 존재하지 않는 경우 에러 처리
          if (chrome.runtime.lastError) {
            console.log(
              "[Catering] ⚠️ Tab already closed or not found:",
              chrome.runtime.lastError.message,
              "(tab ID:",
              data.reservationTabId,
              ")"
            );
            // 에러가 발생해도 storage에서 reservationTabId는 제거
            if (chrome.storage && chrome.storage.local) {
              chrome.storage.local.remove("reservationTabId");
            }
          } else {
            console.log(
              "[Catering] 🗑️ Reservation tab closed:",
              data.reservationTabId
            );
            if (chrome.storage && chrome.storage.local) {
              chrome.storage.local.remove("reservationTabId");
            }
          }
        });
      } else {
        // reservationTabId가 없으면 이미 닫혔거나 저장되지 않은 경우
        console.log(
          "[Catering] ℹ️ No reservation tab ID found, tab may already be closed"
        );
      }
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});

/**
 * 예약 결과 처리 및 히스토리 저장
 * SOTA: 이미 예약/실패 케이스 처리
 */
async function handleReservationResult(
  result: ReservationResult
): Promise<void> {
  const storage = await chrome.storage.local.get(["history", "schedule"]);
  const history = (storage.history as ReservationResult[]) || [];
  const schedule = storage.schedule as ReservationSchedule;

  history.unshift(result);
  // 최근 30개만 유지
  const trimmedHistory = history.slice(0, 30);

  await chrome.storage.local.set({
    lastResult: result,
    history: trimmedHistory,
  });

  // 케이터링 차수 정보 가져오기
  const cateringType = schedule?.reservationData?.cateringType || "";
  const cateringTypeDisplay = cateringType || "";

  // 이미 예약한 경우 처리
  if (!result.success && result.message.includes("이미 예약")) {
    console.log("[Catering] ⚠️ Already reserved");

    // 알림 표시
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
        title: "이미 예약됨",
        message: "오늘은 이미 예약하셨습니다. 내일 다시 시도합니다.",
        priority: 1, // 일반 우선순위
        requireInteraction: false,
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error(
            "[Catering] 알림 생성 실패:",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("[Catering] 알림 생성 성공, ID:", notificationId);
        }
      }
    );

    // 다음 날 알람은 유지 (이미 설정되어 있음)
    return;
  }

  // 예약 실패한 경우 처리
  if (!result.success) {
    console.error("[Catering] ❌ Reservation failed:", result.message);

    // 실패 횟수 확인
    const recentFailures = history
      .slice(0, 5)
      .filter((r) => !r.success && !r.message.includes("이미 예약"));

    if (recentFailures.length >= 3) {
      // 연속 3회 실패 시 알람 비활성화 제안
      console.warn(
        "[Catering] ⚠️ Multiple failures detected, consider disabling"
      );

      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
          title: "예약 실패 반복",
          message: "예약이 계속 실패하고 있습니다. 설정을 확인해주세요.",
          priority: 2, // 높은 우선순위
          requireInteraction: true, // 사용자가 직접 닫아야 함
        },
        (notificationId) => {
          if (chrome.runtime.lastError) {
            console.error(
              "[Catering] 알림 생성 실패:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("[Catering] 알림 생성 성공, ID:", notificationId);
          }
        }
      );
    } else {
      // 일반 실패 알림 (차수 정보 포함)
      const failureTitle = cateringTypeDisplay
        ? `${cateringTypeDisplay} 예약 실패`
        : "예약 실패";

      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
          title: failureTitle,
          message: result.message || "예약에 실패했습니다.",
          priority: 2, // 높은 우선순위
          requireInteraction: false,
        },
        (notificationId) => {
          if (chrome.runtime.lastError) {
            console.error(
              "[Catering] 알림 생성 실패:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("[Catering] 알림 생성 성공, ID:", notificationId);
          }
        }
      );
    }

    // 실패해도 다음 날 알람은 유지
    return;
  }

  // 예약 성공한 경우
  console.log("[Catering] ✅ Reservation successful!");

  // 알림 표시 (성공) - 차수 정보 포함
  const successTitle = cateringTypeDisplay
    ? `${cateringTypeDisplay} 예약 성공!`
    : "예약 성공!";

  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: chrome.runtime.getURL("public/icons/icon128.png"),
      title: successTitle,
      message: result.message || "예약이 완료되었습니다.",
      priority: 2, // 높은 우선순위
      requireInteraction: false, // 자동으로 사라짐
    },
    (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[Catering] 알림 생성 실패:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("[Catering] 알림 생성 성공, ID:", notificationId);
      }
    }
  );

  // 성공한 경우 오늘은 더 이상 시도하지 않음 (다음 날 알람은 유지)
  console.log("[Catering] Result saved:", result);
}

/**
 * 알림 클릭 핸들러 - 알림 클릭 시 대시보드 열기
 */
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log("[Catering] 🔔 Notification clicked:", notificationId);
  const dashboardUrl = "https://cateringreservationsystem.vercel.app/dashboard";
  chrome.tabs.create({ url: dashboardUrl });
  chrome.notifications.clear(notificationId);
});

// Service Worker 시작 시 알람 재설정
chrome.storage.local.get("schedule").then((data) => {
  console.log("[Catering] 🚀 Service Worker started, checking schedule...");
  if (data.schedule) {
    const schedule = data.schedule as ReservationSchedule;
    console.log("[Catering] 📅 Found schedule, setting up alarm:", {
      enabled: schedule.enabled,
      targetHour: schedule.targetHour,
      targetMinute: schedule.targetMinute,
      hasData: !!schedule.reservationData,
    });
    setupDailyAlarm(schedule);
  } else {
    console.log("[Catering] ⚠️ No schedule found in storage");
  }
});

// Service Worker 활성화 확인
chrome.runtime.onStartup.addListener(() => {
  console.log("[Catering] 🔄 Chrome startup detected, reinitializing...");
  chrome.storage.local.get("schedule").then((data) => {
    if (data.schedule) {
      setupDailyAlarm(data.schedule as ReservationSchedule);
    }
  });
});
