import type { TokenPair } from "../types/auth";
import { http } from "./http";

export async function loginApi(username: string, password: string): Promise<TokenPair> {
  const { data } = await http.post<TokenPair>("/api/auth/login/", { username, password });
  return data;
}