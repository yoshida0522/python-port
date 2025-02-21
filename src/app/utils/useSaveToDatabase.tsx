import axios from "axios";
import { auth } from "../firebase";

const useSaveToDatabase = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const saveToDatabase = async (data: {
    goal: string;
    duration: string;
    daily_time: string;
    level: string;
    approach: string;
  }) => {
    try {
      const user_Id = auth.currentUser?.uid;

      if (!user_Id) {
        throw new Error("ユーザーIDが取得できませんでした");
      }

      const currentDate = new Date().toISOString().split("T")[0];

      const requestData = {
        ...data,
        user_id: user_Id,
        date: currentDate,
      };

      const checkResponse = await axios.get(`${BASE_URL}/goals/${user_Id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (
        checkResponse.data.some(
          (item: { user_id: string }) => item.user_id === user_Id
        )
      ) {
        await axios.put(`${BASE_URL}/goals/${user_Id}`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return;
      }

      console.log("送信データ:", requestData);
      await axios.post(`${BASE_URL}/goals/${user_Id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("saveToDatabase実行中にエラーが発生しました:", error);
      throw error;
    }
  };

  return { saveToDatabase };
};

export default useSaveToDatabase;
