"use client";
import { useEffect, useState } from "react";
import style from "./page.module.css";
import useDayTasks from "../../utils/useDayTask";
import useReport from "../../utils/useReport";
import { userGoal } from "../../api/userGoal";
import { Task } from "../../types";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import useHandleTaskClick from "@/app/utils/useHandleTaskClick";

const Analytics = () => {
  const router = useRouter();
  const { user_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [graphCheck, setGraphCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tasksFromHook = useDayTasks((user_id as string) || "");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const formattedToday = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    if (user_id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const goalData = await userGoal(user_id as string);
          setTasks(goalData || []);
          if (tasksFromHook.length > 0) {
            setTasks(tasksFromHook);
          }

          const response = await axios.get<{ task_date: string }[]>(
            `${BASE_URL}/graph/${user_id}`
          );
          const todayTasks = response.data.filter(
            (item) => item.task_date === formattedToday
          );
          if (todayTasks.length > 0) {
            setGraphCheck(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user_id, tasksFromHook, BASE_URL, formattedToday]);

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter(
        (task) =>
          task.implementation_date.replace(/\//g, "-") === formattedToday
      )
    : [];

  const { handleReportLogic } = useReport(
    (user_id as string) || "",
    filteredTasks
  );

  const handleBack = () => {
    router.back();
  };

  const handleTaskClick = useHandleTaskClick(tasks, setTasks, graphCheck);

  return (
    <div className={style.taskList}>
      <h1>今日のタスク</h1>
      <div className={style.taskCardContainer}>
        {isLoading ? (
          <p className={style.analyticsComment}>データの取得中です...</p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.task_id}
              className={`${style.taskCard} ${
                task.completed ? style.completed : style.pending
              }`}
              onClick={() => handleTaskClick(task.task_id)}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.implementation_date}</p>
            </div>
          ))
        ) : (
          <p className={style.analyticsComment}>該当するタスクがありません。</p>
        )}
      </div>
      <div>
        <button className={style.back} onClick={handleBack}>
          戻る
        </button>
        {filteredTasks.length > 0 && !graphCheck && (
          <button className={style.report} onClick={handleReportLogic}>
            進捗報告
          </button>
        )}
      </div>
    </div>
  );
};

export default Analytics;
