import { TaskObj } from "../types";
import { formatToLocalDate } from "./formatToLocalDate"; // formatToLocalDateのインポート

export const parseAnswerToTasks = (
  answer: string,
  userId: string | null
): TaskObj[] => {
  const tasks: TaskObj[] = [];
  const jsonStart = answer.indexOf("[");
  const jsonEnd = answer.lastIndexOf("]") + 1;

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("JSON形式のデータが見つかりません");
  }

  const jsonString = answer.substring(jsonStart, jsonEnd);
  const answerJson = JSON.parse(jsonString);

  answerJson.forEach(
    (entry: { date: string | Date; title: string; tasks: string[] }) => {
      let implementationDate: string;

      if (typeof entry.date === "string" && !isNaN(Date.parse(entry.date))) {
        implementationDate = new Date(entry.date).toISOString().split("T")[0];
      } else if (entry.date instanceof Date && !isNaN(entry.date.getTime())) {
        implementationDate = entry.date.toISOString().split("T")[0];
      } else {
        console.warn("無効な日付が検出されました:", entry.date);
        implementationDate = formatToLocalDate().split("T")[0];
      }

      const title = entry.title;

      entry.tasks.forEach((task: string) => {
        tasks.push({
          user_id: userId || "",
          title,
          implementation_date: implementationDate,
          description: task.trim(),
          completed: false,
        });
      });
    }
  );

  return tasks;
};
