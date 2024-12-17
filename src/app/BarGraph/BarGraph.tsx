"use client";
import React, { useEffect, useRef, useState } from "react";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import style from "./page.module.css";

function BarGraph() {
  const userId = "674d18bcc09c624f84d48a5f";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState<{
    dates: string[];
    achievements: number[];
  }>({
    dates: [],
    achievements: [],
  });

  Chart.register(CategoryScale, LinearScale, BarElement);

  // MongoDBからデータ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/graph/${userId}`);
        const result = await response.json();
        console.log("取得データ:", result);

        // 取得したデータが配列であることを確認
        if (Array.isArray(result) && result.length > 0) {
          // データが正しく取得されていれば、mapを使って処理
          const dates = result.map(
            (item: { task_date: string }) => item.task_date
          );
          const achievements = result.map(
            (item: { completion_rate: number }) => item.completion_rate
          );

          setGraphData({ dates, achievements });
        } else {
          console.error("取得したデータは空か無効です:", result);
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (graphData.dates.length === 0) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const achievementChart = new Chart(ctx, {
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
  }, [graphData]);

  return (
    <div className={style.barGraph}>
      <canvas ref={canvasRef} width="420" height="300"></canvas>
    </div>
  );
}

export default BarGraph;
