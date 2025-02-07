import { useState } from "react";
import { HistoryEntry, UseSendRequestReturn } from "../types";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const endpointURL = "https://api.dify.ai/v1/chat-messages";
const useSendRequest = (): UseSendRequestReturn => {
  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const sendRequest = async () => {
    if (!question) return;

    const periodRegex = /(1[2-9]|[2-9]\d+)ヶ月|か月|カ月|年/;
    if (periodRegex.test(question)) {
      setError("12ヶ月未満で入力してください");
      setQuestion("");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      inputs: {
        conversation_history: history
          .map(
            (entry) => `ユーザー: ${entry.question}\nボット: ${entry.answer}`
          )
          .join("\n\n"),
      },
      query: question,
      response_mode: "blocking",
      conversation_id: conversationId || "",
      user: "abc-123",
    };

    try {
      const response = await axios.post(endpointURL, payload, { headers });

      if (!conversationId) {
        setConversationId(response.data.conversation_id);
      }

      setHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { question, answer: response.data.answer },
        ];
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
    error,
  };
};

export default useSendRequest;
