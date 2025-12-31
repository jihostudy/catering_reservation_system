/**
 * 예약 정보 타입
 */
export interface ReservationData {
  email: string;
  name: string;
  employeeId: string;
  cateringType: string;
}

/**
 * 예약 스케줄 설정
 */
export interface ReservationSchedule {
  enabled: boolean;
  targetHour: number;
  targetMinute: number;
  reservationData: ReservationData | null;
}

/**
 * 예약 실행 결과
 */
export interface ReservationResult {
  success: boolean;
  message: string;
  timestamp: number;
}

/**
 * 익스텐션 저장소 스키마
 */
export interface StorageSchema {
  schedule: ReservationSchedule;
  lastResult: ReservationResult | null;
  history: ReservationResult[];
}

/**
 * 메시지 타입 정의
 */
export type MessageType =
  | { type: "EXECUTE_RESERVATION"; data: ReservationData }
  | { type: "RESERVATION_RESULT"; result: ReservationResult }
  | { type: "GET_STATUS" }
  | { type: "UPDATE_SCHEDULE"; schedule: ReservationSchedule };

/**
 * 기본 스케줄 설정 (오후 3시)
 */
export const DEFAULT_SCHEDULE: ReservationSchedule = {
  enabled: false,
  targetHour: 15,
  targetMinute: 0,
  reservationData: null,
};
