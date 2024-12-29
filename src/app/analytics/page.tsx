"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useDayTasks from "../utils/useDayTask";
<<<<<<< HEAD
import useReport from "../utils/useReport";
import { getAuth } from "firebase/auth";
import { userGoal } from "../api/userGoal";
import { Task } from "../types";
=======
// import useReport from "../utils/useReport";
>>>>>>> b1fee1843aefd764461c2fb09e3980063b84f5db

const Analytics = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const tasksFromHook = useDayTasks(userId || "");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      setUserId(userId);
    } else {
      console.log("ユーザーが認証されていません");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      userGoal(userId).then((data) => {
        setTasks(data || []);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userId && tasksFromHook.length > 0) {
      setTasks(tasksFromHook);
    }
  }, [userId, tasksFromHook]);

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(
        (task) =>
          task.implementation_date.replace(/\//g, "-") ===
          new Date().toISOString().split("T")[0]
      )
    : [];

  const { handleReportLogic } = useReport(userId || "", filteredTasks);

  const handleBack = () => {
    router.back();
  };

  const handleTaskClick = async (task_Id: string) => {
    try {
      const taskToUpdate = tasks.find((task) => task.task_id === task_Id);
      if (!taskToUpdate) {
        throw new Error("Task not found");
      }

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };

      const response = await fetch(`http://localhost:8000/tasks/${task_Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === task_Id
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className={style.taskList}>
      <h1>タスク一覧</h1>
      <div className={style.taskCardContainer}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.task_id}
              className={`${style.taskCard} ${
                task.completed ? style.completed : style.pending
              }`}
              onClick={() => handleTaskClick(task.task_id)}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.implementation_date}</p>
            </div>
          ))
        ) : (
          <p className={style.analyticsComment}>該当するタスクがありません。</p>
        )}
      </div>
      <div>
        <button onClick={handleBack} className={style.back}>
          戻る
        </button>
        <button onClick={handleReportLogic}>進捗報告</button>
      </div>
    </div>
  );
};

export default Analytics;
