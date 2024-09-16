import axios from "axios";

import { ErrorMessage, isErrorMessage } from "./error";

export const api = axios.create({
  baseURL: "/api",
});

export async function postRequest<T, S = any>(
  url: string,
  data: S,
  method: "POST" | "DELETE" | "PUT" | "PATCH" = "POST",
): Promise<T | ErrorMessage> {
  try {
    const response = await api.request<T>({
      url,
      method,
      data,
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.message === "Network Error" || !navigator.onLine) {
        return {
          error: "Please check that you are connected to the Internet.",
        };
      }
      // Handle known error message format
      if (error.response?.data && isErrorMessage(error.response.data)) {
        return error.response.data;
      }
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
