import { Chart } from "chart.js";

export const achievementChartData = (
  graphData: { dates: string[]; achievements: number[] },
  ctx: CanvasRenderingContext2D | null
) => {
  if (!ctx) return;

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: graphData.dates,
      datasets: [
        {
          label: "日別達成度",
          data: graphData.achievements,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "日付",
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "達成率 (%)",
          },
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context) => `達成度: ${context.raw}%`,
          },
        },
      },
    },
  });
};
