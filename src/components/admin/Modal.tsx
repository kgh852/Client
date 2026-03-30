import React from "react";
import { ChevronLeft } from "lucide-react";
import styles from "@/styles/Modal.module.css";
import axios from "axios";

type ModalType = "accepted" | "info";

type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "available";

interface TimeSlot {
  id?: number;
  time: string;
  status: BookingStatus;
  studentName?: string;
  studentId?: string;
  reason?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  timeSlot: TimeSlot;
  type: ModalType;
  onUpdateSlot?: (updatedSlot: TimeSlot) => void;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  selectedDate = "",
  timeSlot,
  type = "accepted",
  onUpdateSlot = () => {},
}) => {
  const handleSubmit = async () => {
    try {
      await axios.patch(
        `${process.env.SPRING_BOOT_API_URL}/advice/${timeSlot.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      onUpdateSlot?.({ ...timeSlot, status: "accepted" });
      alert("승인되었습니다.");
      onClose();
    } catch (e) {
      console.error(e);
      alert("승인 요청 실패");
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(
        `${process.env.SPRING_BOOT_API_URL}/advice/${timeSlot.id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      onUpdateSlot?.({ ...timeSlot, status: "rejected" });
      alert("거부되었습니다.");
      onClose();
    } catch (e) {
      console.error(e);
      alert("거부 요청 실패");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={styles.title}>{selectedDate}</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>학번</label>
            <div className={styles.displayBox}>{timeSlot.studentId}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>이름</label>
            <div className={styles.displayBox}>{timeSlot.studentName}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>상담 사유</label>
            <div className={styles.textareaDisplay}>{timeSlot.reason}</div>
          </div>
        </div>

        {type === "accepted" && timeSlot.status === "pending" && (
          <div className={styles.buttonGroup}>
            <button className={styles.cancelButton} onClick={handleReject}>
              거부
            </button>
            <button className={styles.submitButton} onClick={handleSubmit}>
              승인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;