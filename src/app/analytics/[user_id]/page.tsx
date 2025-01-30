"use client";
import { useEffect, useMemo, useState } from "react";
import style from "./page.module.css";
import useDayTasks from "../../utils/useDayTask";
import useReport from "../../utils/useReport";
import { userGoal } from "../../api/userGoal";
import { Task } from "../../types";
import { useParams, useRouter } from "next/navigation";

const Analytics = () => {
  const router = useRouter();
  const { user_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksFromHook = useDayTasks((user_id as string) || "");
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    if (user_id) {
      const fetchData = async () => {
        try {
          const goalData = await userGoal(user_id as string);
          setTasks(goalData || []);

          if (tasksFromHook.length > 0) {
            setTasks(tasksFromHook);
          }

          // graphデータを取得
          const response = await fetch(`${BASE_URL}/graph/${user_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch graph data");
          }
          const graphData = await response.json();
          console.log("Graph Data:", graphData);
          // ここで graphData を適切に使いたい場合は、setTasks や他の状態に追加する
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [user_id, tasksFromHook, BASE_URL]);

  const today = new Date();
  const japanToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  const formattedToday = japanToday.toISOString().split("T")[0];

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(
        (task) =>
          task.implementation_date.replace(/\//g, "-") === formattedToday
      )
    : [];

  const { handleReportLogic } = useReport(
    (user_id as string) || "",
    filteredTasks
  );

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

      const response = await fetch(`${BASE_URL}/tasks/${task_Id}`, {
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
      <h1>今日のタスク</h1>
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
        <button className={style.back} onClick={handleBack}>
          戻る
        </button>
        <button className={style.report} onClick={handleReportLogic}>
          進捗報告
        </button>
      </div>
    </div>
  );
};

export default Analytics;
