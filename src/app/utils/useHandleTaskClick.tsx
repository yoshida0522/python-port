import axios from "axios";
import { Task } from "../types";

const useHandleTaskClick = (
  tasks: Task[],
  setTasks: (tasks: Task[] | ((prevTasks: Task[]) => Task[])) => void,
  graphCheck: boolean
) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleTaskClick = async (task_Id: string) => {
    if (graphCheck) return;
    try {
      const taskToUpdate = tasks.find((task) => task.task_id === task_Id);
      if (!taskToUpdate) throw new Error("Task not found");
      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };
      await axios.put(`${BASE_URL}/tasks/${task_Id}`, updatedTask, {
        headers: { "Content-Type": "application/json" },
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.task_id === task_Id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return handleTaskClick;
};

export default useHandleTaskClick;
