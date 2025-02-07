import { ChartData, ChartOptions } from "chart.js";

export const calculateChartData = (progress: number, total: number) => {
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

  return chartData;
};

export const chartOptions: ChartOptions<"pie"> = {
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
