import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import style from "./page.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import confetti from "canvas-confetti";
import { UserIdData } from "@/app/types";
import axios from "axios";
import { calculateChartData, chartOptions } from "@/app/libs/chartUtils";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressPieChart: React.FC<UserIdData> = ({ user_id }) => {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (user_id) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/tasks/${user_id}`);
          const tasks = Array.isArray(response.data)
            ? response.data
            : response.data.tasks || [];
          const totalTasks = tasks.length;
          const incompleteTasks = tasks.filter(
            (task: { completed: boolean }) => !task.completed
          ).length;
          const completionPercentage =
            totalTasks > 0
              ? ((totalTasks - incompleteTasks) / totalTasks) * 100
              : 0;

          const tasksString = JSON.stringify(tasks);
          const storedTasks = localStorage.getItem("prevTasks");
          if (tasksString !== storedTasks) {
            localStorage.setItem("prevTasks", tasksString); // タスクを保存
            localStorage.removeItem("confettiFired"); // **発火フラグをリセット**
          }

          setTotal(totalTasks);
          setProgress(completionPercentage);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTasks();
    }
  }, [user_id, BASE_URL]);

  useEffect(() => {
    const hasFired = localStorage.getItem("confettiFired");

    if (progress === 100 && !hasFired) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0", "#ff6347", "#87ceeb", "#32cd32"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.4 },
          colors: ["#ff0", "#ff6347", "#87ceeb", "#32cd32"],
        });
      }, 1000);
      localStorage.setItem("confettiFired", "true");
    }
  }, [progress]);

  const chartData = calculateChartData(progress, total);

  return (
    <div className={style.graphSize}>
      {isLoading ? (
        <p>データを読み込んでいます...</p>
      ) : total === 0 ? (
        <div className={style.center}>
          <p className={style.comment}>データがありません</p>
        </div>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default ProgressPieChart;
