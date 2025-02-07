import { useState } from "react";
import daleteTask from "./useTaskDelete";
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
    if (confirmation) {
      if (userId) {
        await daleteTask(userId as string);
      }
      const [goal, duration, daily_time, level, approach] = history.map(
        (entry) => entry.question
      );
      if (goal && duration && daily_time && level && approach) {
        const dbData = {
          goal,
          duration,
          daily_time,
          level,
          approach,
        };
        try {
          await saveToDatabase(dbData);
          const workflowResult = await executeWorkflow(dbData);

          if (!workflowResult) {
            console.error("ワークフロー実行結果が null です");
            return;
          }
        } catch (error) {
          console.error("エラーが発生しました:", error);
        } finally {
          setIsSaving(false);
        }
      } else {
        console.error("必要なデータが不足しています");
      }
    } else {
      return;
    }
    router.push("/");
  };

  return {
    handleSave,
    isSaving,
    workflowLoading,
    workflowError,
  };
};

export default useGoalHandleSave;
