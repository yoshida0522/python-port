"use client";

import { useEffect, useState } from "react";
import { Task } from "../types";
import axios from "axios";

const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks?user_id=${userId}`);
        if (!Array.isArray(response.data)) {
          setTasks([]);
          return;
        }

        const filteredTasks = response.data.filter(
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
