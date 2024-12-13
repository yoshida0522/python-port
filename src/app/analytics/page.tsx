"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useDayTasks from "../utils/useDayTask";
import useReport from "../utils/useReport";

const Analytics = () => {
  const router = useRouter();
  const userId = "674d18bcc09c624f84d48a5f";
  const tasksFromHook = useDayTasks(userId);
  const [tasks, setTasks] = useState(tasksFromHook);
  const { handleReportLogic } = useReport();

  useEffect(() => {
    setTasks(tasksFromHook);
    console.log("Tasks in state:", tasksFromHook);
  }, [tasksFromHook]);

  const filteredTasks = tasks.filter(
    (task) =>
      task.implementation_date.replace(/\//g, "-") ===
      new Date().toISOString().split("T")[0]
  );

  console.log("Filtered tasks:", filteredTasks);

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

  const handleReport = () => {
    handleReportLogic(tasks);
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
          <p>該当するタスクがありません。</p>
        )}
      </div>
      <div>
        <button onClick={handleBack} className={style.back}>
          戻る
        </button>
        <button onClick={handleReport}>進捗報告</button>
      </div>
    </div>
  );
};

export default Analytics;
