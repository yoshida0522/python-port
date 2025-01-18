"use client";
import { useRouter } from "next/navigation";
import { Task } from "../types";

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

    console.log("Total tasks for today:", totalTasks);
    console.log("Completed tasks for today:", completedTasks);
    console.log(`Completion rate for today: ${completionRate}`);

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

    try {
      const response = await fetch(`${BASE_URL}/graph/${userId}`, {
        method: "POST",
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

    for (const task of incompleteTasks) {
      const newDate = new Date(task.implementation_date);
      newDate.setDate(newDate.getDate() + 1);
      const updatedTask: Task = {
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
    router.back();
  };

  return { handleReportLogic };
};

export default useReport;
