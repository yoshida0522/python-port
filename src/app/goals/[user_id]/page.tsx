"use client";
import { useParams, useRouter } from "next/navigation";
import style from "./page.module.css";
import useSendRequest from "../../utils/useSendRequest";
import useGoalHandleSave from "@/app/utils/useGoalHandleSave";
import { useState } from "react";

const Goals = () => {
  const router = useRouter();
  const { user_id } = useParams();
  const { question, setQuestion, history, sendRequest, loading, error } =
    useSendRequest();
  const userId = Array.isArray(user_id) ? user_id[0] : user_id;
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const { handleSave, isSaving, workflowLoading, workflowError } =
    useGoalHandleSave(userId, history, router);

  const handleBack = () => {
    router.back();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (showPlaceholder) {
      setShowPlaceholder(false);
    }
  };

  return (
    <div className={style.center}>
      <h1>ヒアリング</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <textarea
        className={style.textarea}
        value={question}
        placeholder={showPlaceholder ? "達成したい目標を入力してください" : ""}
        onChange={handleTextareaChange}
      ></textarea>
      <div className={style.button}>
        <button className={style.backButton} onClick={handleBack}>
          戻る
        </button>
        <button
          className={style.sendButton}
          onClick={sendRequest}
          disabled={loading}
        >
          送信
        </button>
        <button
          className={style.saveButton}
          onClick={handleSave}
          disabled={loading || workflowLoading}
        >
          保存
        </button>
      </div>
      <h2>会話履歴</h2>
      {loading && <p className={style.loading}>生成中です</p>}
      {isSaving && <p className={style.loading}>保存中です</p>}
      {workflowLoading && <p className={style.loading}>ワークフローを実行中</p>}
      <div className={style.scrollContainer}>
        <ul className={style.history}>
          {history
            .slice()
            .reverse()
            .map((entry, index) => (
              <li key={index} className={style.message}>
                <div className={style.botMessage}>
                  <strong>ボット:</strong>
                  <div style={{ whiteSpace: "pre-line" }}>{entry.answer}</div>
                </div>
                <div className={style.userMessage}>
                  <strong>ユーザー:</strong>
                  <div style={{ whiteSpace: "pre-line" }}>{entry.question}</div>
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
