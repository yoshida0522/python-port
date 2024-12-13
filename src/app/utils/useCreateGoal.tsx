import { useState } from "react";
import { TaskObj, WorkflowInput } from "../types";
import useSaveTask from "./useSaveTask";

const formatToLocalDate = () => {
  try {
    const now = new Date();
    console.log("生成された現在の日付:", now);
    return now.toISOString().split("T")[0]; // ここでyyyy-mm-dd形式にする
  } catch (error) {
    console.warn("日付フォーマットエラー:", error);
    const fallbackDate = new Date();
    console.log("フォールバック日付:", fallbackDate);
    return fallbackDate.toISOString().split("T")[0]; // フォールバックでも同様にyyyy-mm-dd形式にする
  }
};

const useCreateGoal = () => {
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const { saveTasks, saveLoading, saveError } = useSaveTask();

  const executeWorkflow = async (
    dbData: WorkflowInput
  ): Promise<string | null> => {
    setWorkflowLoading(true);
    setWorkflowError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_DIFY_WORKFLOW_API_KEY;
      if (!apiKey) {
        throw new Error("APIキーが設定されていません");
      }

      // `today`の日付を生成
      const todayDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd形式に変更
      const updatedDbData = { ...dbData, today: todayDate };

      // リクエストデータをログ出力
      console.log("送信するデータ:", {
        inputs: updatedDbData,
        user: "user-id-or-identifier",
      });

      const response = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: updatedDbData, // 入力データ
          user: "user-id-or-identifier", // ユーザーID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラーレスポンス:", errorData);
        throw new Error(
          errorData.message || errorData.detail || "リクエストに失敗しました"
        );
      }

      const result = await response.json();
      const answer = result?.data?.outputs?.answer;
      if (!answer) throw new Error("outputsが不正です");

      const tasks = parseAnswerToTasks(answer);
      if (tasks.length === 0) throw new Error("解析されたタスクが空です");

      await saveTasks(tasks);
      return answer;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "未知のエラーが発生しました";
      console.error(errorMessage);
      setWorkflowError(errorMessage);

      return null;
    } finally {
      setWorkflowLoading(false);
    }
  };

  // 日付フォーマットを実行する関数にformatToLocalDateを使う
  const parseAnswerToTasks = (answer: string): TaskObj[] => {
    const tasks: TaskObj[] = [];
    const userId = "674d18bcc09c624f84d48a5f";

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

          // 日付バリデーション
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
            // 無効な日付の場合フォールバック
            console.warn("無効な日付が検出されました:", entry.date);
            implementationDate = formatToLocalDate().split("T")[0];
          }

          const title = entry.title;


          entry.tasks.forEach((task: string) => {
            tasks.push({
              user_id: userId,
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
