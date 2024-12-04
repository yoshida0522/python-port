export const userGoal = async (userId: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BASE_URL) {
    throw new Error("API URL is not defined in environment variables");
  }
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch user and goal data: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};
