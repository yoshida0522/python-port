"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
} from "chart.js";
import style from "./page.module.css";
import { GraphData, GraphDataResponse, UserIdData } from "../types";
import axios from "axios";
import { achievementChartData } from "../libs/achievementChartData";

const BarGraph: React.FC<UserIdData> = ({ user_id }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    dates: [],
    achievements: [],
  });
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  Chart.register(BarController, BarElement, CategoryScale, LinearScale);

  useEffect(() => {
    if (user_id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/graph/${user_id}`);
          const result: GraphDataResponse[] = await response.data;

          if (result.length > 0) {
            const dates = result.map((item) => item.task_date);
            const achievements = result.map((item) => item.completion_rate);
            setGraphData({ dates, achievements });
          } else {
            setGraphData({ dates: [], achievements: [] });
          }
        } catch (error: unknown) {
          console.error("データ取得エラー:", error);
          setError("データを取得できませんでした。");
        }
      };

      fetchData();
    }
  }, [user_id, BASE_URL]);

  useEffect(() => {
    if (graphData.dates.length === 0) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const achievementChart = achievementChartData(graphData, ctx);

    if (achievementChart) {
      return () => {
        achievementChart.destroy();
      };
    }
  }, [graphData]);

  return (
    <div className={style.barGraph}>
      {error ? (
        <p>{error}</p>
      ) : graphData.dates.length === 0 ? (
        <p className={style.comment}>データがありません。</p>
      ) : (
        <canvas ref={canvasRef} width="420" height="290"></canvas>
      )}
    </div>
  );
};

export default BarGraph;
