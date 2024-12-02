"use client";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import { useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const endpointURL = "https://api.dify.ai/v1/chat-messages";

const Goals = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const payload = {
    inputs: {},
    query: question,
    response_mode: "blocking",
    conversation_id: "",
    user: "abc-123",
  };

  const sendRequest = () => {
    const fetchData = async () => {
      const responce = await fetch(endpointURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      const data = await responce.json();
      console.log(data.answer);
      setAnswer(data.answer);
    };
    fetchData();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={style.center}>
      <h1>ヒアリング</h1>
      <textarea
        onChange={(e) => {
          setQuestion(e.target.value);
        }}
      ></textarea>
      <div>
        <button onClick={sendRequest}>送信</button>
      </div>
      <div className={style.back}>
        <button onClick={handleBack}>戻る</button>
      </div>
      <p>{answer}</p>
    </div>
  );
};

export default Goals;
