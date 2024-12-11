"use client";
import React from "react";
import style from "./page.module.css";
import ProgressPieChart from "../PieChart/PieChart";

function PieGraph() {
  return (
    <div className={style.pieGraph}>
      <div>
        <ProgressPieChart />
      </div>
    </div>
  );
}

export default PieGraph;
