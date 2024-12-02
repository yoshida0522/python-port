"use client";
import { useEffect, useState } from "react";
import Menu from "./components/Menu/Menu";
import PieGraph from "./components/PieGraph/PieGraph";
import BarGraph from "./barGraph/BarGraph";
import Target from "./components/Target/Target";
import style from "./page.module.css";
import { userGoal } from "./api/userGoal";

export default function Home() {
  const [currentGraph, setCurrentGraph] = useState(0);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    goal: "",
    daily: "",
    day_time: "",
    process: "",
  });

  useEffect(() => {
    const userId = "674d18bcc09c624f84d48a5f"; // MongoDB のユーザーIDを指定
    userGoal(userId).then((data) => setUserData(data));
    // .catch((error) => console.error(error));
  }, []);

  const handleNext = () => {
    setCurrentGraph((prev) => (prev === 0 ? 1 : 0));
  };

  const handlePrev = () => {
    setCurrentGraph((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className={style.container}>
      <Target goal={userData.goal} daily={userData.daily} />
      <div className={style.graphContainer}>
        <button className={style.prevButton} onClick={handlePrev}>
          ◀
        </button>
        {currentGraph === 0 ? <PieGraph /> : <BarGraph />}
        <button className={style.nextButton} onClick={handleNext}>
          ▶
        </button>
      </div>
      <Menu />
    </div>
  );
}
