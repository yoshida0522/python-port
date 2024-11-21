"use client";
import React, { useEffect, useRef } from "react";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import { barGraphData } from "../../sampleData/barGraphData";
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
        labels: barGraphData.dates, // X軸: 日付
        datasets: [
          {
            label: "日別達成度", // 凡例のラベル
            data: barGraphData.achievements, // 達成度データ
            backgroundColor: "rgba(54, 162, 235, 0.6)", // 棒の色
            borderColor: "rgba(54, 162, 235, 1)", // 棒の枠線の色
            borderWidth: 1, // 枠線の幅
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "日付", // X軸のタイトル
            },
          },
          y: {
            beginAtZero: true, // Y軸を0から始める
            max: 100, // 達成度の最大値を100%に固定
            title: {
              display: true,
              text: "達成率 (%)", // Y軸のタイトル
            },
            ticks: {
              callback: (value) => `${value}%`, // 単位を%に設定
            },
          },
        },
        plugins: {
          legend: {
            display: true, // 凡例を表示
            position: "top", // 凡例の位置
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
