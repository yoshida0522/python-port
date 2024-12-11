"use client";
import { useEffect, useState } from "react";
import { Task } from "../types";

const useDayTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/tasks?user_id=${userId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks, status: ${response.status}`);
        }
        const data: Task[] = await response.json();

        if (!Array.isArray(data)) {
          setTasks([]);
          return;
        }

        console.log("Fetched tasks:", data);
        setTasks(data);
      } catch (error) {
        console.error("タスクの取得中にエラーが発生しました", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [userId]);

  return tasks;
};

export default useDayTasks;
