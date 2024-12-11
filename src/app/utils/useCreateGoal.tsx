import { useState } from "react";
import { TaskObj, WorkflowInput } from "../types";
import useSaveTask from "./useSaveTask";

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

      const response = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: dbData,
          user: "user-id-or-identifier",
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
      console.log("ワークフロー実行結果:", result);

      if (result?.data?.outputs?.answer) {
        const answer = result.data.outputs.answer;
        const tasks: TaskObj[] = parseAnswerToTasks(answer);
        if (tasks.length === 0) {
          throw new Error(
            "解析されたタスクが空です。ワークフロー結果を確認してください。"
          );
        }
        await saveTasks(tasks);
        return answer;
      } else {
        console.error("outputsが存在しないか、構造が異なります", result);
        return null;
      }
      // } catch (error) {
      //   console.error("ワークフロー実行エラー:", error);
      //   setWorkflowError(
      //     error instanceof Error ? error.message : "未知のエラーが発生しました"
      //   );
    } catch {
      return null;
    } finally {
      setWorkflowLoading(false);
    }
  };

  const parseAnswerToTasks = (answer: string): TaskObj[] => {
    const tasks: TaskObj[] = [];
    const userId = "674d18bcc09c624f84d48a5f";

    try {
      // 先頭の不要なテキストをスキップしてJSON部分を抽出
      const jsonStart = answer.indexOf("["); // JSON開始位置
      const jsonEnd = answer.lastIndexOf("]") + 1; // JSON終了位置

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("JSON形式のデータが見つかりません");
      }

      const jsonString = answer.substring(jsonStart, jsonEnd); // JSON部分を取り出す

      // JSONを解析してtasksに変換
      const answerJson = JSON.parse(jsonString); // JSON解析

      answerJson.forEach(
        (entry: { date: string; title: string; tasks: string[] }) => {
          const implementationDate = entry.date;
          const title = entry.title;

          // 各タスクを追加
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
