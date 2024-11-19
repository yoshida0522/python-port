"use client";

import React from "react";
import { sampleData, Task } from "../sampleData/sample";
import style from "./page.module.css";
import { useRouter } from "next/navigation";

const Tasks = () => {
  const router = useRouter();
  const tasks: Task[] = sampleData;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={style.taskList}>
      <h1>タスク一覧</h1>
      <div className={style.taskCardContainer}>
        {tasks.map((task) => (
          <div key={task.id} className={style.taskCard}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleBack} className={style.back}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default Tasks;
