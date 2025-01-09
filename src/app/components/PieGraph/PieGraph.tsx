"use client";
import React from "react";
import style from "./page.module.css";
import ProgressPieChart from "../PieChart/PieChart";
import { UserIdData } from "@/app/types";

const PieGraph: React.FC<UserIdData> = ({ userId }) => {
  return (
    <div className={style.pieGraph}>
      <div>
        <ProgressPieChart userId={userId} />
      </div>
    </div>
  );
};

export default PieGraph;
