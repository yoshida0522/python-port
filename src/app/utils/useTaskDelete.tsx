import axios from "axios";

const useTaskDelete = async (userId: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.delete(`${BASE_URL}/all-tasks/${userId}`);
    if (response.status === 200) {
    } else {
      console.error("タスクの削除に失敗しました。");
    }

    const graphResponse = await axios.delete(`${BASE_URL}/graph/${userId}`);
    if (graphResponse.status === 200) {
    } else {
      console.error("Graphデータの削除に失敗しました。");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

export default useTaskDelete;
