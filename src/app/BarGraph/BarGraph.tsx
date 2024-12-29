// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
// import style from "./page.module.css";
// import { GraphData, GraphDataResponse } from "../types";

// function BarGraph() {
//   const userId = "674d18bcc09c624f84d48a5f";
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [graphData, setGraphData] = useState<GraphData>({
//     dates: [],
//     achievements: [],
//   });
//   const [error, setError] = useState<string | null>(null);

//   Chart.register(CategoryScale, LinearScale, BarElement);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/graph/${userId}`);
//         if (!response.ok) {
//           throw new Error(`Error fetching data: ${response.status}`);
//         }

//         const result: GraphDataResponse[] = await response.json();
//         console.log("取得データ:", result);

//         if (result.length > 0) {
//           const dates = result.map((item) => item.task_date);
//           const achievements = result.map((item) => item.completion_rate);
//           setGraphData({ dates, achievements });
//         } else {
//           setGraphData({ dates: [], achievements: [] }); // データが空の場合
//         }
//       } catch (error: unknown) {
//         console.error("データ取得エラー:", error);
//         setError("データを取得できませんでした。");
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (graphData.dates.length === 0) return;

//     const ctx = canvasRef.current?.getContext("2d");
//     if (!ctx) return;

//     const achievementChart = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: graphData.dates,
//         datasets: [
//           {
//             label: "日別達成度",
//             data: graphData.achievements,
//             backgroundColor: "rgba(54, 162, 235, 0.6)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: {
//             title: {
//               display: true,
//               text: "日付",
//             },
//           },
//           y: {
//             beginAtZero: true,
//             max: 100,
//             title: {
//               display: true,
//               text: "達成率 (%)",
//             },
//             ticks: {
//               callback: (value) => `${value}%`,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: true,
//             position: "top",
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => `達成度: ${context.raw}%`,
//             },
//           },
//         },
//       },
//     });

//     return () => achievementChart.destroy();
//   }, [graphData]);

//   return (
//     <div className={style.barGraph}>
//       {error ? (
//         <p>{error}</p>
//       ) : graphData.dates.length === 0 ? (
//         <p>データがありません。</p>
//       ) : (
//         <canvas ref={canvasRef} width="420" height="300"></canvas>
//       )}
//     </div>
//   );
// }

// export default BarGraph;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
import style from "./page.module.css";
import { GraphData, GraphDataResponse } from "../types";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";

function BarGraph() {
  const [userId, setUserId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    dates: [],
    achievements: [],
  });
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
=======
  const [error, setError] = useState<string | null>(null); 

>>>>>>> b1fee1843aefd764461c2fb09e3980063b84f5db

  Chart.register(CategoryScale, LinearScale, BarElement);

  // MongoDBからデータ取得
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

<<<<<<< HEAD
    if (user) {
      const userId = user.uid;
      setUserId(userId);
    } else {
      console.log("ユーザーが認証されていません");
    }
=======
        const result: GraphDataResponse[] = await response.json();
        console.log("取得データ:", result);

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
>>>>>>> b1fee1843aefd764461c2fb09e3980063b84f5db
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/graph/${userId}`);
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }

          const result: GraphDataResponse[] = await response.json();
          console.log("取得データ:", result);

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
  }, [userId]);

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
      {error ? (
        <p>{error}</p>
      ) : graphData.dates.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <canvas ref={canvasRef} width="420" height="300"></canvas>
      )}
    </div>
  );
}

export default BarGraph;
