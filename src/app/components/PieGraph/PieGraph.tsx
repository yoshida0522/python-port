"use client";
import React from "react";
import style from "./page.module.css";
import ProgressPieChart from "../PieChart/PieChart";
import { UserIdData } from "@/app/types";

const PieGraph: React.FC<UserIdData> = ({ user_id }) => {
  return (
    <div className={style.pieGraph}>
      <div>
        <ProgressPieChart user_id={user_id} />
      </div>
    </div>
  );
};

export default PieGraph;
