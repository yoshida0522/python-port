"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./page.module.css";
import useTasks from "../../utils/useTasks";
import deleteTask from "../../utils/useTaskDelete";
import { Task } from "../../types";

const Tasks = () => {
  const router = useRouter();
  const { user_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksFromHook = useTasks((user_id as string) || "");

  useEffect(() => {
    if (user_id && tasksFromHook.length > 0) {
      setTasks(tasksFromHook);
    }
  }, [user_id, tasksFromHook]);

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.implementation_date);
    const dateB = new Date(b.implementation_date);
    return dateA.getTime() - dateB.getTime();
  });

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "タスクとグラフがリセットされます。\r\n一度削除されると元に戻せません。\r\n\r\n全件削除してもよろしいですか？"
    );
    if (confirmation) {
      if (user_id) {
        await deleteTask(user_id as string);
      }
    } else {
      return;
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
        {sortedTasks.length > 0 && (
          <button onClick={handleDelete} className={style.delete}>
            全件削除
          </button>
        )}
      </div>
    </div>
  );
};

export default Tasks;
