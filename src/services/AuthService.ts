import axios from "../api/axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};
