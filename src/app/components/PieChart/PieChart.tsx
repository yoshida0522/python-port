import React from "react";
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

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type ProgressPieChartProps = {
  progress: number;
  total: number;
};

const ProgressPieChart: React.FC<ProgressPieChartProps> = ({
  progress,
  total,
}) => {
  const percentage = total > 0 ? Math.min((progress / total) * 100, 100) : 0;
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
          const label = context.dataIndex === 0 ? "達成率" : "残り"; // `context.dataIndex`で達成率と残りを区別
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
