import axios from "axios";

import { ErrorMessage, isErrorMessage } from "./error";

export const api = axios.create({
  baseURL: "/api",
});

export async function postRequest<T, S = any>(
  url: string,
  data: S,
): Promise<T | ErrorMessage> {
  try {
    const response = await api.post<T>(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (isErrorMessage(error)) {
      if (error.error === "Failed to fetch" || !navigator.onLine) {
        return {
          error: "Please check that you are connected to the Internet.",
        };
      }
      return error;
    }
    return { error: "An error occurred" };
  }
}

export async function getRequest<T>(url: string): Promise<T | ErrorMessage> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    if (isErrorMessage(error)) {
      return error;
    }
    return { error: "An error occurred" };
  }
}
