"use client";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useTasks from "../utils/useTasks";

const Tasks = () => {
  const router = useRouter();
  const userId = "674d18bcc09c624f84d48a5f";
  const tasks = useTasks(userId);

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.implementation_date);
    const dateB = new Date(b.implementation_date);
    return dateA.getTime() - dateB.getTime();
  });

  const handleBack = () => {
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
          <p>該当するタスクがありません。</p>
        )}
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
