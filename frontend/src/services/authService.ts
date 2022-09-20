import API from "@services/API";
import { User } from "@shared/types";

interface LoginResponse {
  token: string;
  data: User;
}

export const signup = async (email: string, password: string) =>
  API.post<LoginResponse>("/auth/register", { email, password }).then(
    (res) => res.data
  );

export const login = async (email: string, password: string) =>
  API.post<LoginResponse>("/auth/login", { email, password }).then(
    (res) => res.data
  );

export const getCurrentUserDetails = async () =>
  API.get<LoginResponse>("/auth/verify-token").then(({ data }) => data?.data);
