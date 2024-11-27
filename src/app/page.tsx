"use client";
import { useState } from "react";
import Menu from "./components/Menu/Menu";
import PieGraph from "./components/PieGraph/PieGraph";
import BarGraph from "../app/BarGraph/BarGraph";
import Target from "./components/Target/Target";
import style from "./page.module.css";

export default function Home() {
  const [currentGraph, setCurrentGraph] = useState(0);

  const handleNext = () => {
    setCurrentGraph((prev) => (prev === 0 ? 1 : 0));
  };

  const handlePrev = () => {
    setCurrentGraph((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className={style.container}>
      <Target />
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
