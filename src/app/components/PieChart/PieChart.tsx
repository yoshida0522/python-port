import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
  ChartData,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const customTitlePlugin: Plugin = {
  id: "customTitlePlugin",
  beforeDraw(chart) {
    const ctx = chart.ctx;
    const { width, height, data } = chart;
    const percentage = (data.datasets[0]?.data?.[0] as number) || 0;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("達成率", width / 2, height / 2 - 10);
    ctx.font = "bold 30px Arial";
    ctx.fillText(`${percentage.toFixed(2)}%`, width / 2, height / 2 + 15);
  },
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  customTitlePlugin
);

type ProgressPieChartProps = {
  progress: number;
  total: number;
};

const ProgressPieChart: React.FC<ProgressPieChartProps> = ({
  progress,
  total,
}) => {
  const percentage = total > 0 ? Math.min((progress / total) * 100, 100) : 0;

  const chartData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "55%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default ProgressPieChart;
