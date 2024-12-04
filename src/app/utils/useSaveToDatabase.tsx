const useSaveToDatabase = () => {
  const saveToDatabase = async (data: {
    goal: string;
    duration: string;
    daily_time: string;
    level: string;
    approach: string;
  }) => {
    try {
      const userId = "674d18bcc09c624f84d48a5f";
      const response = await fetch(
        `http://127.0.0.1:8000/goals/?user_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data to database");
      }

      const result = await response.json();
      //   console.log("Data saved:", result);
      return result;
    } catch (error) {
      //   console.error("Error saving data:", error);
      throw error;
    }
  };

  return { saveToDatabase };
};

export default useSaveToDatabase;
