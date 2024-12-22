import axios from "axios";

const useTaskDelete = async (userId: string) => {
  console.log("Deleting tasks for userId:", userId);
  try {
    const response = await axios.delete(
      `http://localhost:8000/all-tasks/${userId}`
    );
    if (response.status === 200) {
      console.log("タスクの削除が成功しました。");
    } else {
      console.error("タスクの削除に失敗しました。");
    }

    const graphResponse = await axios.delete(
      `http://localhost:8000/graph/${userId}`
    );
    if (graphResponse.status === 200) {
      console.log("Graphデータの削除が成功しました。");
    } else {
      console.error("Graphデータの削除に失敗しました。");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

export default useTaskDelete;
