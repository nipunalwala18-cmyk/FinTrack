import { api } from '../api/axios';
import type { ApiResponse } from '../features/auth/types/auth.types';

export interface AiMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolExecuted: string | null;
  toolSuccess: boolean | null;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: AiMessage[];
}

export interface ChatResponse {
  conversationId: string;
  message: AiMessage;
  refresh: string[];
}

export const aiService = {
  chat: async (message: string, conversationId: string | null): Promise<ChatResponse> => {
    const response = await api.post<ApiResponse<ChatResponse>>('/ai/chat', {
      message,
      conversationId,
    });
    return response.data.data;
  },

  getConversations: async (): Promise<AiConversation[]> => {
    const response = await api.get<ApiResponse<AiConversation[]>>('/ai/conversations');
    return response.data.data;
  },

  getConversationById: async (id: string): Promise<AiConversation> => {
    const response = await api.get<ApiResponse<AiConversation>>(`/ai/conversations/${id}`);
    return response.data.data;
  },

  deleteConversation: async (id: string): Promise<{ id: string }> => {
    const response = await api.delete<ApiResponse<{ id: string }>>(`/ai/conversations/${id}`);
    return response.data.data;
  },
};
export default aiService;
