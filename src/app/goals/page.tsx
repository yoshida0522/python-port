"use client";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import useSaveToDatabase from "../utils/useSaveToDatabase";
import useSendRequest from "../utils/useSendRequest";
import useCreateGoal from "../utils/useCreateGoal";
import { useState } from "react";

const Goals = () => {
  const router = useRouter();
  const { saveToDatabase } = useSaveToDatabase();
  const { question, setQuestion, history, sendRequest, loading } =
    useSendRequest();
  const { executeWorkflow, workflowLoading, workflowError } = useCreateGoal();
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
        const result = await saveToDatabase(dbData);
        console.log("データベース保存結果:", result);

        const workflowResult = await executeWorkflow(dbData);
        console.log("ワークフロー実行結果:", workflowResult);

        if (!workflowResult) {
          console.error("ワークフロー実行結果が null です");
          return;
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
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
        <button onClick={handleSave} disabled={loading || workflowLoading}>
          保存
        </button>

      </div>
      <div className={style.back}>
        <button onClick={handleBack}>戻る</button>
      </div>
      <h2>会話履歴</h2>
      {loading && <p className={style.loading}>生成中です...</p>}
      {isSaving && <p className={style.loading}>保存中です...</p>}
      {workflowLoading && (
        <p className={style.loading}>ワークフローを実行中...</p>
      )}
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
      {workflowError && <p className={style.error}>エラー: {workflowError}</p>}
      <div></div>
    </div>
  );
};

export default Goals;
