"use client";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useSaveToDatabase from "../utils/useSaveToDatabase";
import useSendRequest from "../utils/useSendRequest";
import { useState } from "react";

const Goals = () => {
  const router = useRouter();
  const { saveToDatabase } = useSaveToDatabase();
  const { question, setQuestion, history, sendRequest, loading } =
    useSendRequest();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const [goal, duration, daily_time, level, approach] = history.map(
      (entry) => entry.question
    );
    console.log(goal, duration, daily_time, level, approach);
    if (goal && duration && daily_time && level && approach) {
      const dbData = {
        goal,
        duration,
        daily_time,
        level,
        approach,
      };
      try {
        // await saveToDatabase(dbData);
        const result = await saveToDatabase(dbData);
        console.log("データベース保存結果:", result);
      } catch {
        setApiError("エラーが発生しました。再試行してください。");
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("必要なデータが不足しています");
    }

  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={style.center}>
      <h1>ヒアリング</h1>
      <textarea
        value={question}

        onChange={(e) => {
          setQuestion(e.target.value);
        }}
      ></textarea>
      <div>
        <button onClick={sendRequest} disabled={loading}>
          送信
        </button>
        <button onClick={handleSave} disabled={loading}>
          保存
        </button>

      </div>
      <div className={style.back}>
        <button onClick={handleBack}>戻る</button>
      </div>
      <h2>会話履歴</h2>
      {loading && <p>生成中です...</p>}
      {isSaving && <p>保存中です...</p>}
      {/* {workflowLoading && <p>ワークフローを実行中...</p>} */}
      <div className={style.scrollContainer}>
        <ul className={style.history}>
          {history.map((entry, index) => (
            <li key={index} className={style.message}>
              <div className={style.userMessage}>
                <strong>ユーザー:</strong> {entry.question}
              </div>
              <div className={style.botMessage}>
                <strong>ボット:</strong> {entry.answer}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* {error && <p className={style.error}>エラー: {error}</p>} */}
      {apiError && <p className={style.error}>{apiError}</p>}
      <div></div>
    </div>
  );
};

export default Goals;
