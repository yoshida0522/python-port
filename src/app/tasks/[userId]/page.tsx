"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./page.module.css";
import useTasks from "../../utils/useTasks";
import daleteTask from "../../utils/useTaskDelete";
import { Task } from "../../types";

const Tasks = () => {
  const router = useRouter();
  const { userId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksFromHook = useTasks((userId as string) || "");

  useEffect(() => {
    if (userId && tasksFromHook.length > 0) {
      setTasks(tasksFromHook);
    }
  }, [userId, tasksFromHook]);

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.implementation_date);
    const dateB = new Date(b.implementation_date);
    return dateA.getTime() - dateB.getTime();
  });

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (userId) {
      await daleteTask(userId as string);
    }
    router.back();
  };

  return (
    <div className={style.taskList}>
      <h1>タスク一覧</h1>
      <div className={style.taskCardContainer}>
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div key={task.task_id} className={style.taskCard}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.implementation_date}</p>
            </div>
          ))
        ) : (
          <p className={style.taskComment}>該当するタスクがありません。</p>
        )}
      </div>
      <div>
        <button onClick={handleBack} className={style.back}>
          戻る
        </button>
        <button onClick={handleDelete} className={style.delete}>
          全件削除
        </button>
      </div>
    </div>
  );
};

export default Tasks;
