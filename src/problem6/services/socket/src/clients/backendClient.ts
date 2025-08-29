import axios from "axios";
import { config } from "../configs";

const backendClient = axios.create({
  baseURL: config.backendUrl,
  headers: {
    Authorization: `Bearer ${config.backendToken}`,
  },
});

export const addScore = async (user_id: string, score: number) => {
  const response = await backendClient.post("/api/scores", {
    user_id,
    score,
  });
  return response.data.data;
};

export const getMe = async (token: string) => {
  const response = await backendClient.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export default backendClient;