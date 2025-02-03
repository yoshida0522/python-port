import axios from "axios";

export const userGoal = async (user_id: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BASE_URL) {
    throw new Error("API URL is not defined in environment variables");
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/${user_id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user and goal data: ${error}`);
  }
};
