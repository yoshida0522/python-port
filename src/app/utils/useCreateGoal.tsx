import { useState, useEffect } from "react";
import { TaskObj, WorkflowInput } from "../types";
import useSaveTask from "./useSaveTask";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";
import axios from "axios";

const formatToLocalDate = (): string => {
  try {
    const now = new Date();
    const localDate = now.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const formattedDate = localDate.replace(/\//g, "-");
    return formattedDate;
  } catch (error) {
    console.warn("日付フォーマットエラー:", error);

    const fallbackDate = new Date();
    const fallbackLocalDate = fallbackDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fallbackLocalDate.replace(/\//g, "-");
  }
};

const useCreateGoal = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const { saveTasks, saveLoading, saveError } = useSaveTask();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        console.error("ユーザーが認証されていません");
      }
    });

    return () => unsubscribe();
  }, []);

  const executeWorkflow = async (
    dbData: WorkflowInput
  ): Promise<string | null> => {
    if (!userId) {
      console.error("ユーザーが認証されていません");
      return null;
    }

    setWorkflowLoading(true);
    setWorkflowError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DIFY_WORKFLOW_API_KEY;
      if (!apiKey) {
        throw new Error("APIキーが設定されていません");
      }

      const todayDate = new Date().toISOString().split("T")[0];
      const updatedDbData = { ...dbData, today: todayDate };
      const response = await axios.post(
        "https://api.dify.ai/v1/workflows/run",
        { inputs: updatedDbData, user: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const answer = response.data?.data?.outputs?.answer;
      if (!answer) throw new Error("outputsが不正です");

      const tasks = parseAnswerToTasks(answer);
      if (tasks.length === 0) throw new Error("解析されたタスクが空です");

      await saveTasks(tasks);
      return answer;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "エラーが発生しました";
      console.error(errorMessage);
      setWorkflowError(errorMessage);

      return null;
    } finally {
      setWorkflowLoading(false);
    }
  };

  const parseAnswerToTasks = (answer: string): TaskObj[] => {
    const tasks: TaskObj[] = [];

    try {
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

          if (
            typeof entry.date === "string" &&
            !isNaN(Date.parse(entry.date))
          ) {
            implementationDate = new Date(entry.date)
              .toISOString()
              .split("T")[0];
          } else if (
            entry.date instanceof Date &&
            !isNaN(entry.date.getTime())
          ) {
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
    } catch (error) {
      console.error("JSON解析エラー:", error);
    }

    return tasks;
  };

  return {
    executeWorkflow,
    workflowLoading: workflowLoading || saveLoading,
    workflowError: workflowError || saveError,
  };
};

export default useCreateGoal;
