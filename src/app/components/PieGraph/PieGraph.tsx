"use client";
import React from "react";
import style from "./page.module.css";
import ProgressPieChart from "../PieChart/PieChart";

function PieGraph() {
  const progress = 20;
  const total = 100;

  return (
    <div className={style.pieGraph}>
      <div>
        <ProgressPieChart progress={progress} total={total} />
      </div>
    </div>
  );
}

export default PieGraph;
