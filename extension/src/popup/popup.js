// 관리 웹사이트 URL (배포 후 수정)
const DASHBOARD_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
  // 상태 조회
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    if (!response) return;

    const { schedule, lastResult } = response;
    updateStatusUI(schedule);
    updateLastResultUI(lastResult);
  });

  // 대시보드 열기 버튼
  document.getElementById('openDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: DASHBOARD_URL });
  });
});

function updateStatusUI(schedule) {
  const statusEl = document.getElementById('status');
  const targetTimeEl = document.getElementById('targetTime');
  const userNameEl = document.getElementById('userName');
  const cateringTypeEl = document.getElementById('cateringType');

  if (schedule?.enabled && schedule.reservationData) {
    statusEl.className = 'status enabled';
    statusEl.textContent = '자동 예약 활성화됨';

    const hour = schedule.targetHour.toString().padStart(2, '0');
    const minute = schedule.targetMinute.toString().padStart(2, '0');
    targetTimeEl.textContent = `${hour}:${minute}`;

    userNameEl.textContent = schedule.reservationData.name || '-';
    cateringTypeEl.textContent = schedule.reservationData.cateringType || '-';
  } else {
    statusEl.className = 'status disabled';
    statusEl.textContent = '자동 예약 비활성화';
    targetTimeEl.textContent = '-';
    userNameEl.textContent = '-';
    cateringTypeEl.textContent = '-';
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
