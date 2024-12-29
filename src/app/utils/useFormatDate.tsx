import { useState } from "react";

const useFormatDate = (dateString: string): string => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  const formatToLocalDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("無効な日付形式");
      }

      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      return localDate.toISOString().split("T")[0];
    } catch (error) {
      console.warn(
        "日付のフォーマットエラー:",
        error,
        "入力された日付:",
        dateString
      );

      const today = new Date();
      const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      );
      return localToday.toISOString().split("T")[0];
    }
  };

  if (dateString) {
    setFormattedDate(formatToLocalDate(dateString));
  }

  return formattedDate;
};

export default useFormatDate;
