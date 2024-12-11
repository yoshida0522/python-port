const useSaveToDatabase = () => {
  const saveToDatabase = async (data: {
    goal: string;
    duration: string;
    daily_time: string;
    level: string;
    approach: string;
  }) => {
    try {
      const user_Id = "674d18bcc09c624f84d48a5f";

      console.log("既存データを確認中: user_id =", user_Id);
      console.log("受け取ったデータ:", data);

      // 送信するデータに user_id を追加
      const requestData = {
        ...data,
        user_id: user_Id,
      };

      // まず、ユーザーIDで既存のデータがあるか確認する
      const checkResponse = await fetch(
        `http://127.0.0.1:8000/goals/${user_Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkResponse.ok) {
        throw new Error("データベース確認中にエラーが発生しました");
      }

      const existingData = await checkResponse.json();
      console.log("取得した既存データ:", existingData);

      // 既存データに同じuser_idがある場合
      if (
        existingData.some(
          (item: { user_id: string }) => item.user_id === user_Id
        )
      ) {
        console.log("一致するuser_idが見つかりました。データを更新します。");

        // 既存のデータがある場合は上書きする
        const updateResponse = await fetch(
          `http://127.0.0.1:8000/goals/${user_Id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

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

      const insertResponse = await fetch(
        `http://127.0.0.1:8000/goals/${user_Id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

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
