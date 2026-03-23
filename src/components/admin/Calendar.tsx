import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/Calendar.module.css";

interface AdminCalendarSectionProps {
  selectedDate: number | null;
  onDateSelect: (date: number) => void;
  currentMonth: string;
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const AdminCalendarSection: React.FC<AdminCalendarSectionProps> = ({
  selectedDate,
  onDateSelect,
  currentMonth,
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        calendar.push([...currentWeek]);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendar.push([...currentWeek]);
    }

    return calendar;
  }, [currentDate]);

  const today = useMemo(() => {
    const now = new Date();
    const isCurrentMonth =
      now.getFullYear() === currentDate.getFullYear() &&
      now.getMonth() === currentDate.getMonth();

    return isCurrentMonth ? now.getDate() : null;
  }, [currentDate]);

  const isPastDate = (day: number | null) => {
    if (!day) return false;

    const now = new Date();
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    return dateToCheck < todayStart;
  };

  const getDateClassName = (day: number | null) => {
    if (!day) return styles.invisibleDate;

    const classes = [styles.dateButton];

    if (day === today) {
      classes.push(styles.todayDate);
    }

    if (day === selectedDate) {
      classes.push(styles.selectedDate);
    }

    if (isPastDate(day)) {
      classes.push(styles.pastDate);
    }

    return classes.join(" ");
  };

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.pageTitle}>예약 캘린더</h1>

      <div className={styles.calendarWrapper}>
        <div className={styles.header}>
          <button className={styles.navButton} onClick={onPrevMonth}>
            <ChevronLeft size={30} />
          </button>
          <span className={styles.month}>{currentMonth}</span>
          <button className={styles.navButton} onClick={onNextMonth}>
            <ChevronRight size={30} />
          </button>
        </div>

        <div className={styles.daysGrid}>
          {daysOfWeek.map((day, index) => (
            <div key={index} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {calendarDays.flat().map((day, index) => {
            const isToday = day === today;
            const isPast = isPastDate(day);

            return (
              <button
                key={index}
                onClick={() => day && !isPast && onDateSelect(day)}
                disabled={!day || isPast}
                className={getDateClassName(day)}
              >
                <div className={styles.dateContent}>
                  <span>{day}</span>
                  {isToday && <span className={styles.todayLabel}>오늘</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendarSection;
