import { useState } from "react";
import { HistoryEntry, UseSendRequestReturn } from "../types";

const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const endpointURL = "https://api.dify.ai/v1/chat-messages";

const useSendRequest = (): UseSendRequestReturn => {
  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const sendRequest = async () => {
    if (!question) return;

    setLoading(true);

    const payload = {
      inputs: {
        conversation_history: history
          .map(
            (entry) => `ユーザー: ${entry.question}\nボット: ${entry.answer}`
          )
          .join("\n"),
      },
      query: question,
      response_mode: "blocking",
      conversation_id: conversationId || "",
      user: "abc-123",
    };

    try {
      const response = await fetch(endpointURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      setHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { question, answer: data.answer },
        ];
        const questions = updatedHistory.map((entry) => entry.question);
        console.log("Questions in history:", questions);

        return updatedHistory;
      });

      setQuestion("");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    history,
    sendRequest,
    loading,
    conversationId,
  };
};

export default useSendRequest;
