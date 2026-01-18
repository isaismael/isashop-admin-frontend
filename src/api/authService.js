import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
  logout: async () => {
    // tengo que crear un endpoint para el logout
    // await axios.post(`${API_URL}/auth/logout`);
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
  },
};
