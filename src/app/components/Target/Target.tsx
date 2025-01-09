import React, { useEffect, useState } from "react";
import style from "./page.module.css";
import { TargetProps, Task } from "@/app/types";

const Target: React.FC<TargetProps> = ({ goal, daily, userId }) => {
  const [remainingDays, setRemainingDays] = useState<number | null>(null);

  useEffect(() => {
    const calculateRemainingDays = (tasks: Task[]) => {
      const upcomingTasks = tasks.filter((task) => !task.completed);
      if (upcomingTasks.length > 0) {
        const latestDate = upcomingTasks
          .map((task) => new Date(task.implementation_date))
          .reduce((maxDate, currentDate) =>
            currentDate > maxDate ? currentDate : maxDate
          );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = latestDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        return diffDays;
      }
      return 0;
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${userId}`, {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }

        const result: Task[] = await response.json();
        console.log("Fetched data:", result);

        const days = calculateRemainingDays(result);
        setRemainingDays(days);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div className={style.targetForm}>
      <div className={style.text}>
        <h3>目標達成まで残り</h3>
        <h1 className={style.day}>
          {remainingDays !== null ? `${remainingDays}日!` : "読み込み中..."}
        </h1>
      </div>
      <div className={style.target}>
        <span>目標</span>
        <h2>{goal}</h2>
      </div>
      <div className={style.period}>
        <span>期間</span>
        <h2>{daily}</h2>
      </div>
    </div>
  );
};

export default Target;
