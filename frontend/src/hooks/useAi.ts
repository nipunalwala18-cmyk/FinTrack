import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import type { AiConversation, AiMessage } from '../services/ai.service';
import { toast } from 'react-hot-toast';

export const useConversations = () => {
  return useQuery<AiConversation[]>({
    queryKey: ['ai-conversations'],
    queryFn: aiService.getConversations,
  });
};

export const useConversation = (id: string | null) => {
  return useQuery<AiConversation>({
    queryKey: ['ai-conversation', id],
    queryFn: () => aiService.getConversationById(id!),
    enabled: !!id,
  });
};

export const useChat = (onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    { conversationId: string; message: AiMessage; refresh: string[] },
    Error,
    { message: string; conversationId: string | null }
  >({
    mutationFn: ({ message, conversationId }) => aiService.chat(message, conversationId),
    onSuccess: (data) => {
      // Invalidate AI queries
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['ai-conversation', data.conversationId] });
      }

      // Dynamically invalidate active modules returned by tool call refresh
      if (data.refresh && data.refresh.length > 0) {
        data.refresh.forEach((moduleKey) => {
          queryClient.invalidateQueries({ queryKey: [moduleKey] });
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to send message';
      toast.error(msg);
    },
  });
};

export const useDeleteConversation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, string>({
    mutationFn: aiService.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      toast.success('Conversation deleted successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to delete conversation';
      toast.error(msg);
    },
  });
};
