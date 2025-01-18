"use client";

import { useEffect, useMemo, useState } from "react";
import { Task } from "../types";

const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks?user_id=${userId}`);
        const data: Task[] = await response.json();

        if (!Array.isArray(data)) {
          setTasks([]);
          return;
        }

        const filteredTasks = data.filter(
          (task) => task.user_id === userId && !task.completed
        );

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
  }, [userId, BASE_URL]);

  return tasks;
};

export default useTasks;
