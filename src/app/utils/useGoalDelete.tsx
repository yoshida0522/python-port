import axios, { AxiosError } from "axios";

const useGoalDelete = async (userId: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const deleteResponse = await axios.delete(`${BASE_URL}/goals/${userId}`);

    if (deleteResponse.status === 200) {
      console.log("Goalデータの削除に成功しました。");
    } else {
      console.error(
        `Goalデータの削除に失敗しました。ステータスコード: ${deleteResponse.status}`
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        "サーバーエラー:",
        axiosError.response.status,
        axiosError.response.data
      );
    } else if (axiosError.request) {
      console.error(
        "リクエストは送信されたが、応答がありません:",
        axiosError.request
      );
    } else {
      console.error(
        "リクエストの設定中にエラーが発生しました:",
        axiosError.message
      );
    }
  }
};

export default useGoalDelete;
