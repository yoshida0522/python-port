import { useState } from "react";
import { TaskObj } from "../types";
import axios from "axios";

const useSaveTask = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const saveTasks = async (tasks: TaskObj[]) => {
    setSaveLoading(true);
    setSaveError(null);
    try {
      await axios.post(`${BASE_URL}/save-tasks/`, tasks, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("タスクの保存中にエラーが発生しました:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  return { saveTasks, saveLoading, saveError };
};

export default useSaveTask;
