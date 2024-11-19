"use client";

import React, { useState } from "react";
import { sampleData, Task } from "../sampleData/sample";
import style from "./page.module.css";
import { useRouter } from "next/navigation";

const Tasks = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(sampleData);

  const toggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleBack = () => {
    router.back();
  };

  //   バックエンドの構築が出来たら削除
  const firstTask = tasks[0];

  return (
    <div className={style.taskList}>
      <h1>進捗報告</h1>
      <div className={style.taskCardContainer}>
        {firstTask && (
          <div
            key={firstTask.id}
            onClick={() => toggleComplete(firstTask.id)}
            className={`${style.taskCard} ${
              firstTask.isCompleted ? style.completed : style.pending
            }`}
          >
            <h3>{firstTask.title}</h3>
            <p>{firstTask.description}</p>
          </div>
        )}
      </div>
      <div>
        <button onClick={handleBack} className={style.back}>
          戻る
        </button>
        <button>進捗報告</button>
      </div>
    </div>
  );
};

export default Tasks;
