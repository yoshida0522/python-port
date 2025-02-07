"use client";
import { useRouter } from "next/navigation";
import { Task } from "../types";
import axios from "axios";

const useReport = (userId: string, filteredTasks: Task[]) => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleReportLogic = async () => {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(
      (task) => task.completed
    ).length;
    const incompleteTasks = filteredTasks.filter((task) => !task.completed);

    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : "0";
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
      filteredTasks,
    };

    const confirmation = window.confirm(
      "一度報告をすると翌日まで編集できなくなります。\r\n\r\n進捗報告してもよろしいですか？"
    );
    if (confirmation) {
      try {
        await axios.post(`${BASE_URL}/graph/${userId}`, reportData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error saving progress report:", error);
        return;
      }

      for (const task of incompleteTasks) {
        const newDate = new Date(task.implementation_date);
        newDate.setDate(newDate.getDate() + 1);
        const updatedTask: Task = {
          ...task,
          implementation_date: newDate.toISOString().split("T")[0],
        };

        try {
          await axios.put(`${BASE_URL}/tasks/${task.task_id}`, updatedTask, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error updating task date:", error);
        }
      }
      router.back();
    } else {
      return;
    }
  };

  return { handleReportLogic };
};

export default useReport;
