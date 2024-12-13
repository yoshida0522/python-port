import { useState } from "react";
import { BarGraphData, Task } from "../types";

const useReport = () => {
  const [barGraphData, setBarGraphData] = useState<BarGraphData>({
    dates: [
      "2024-11-16",
      "2024-11-17",
      "2024-11-18",
      "2024-11-19",
      "2024-11-20",
    ],
    achievements: [45, 25, 90, 60, 75],
  });

  const updateTaskInDatabase = async (task: Task) => {
    try {
      const response = await fetch(
        `http://localhost:8000/tasks/${task.task_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task in the database");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleReportLogic = async (tasks: Task[]) => {
    const today = new Date().toISOString().split("T")[0];

    // 完了していないタスクを翌日に移動
    tasks.forEach((task) => {
      if (task.implementation_date === today && !task.completed) {
        const newDate = new Date(
          new Date(today).getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];

        const updatedTask = { ...task, implementation_date: newDate };
        updateTaskInDatabase(updatedTask); // データベースを更新
      }
    });

    // 当日のタスク完了率を算出
    const completedTasks = tasks.filter(
      (task) => task.implementation_date === today && task.completed
    );
    const completionRate =
      tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    // データ更新
    setBarGraphData((prevData) => ({
      dates: [...prevData.dates, today],
      achievements: [...prevData.achievements, completionRate],
    }));

    console.log("Updated Bar Graph Data:", barGraphData);
  };

  return { handleReportLogic };
};

export default useReport;
