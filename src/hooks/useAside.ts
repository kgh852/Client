"use client";

import { useState, useMemo, useCallback } from "react";

interface BookingInfo {
  studentId: string;
  studentName: string;
  bookingDate: string;
  bookingTime: string;
}

interface UseAsideReturn {
  selectedDate: number | null;
  selectedTime: string;
  currentDate: Date;
  selectedDateText: string;
  currentMonthText: string;
  timeSlots: string[];
  bookingData: BookingInfo;
  timeSelectionData: {
    selectedTime: string;
    selectedDate: string;
    timeSlots: string[];
  };
  actions: {
    setSelectedDate: (date: number) => void;
    setSelectedTime: (time: string) => void;
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
    handleEditBooking: () => void;
    handleCancelBooking: () => void;
    handleNewBooking: () => void;
  };
}

export const useAside = (
  initialBookingData?: Partial<BookingInfo>,
): UseAsideReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(() => {
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === new Date().getFullYear() &&
      today.getMonth() === new Date().getMonth();
    return isCurrentMonth ? today.getDate() : null;
  });
  const [selectedTime, setSelectedTime] = useState("09:30");

  const timeSlots = useMemo(
    () => [
      "08:40 ~ 09:30",
      "09:40 ~ 10:30",
      "10:40 ~ 11:30",
      "11:40 ~ 12:30",
      "12:40 ~ 13:40",
      "13:40 ~ 14:30",
      "14:40 ~ 15:30",
      "15:40 ~ 16:30",
      "16:40 ~ 18:10",
      "18:20 ~ 19:10",
    ],
    [],
  );

  const currentMonthText = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}`;
  }, [currentDate]);

  const selectedDateText = useMemo(() => {
    if (!selectedDate) return "날짜를 선택해주세요";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateObj = new Date(year, month, selectedDate);
    const dayNames = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return `${month + 1}월 ${selectedDate}일 ${dayNames[dateObj.getDay()]}`;
  }, [selectedDate, currentDate]);

  const bookingData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const defaultBookingDate = selectedDate
      ? `${year}년 ${month}월 ${selectedDate}일`
      : "날짜 미선택";
    return {
      studentId: initialBookingData?.studentId || "2105",
      studentName: initialBookingData?.studentName || "김은찬",
      bookingDate: initialBookingData?.bookingDate || defaultBookingDate,
      bookingTime: initialBookingData?.bookingTime || "9:00",
    };
  }, [initialBookingData, currentDate, selectedDate]);

  const timeSelectionData = useMemo(
    () => ({ selectedTime, selectedDate: selectedDateText, timeSlots }),
    [selectedTime, selectedDateText, timeSlots],
  );

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      setSelectedDate(null);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      setSelectedDate(null);
      return newDate;
    });
  }, []);

  const handleDateSelect = useCallback((date: number) => {
    setSelectedDate(date);
  }, []);

  const handleEditBooking = useCallback(() => {
    console.log("예약 수정:", bookingData);
  }, [bookingData]);

  const handleCancelBooking = useCallback(() => {
    console.log("예약 취소:", bookingData);
  }, [bookingData]);

  const handleNewBooking = useCallback(() => {
    if (!selectedDate) {
      console.log("날짜를 선택해주세요");
      return;
    }
  }, [selectedDate]);

  return {
    selectedDate,
    selectedTime,
    currentDate,
    selectedDateText,
    currentMonthText,
    timeSlots,
    bookingData,
    timeSelectionData,
    actions: {
      setSelectedDate: handleDateSelect,
      setSelectedTime,
      goToPrevMonth,
      goToNextMonth,
      handleEditBooking,
      handleCancelBooking,
      handleNewBooking,
    },
  };
};
