import { useState } from "react";
import deleteTask from "./useTaskDelete";
import useSaveToDatabase from "./useSaveToDatabase";
import useCreateGoal from "./useCreateGoal";
import { useRouter } from "next/navigation";
import { HistoryEntry } from "../types";

const useGoalHandleSave = (
  userId: string | undefined,
  history: HistoryEntry[],
  router: ReturnType<typeof useRouter>
) => {
  const { saveToDatabase } = useSaveToDatabase();
  const { executeWorkflow, workflowLoading, workflowError } = useCreateGoal();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const confirmation = window.confirm("目標設定をしてもよろしいですか？");
    if (!confirmation) return;

    try {
      if (userId) {
        await deleteTask(userId);
      }

      const [goal, duration, daily_time, level, approach] = history.map(
        (entry) => entry.question
      );

      if (!(goal && duration && daily_time && level && approach)) {
        console.error("必要なデータが不足しています");
        return;
      }

      const dbData = { goal, duration, daily_time, level, approach };

      await saveToDatabase(dbData);
      const workflowResult = await executeWorkflow(dbData);

      if (!workflowResult) {
        console.error("ワークフロー実行結果が null です");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("handleSave 実行中にエラーが発生しました:", error);
      if (error instanceof Error) {
        console.error("エラーメッセージ:", error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSave,
    isSaving,
    workflowLoading,
    workflowError,
  };
};

export default useGoalHandleSave;
