import React from "react";
import style from "./page.module.css";

const Target = () => {
  return (
    <>
      <div className={style.targetForm}>
        <div className={style.text}>
          <h3>目標達成まで残り</h3>
          <h1 className={style.day}>10日!</h1>
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
    </>
  );
};

export default Target;
