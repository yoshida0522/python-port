import { useState, useEffect } from "react";
import { WorkflowInput } from "../types";
import useSaveTask from "./useSaveTask";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";
import axios from "axios";
import { parseAnswerToTasks } from "../libs/parseAnswerToTasks";

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

      const tasks = parseAnswerToTasks(answer, userId);
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

  return {
    executeWorkflow,
    workflowLoading: workflowLoading || saveLoading,
    workflowError: workflowError || saveError,
  };
};

export default useCreateGoal;
