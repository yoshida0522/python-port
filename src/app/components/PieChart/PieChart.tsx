import React, { useEffect, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import style from "./page.module.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import confetti from "canvas-confetti";
import { UserIdData } from "@/app/types";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressPieChart: React.FC<UserIdData> = ({ user_id }) => {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    if (user_id) {
      const fetchTasks = async () => {
        try {
          const response = await fetch(`${BASE_URL}/tasks/${user_id}`, {
            method: "GET",
          });
          const data = await response.json();

          const tasks = Array.isArray(data) ? data : data.tasks || [];
          const totalTasks = tasks.length;
          const incompleteTasks = tasks.filter(
            (task: { completed: boolean }) => !task.completed
          ).length;
          const completionPercentage =
            totalTasks > 0
              ? ((totalTasks - incompleteTasks) / totalTasks) * 100
              : 0;

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
    if (progress === 100) {
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
    }
  }, [progress]);

  const percentage = total > 0 ? Math.min(progress, 100) : 0;
  const remainingPercentage = 100 - percentage;

  const chartData: ChartData<"pie"> = {
    datasets: [
      {
        data: [percentage, remainingPercentage],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: true,
        align: "center",
        anchor: "center",
        font: {
          weight: "bold",
          size: 18,
        },
        formatter: (value: number, context: { dataIndex: number }) => {
          const label = context.dataIndex === 0 ? "達成率" : "残り";
          return `${label}\n ${Math.round(value)}%`;
        },
      },
    },
  };

  return (
    <div className={style.graphSize}>
      {isLoading ? (
        <p>データを読み込んでいます...</p>
      ) : total === 0 ? (
        <div className={style.center}>
          <p className={style.comment}>データがありません</p>
        </div>
      ) : (
        <Pie data={chartData} options={options} />
      )}
    </div>
  );
};

export default ProgressPieChart;
