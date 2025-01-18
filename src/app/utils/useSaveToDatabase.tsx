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

      console.log("既存データを確認中: user_id =", user_Id);
      console.log("受け取ったデータ:", data);

      const currentDate = new Date().toISOString().split("T")[0];

      const requestData = {
        ...data,
        user_id: user_Id,
        date: currentDate,
      };

      const checkResponse = await fetch(`${BASE_URL}/goals/${user_Id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!checkResponse.ok) {
        throw new Error("データベース確認中にエラーが発生しました");
      }

      const existingData = await checkResponse.json();
      console.log("取得した既存データ:", existingData);

      if (
        existingData.some(
          (item: { user_id: string }) => item.user_id === user_Id
        )
      ) {
        console.log("一致するuser_idが見つかりました。データを更新します。");

        const updateResponse = await fetch(`${BASE_URL}/goals/${user_Id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!updateResponse.ok) {
          const errorDetails = await updateResponse.json();
          console.error("エラー詳細:", errorDetails);
          throw new Error("データ更新中にエラーが発生しました");
        }

        console.log("データが正常に更新されました");
        return;
      }

      console.log(
        "一致するuser_idは見つかりませんでした。新しいデータを追加します。"
      );

      const insertResponse = await fetch(`${BASE_URL}/goals/${user_Id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("送信するデータ:", requestData);

      if (!insertResponse.ok) {
        const errorDetails = await insertResponse.json();
        console.error("エラー詳細:", errorDetails);
        throw new Error("データ追加中にエラーが発生しました");
      }

      console.log("新しいデータが正常に追加されました");
    } catch (error) {
      console.error("saveToDatabase実行中にエラーが発生しました:", error);
      throw error;
    }
  };

  return { saveToDatabase };
};

export default useSaveToDatabase;
