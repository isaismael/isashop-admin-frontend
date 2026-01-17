import { api } from "./axios";

export const loginRequest = (credentials) =>
  api.post("/api/auth/login", credentials);
