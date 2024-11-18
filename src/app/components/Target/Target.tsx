"use client";
import React from "react";
import ProgressPieChart from "../PieChart/PieChart";
import style from "./page.module.css";

const Target = () => {
  const progress = 60; // 現在の進捗
  const total = 100; // 全体の目標

  return (
    <>
      <div className={style.targetForm}>
        <div className={style.text}>
          <h3>目標達成まで残り</h3>
          <h1 className={style.day}>21日!</h1>
        </div>
        <div className={style.target}>
          <span>目標</span>
          <h2>目標達成アプリを作る</h2>
        </div>
        <div className={style.period}>
          <span>期間</span>
          <h2>3週間</h2>
        </div>
      </div>
      <div className={style.pieGraph}>
        <div className={style.content}>
          <span className={style.achievement}>達成率</span>
          <span className={style.remaining}>残り</span>
        </div>
        <div className={style.pie}>
          <ProgressPieChart progress={progress} total={total} />
        </div>
      </div>
    </>
  );
};

export default Target;
