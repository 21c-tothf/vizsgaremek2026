import axios from "axios";
import type { ApiErrorResponse } from "@/types/api";

export interface ParsedApiError {
  message: string;
  details: string[];
}

export function parseApiError(error: unknown, fallbackMessage = "Something went wrong."): ParsedApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    return {
      message: data?.message || fallbackMessage,
      details: data?.details ?? []
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || fallbackMessage,
      details: []
    };
  }

  return {
    message: fallbackMessage,
    details: []
  };
}