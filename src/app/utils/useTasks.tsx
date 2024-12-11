"use client";

import { useEffect, useState } from "react";
import { Task } from "../types";


const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/tasks?user_id=${userId}`
        );
        const data: Task[] = await response.json();

        // dataが配列でない場合、空配列をセット
        if (!Array.isArray(data)) {
          setTasks([]);
          return;
        }

        const filteredTasks = data.filter(
          (task) => task.user_id === userId && !task.completed
        );

        // タスクがない場合は空配列をセット
        if (filteredTasks.length === 0) {
          setTasks([]);
        } else {
          setTasks(filteredTasks);
        }

      } catch (error) {
        console.error("タスクの取得中にエラーが発生しました", error);
      }
    };

    fetchTasks();
  }, [userId]);

  return tasks;
};

export default useTasks;
