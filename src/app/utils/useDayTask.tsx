"use client";
import { useEffect, useState } from "react";
import { Task } from "../types";
import axios from "axios";

const useDayTasks = (user_id: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/tasks?user_id=${user_id}`
        );
        const data: Task[] = await response.data;

        if (!Array.isArray(data)) {
          setTasks([]);
          return;
        }

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
