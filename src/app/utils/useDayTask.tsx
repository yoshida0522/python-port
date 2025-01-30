"use client";
import { useEffect, useMemo, useState } from "react";
import { Task } from "../types";

const useDayTasks = (user_id: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks?user_id=${user_id}`);
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
  }, [user_id, BASE_URL]);

  return tasks;
};

export default useDayTasks;
