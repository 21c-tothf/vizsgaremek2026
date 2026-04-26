import { apiClient } from "@/api/axios";
import type {
  MessageCreateRequest,
  MessageResponse,
  MessageThreadResponse
} from "@/types/messages";

const MESSAGES_BASE = "/messages";

export const messagesApi = {
  sendMessage: async (payload: MessageCreateRequest) => {
    const { data } = await apiClient.post<MessageResponse>(MESSAGES_BASE, payload);
    return data;
  },

  getMyListingsMessages: async () => {
    try {
      const { data } = await apiClient.get<MessageThreadResponse[]>(`${MESSAGES_BASE}/my-listings`);
      return data;
    } catch {
      const { data } = await apiClient.get<MessageResponse[]>(`${MESSAGES_BASE}/my-messages`);
      return data;
    }
  },

  getMyMessages: async () => {
    const { data } = await apiClient.get<MessageResponse[]>(`${MESSAGES_BASE}/my-messages`);
    return data;
  },

  markAsRead: async (messageId: number | string) => {
    const { data } = await apiClient.patch<MessageResponse>(`${MESSAGES_BASE}/${messageId}/read`);
    return data;
  }
};