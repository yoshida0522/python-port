import axios from "axios";

const useTaskDelete = async (userId: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.delete(`${BASE_URL}/all-tasks/${userId}`);
    if (response.status === 200) {
    } else {
      throw new Error(
        `タスクの削除に失敗しました (status: ${response.status})`
      );
    }

    const graphResponse = await axios.delete(`${BASE_URL}/graph/${userId}`);

    if (graphResponse.status === 200) {
    } else {
      throw new Error(
        `Graphデータの削除に失敗しました (status: ${graphResponse.status})`
      );
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
};

export default useTaskDelete;
