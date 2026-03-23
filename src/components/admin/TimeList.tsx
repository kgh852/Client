import React from "react";
import styles from "@/styles/TimeLst.module.css";

type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "available";

interface TimeSlot {
  time: string;
  status: BookingStatus;
  studentName?: string;
  studentId?: string;
  reason?: string;
}

interface TimeSlotListProps {
  selectedDate: string | null;
  timeSlots: TimeSlot[];
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

const statusClassMap: Record<BookingStatus, string> = {
  pending: styles.statusPending,
  accepted: styles.statusAccepted,
  rejected: styles.statusRejected,
  expired: styles.statusExpired,
  available: styles.statusAvailable,
};

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  selectedDate,
  timeSlots,
  onTimeSlotSelect,
}) => {
  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "예약됨";
      case "accepted":
        return "승인됨";
      case "rejected":
        return "거부됨";
      case "expired":
        return "만료됨";
      default:
        return "";
    }
  };

  const now = new Date();

  const isExpired = (dateStr: string, timeStr: string) => {
    const endTime = timeStr.split("~")[1]?.trim();
    if (!endTime) return false;
    const slotDateTime = new Date(`${dateStr}T${endTime}:00`);
    return slotDateTime <= now;
  };

  if (!selectedDate) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>날짜를 선택해 주세요</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>예약 시간</h3>
        <p className={styles.dateText}>{selectedDate}</p>
      </div>

      <div className={styles.list}>
        {timeSlots.map((timeSlot) => {
          const expired = isExpired(selectedDate, timeSlot.time);
          const effectiveStatus: BookingStatus = expired
            ? "expired"
            : timeSlot.status;

          return (
            <button
              key={timeSlot.time}
              onClick={() => onTimeSlotSelect(timeSlot)}
              className={`${styles.timeSlot} ${statusClassMap[effectiveStatus]}`}
              disabled={
                effectiveStatus === "available" || effectiveStatus === "expired"
              }
            >
              <div className={styles.timeSlotContent}>
                <span className={styles.timeText}>{timeSlot.time}</span>
                <span className={styles.statusText}>
                  {getStatusText(effectiveStatus)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotList;
