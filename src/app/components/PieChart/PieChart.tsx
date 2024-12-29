import React, { useEffect, useState } from "react";
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
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressPieChart = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
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
      const fetchTasks = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/tasks/${userId}`,
            {
              method: "GET",
            }
          );
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
        }
      };

      fetchTasks();
    }
  }, [userId]);

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
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ProgressPieChart;
