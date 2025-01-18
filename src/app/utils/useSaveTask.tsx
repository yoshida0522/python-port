import { useMemo, useState } from "react";
import { TaskObj } from "../types";

const useSaveTask = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  const saveTasks = async (tasks: TaskObj[]) => {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const response = await fetch(`${BASE_URL}/save-tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラーレスポンス:", errorData);
        throw new Error(errorData.detail || "タスクの保存に失敗しました");
      }

      console.log("タスクが正常に保存されました");
    } finally {
      setSaveLoading(false);
    }
  };

  return { saveTasks, saveLoading, saveError };
};

export default useSaveTask;
