"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useDayTasks from "../utils/useDayTask";
// import useReport from "../utils/useReport";

const Analytics = () => {
  const router = useRouter();
  const userId = "674d18bcc09c624f84d48a5f";
  const tasksFromHook = useDayTasks(userId);
  const [tasks, setTasks] = useState(tasksFromHook);
  // const { handleReportLogic } = useReport();

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

  const handleReport = async () => {
    // 今日のタスク数
    const totalTasks = filteredTasks.length;

    // 今日のタスクの中でcompletedがtrueのタスク数
    const completedTasks = filteredTasks.filter(
      (task) => task.completed
    ).length;

    // completedがfalseのタスクIDを表示する
    // const incompleteTaskIds = filteredTasks
    //   .filter((task) => !task.completed)
    //   .map((task) => task.task_id);
    const incompleteTasks = filteredTasks.filter((task) => !task.completed);

    // 完了割合を計算（パーセンテージ）
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : "0";

    console.log("Total tasks for today:", totalTasks);
    console.log("Completed tasks for today:", completedTasks);
    console.log(`Completion rate for today: ${completionRate}`);
    // console.log("Incomplete Task IDs:", incompleteTaskIds);

    // implementation_dateの取得
    const implementationDate =
      filteredTasks.length > 0 ? filteredTasks[0].implementation_date : null;

    if (!implementationDate) {
      console.error("No tasks available for today's date.");
      return;
    }

    const reportData = {
      user_id: userId,
      task_date: implementationDate,
      total_task: totalTasks,
      completed_task: completedTasks,
      completion_rate: Number(completionRate),
      filteredTasks: filteredTasks,
    };

    try {
      const response = await fetch(`http://localhost:8000/graph/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error saving progress report:", errorDetails);
        throw new Error(
          `Failed to save progress report: ${
            errorDetails.detail || "Unknown error"
          }`
        );
      }

      console.log("Progress report saved successfully");
    } catch (error) {
      console.error("Error saving progress report:", error);
      return;
    }

    // 未完了タスクの`implementation_date`を翌日に変更
    for (const task of incompleteTasks) {
      const newDate = new Date(task.implementation_date);
      newDate.setDate(newDate.getDate() + 1);
      const updatedTask = {
        ...task,
        implementation_date: newDate.toISOString().split("T")[0],
      };

      try {
        const response = await fetch(
          `http://localhost:8000/tasks/${task.task_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update task with ID: ${task.task_id}`);
        }
        console.log(
          `Task ${task.task_id} updated with new date: ${updatedTask.implementation_date}`
        );
      } catch (error) {
        console.error("Error updating task date:", error);
      }
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
