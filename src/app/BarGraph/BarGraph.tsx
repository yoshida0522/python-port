"use client";
import React, { useEffect, useRef } from "react";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import { barGraphData } from "../../app/sampleData/barGraphData";
import style from "./page.module.css";

function BarGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  Chart.register(CategoryScale, LinearScale, BarElement);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const achievementChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: barGraphData.dates,
        datasets: [
          {
            label: "日別達成度",
            data: barGraphData.achievements,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
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

    return () => achievementChart.destroy();
  }, []);

  return (
    <div className={style.barGraph}>
      <canvas ref={canvasRef} width="420" height="300"></canvas>{" "}
    </div>
  );
}

export default BarGraph;
