"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./page.module.css";
import useTasks from "../../utils/useTasks";
import deleteTask from "../../utils/useTaskDelete";
import deleteGoal from "../../utils/useGoalDelete";
import { Task } from "../../types";

const Tasks = () => {
  const router = useRouter();
  const { user_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tasksFromHook = useTasks((user_id as string) || "");

  useEffect(() => {
    setIsLoading(true);
    if (user_id && tasksFromHook.length > 0) {
      setTasks(tasksFromHook);
    }
    setIsLoading(false);
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
    if (!user_id) return;
    const confirmation = window.confirm(
      "タスクとグラフがリセットされます。\r\n一度削除されると元に戻せません。\r\n\r\n全件削除してもよろしいですか？"
    );
    if (!confirmation) return;
    try {
      await deleteTask(user_id as string);
      await deleteGoal(user_id as string);
      router.back();
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  return (
    <div className={style.taskList}>
      <h1>タスク一覧</h1>
      <div className={style.taskCardContainer}>
        {isLoading ? (
          <p className={style.taskComment}>データの取得中です...</p>
        ) : sortedTasks.length > 0 ? (
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
