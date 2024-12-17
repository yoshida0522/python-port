import { useState } from "react";

/**
 * 日付をタイムゾーンに基づいてYYYY-MM-DD形式でフォーマットするカスタムフック
 * @param dateString - 入力された日付文字列
 * @returns YYYY-MM-DD形式の日付
 */
const useFormatDate = (dateString: string): string => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  // 日付のフォーマット処理
  const formatToLocalDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("無効な日付形式");
      }

      // タイムゾーンを考慮してローカルの日付を生成
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      // YYYY-MM-DD形式にフォーマット
      return localDate.toISOString().split("T")[0];
    } catch (error) {
      console.warn(
        "日付のフォーマットエラー:",
        error,
        "入力された日付:",
        dateString
      );

      // エラー時は今日の日付を返す
      const today = new Date();
      const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      );
      return localToday.toISOString().split("T")[0];
    }
  };

  // 日付をセット
  if (dateString) {
    setFormattedDate(formatToLocalDate(dateString));
  }

  return formattedDate;
};

export default useFormatDate;
