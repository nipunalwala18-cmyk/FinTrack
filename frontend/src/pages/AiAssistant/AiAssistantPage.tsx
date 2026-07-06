import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  HelpCircle,
  PiggyBank,
  Wallet,
  Calendar,
  Compass,
  Loader2
} from 'lucide-react';
import { useConversations, useConversation, useChat, useDeleteConversation } from '../../hooks/useAi';
import type { AiMessage } from '../../services/ai.service';

const SUGGESTED_PROMPTS = [
  { text: 'Summarize my finances', icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  { text: 'Add an expense of ₹500 on groceries today', icon: Wallet, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  { text: 'Create a savings goal named "Car Fund"', icon: PiggyBank, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
  { text: 'Show my current goals', icon: Compass, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
  { text: 'How much did I spend this month?', icon: Calendar, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
  { text: 'Where can I save money?', icon: HelpCircle, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' },
];

export const AiAssistantPage: React.FC = () => {
  const { data: conversations = [], isLoading: isLoadingList } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Fetch active conversation messages
  const { data: activeConversation, isLoading: isLoadingConversation } = useConversation(activeConversationId);
  const [localMessages, setLocalMessages] = useState<AiMessage[]>([]);

  const chatMutation = useChat((data) => {
    setActiveConversationId(data.conversationId);
    // Append LLM reply to local state if desired, or let useQuery refetch
  });

  const deleteMutation = useDeleteConversation(() => {
    if (activeConversationId) {
      setActiveConversationId(null);
      setLocalMessages([]);
    }
  });

  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync messages when query updates
  useEffect(() => {
    if (activeConversation?.messages) {
      setLocalMessages(activeConversation.messages);
    } else {
      setLocalMessages([]);
    }
  }, [activeConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, chatMutation.isPending]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || chatMutation.isPending) return;

    // Optimistically add user message to list
    const tempUserMsg: AiMessage = {
      id: Math.random().toString(),
      conversationId: activeConversationId || '',
      role: 'user',
      content: textToSend,
      toolExecuted: null,
      toolSuccess: null,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);
    setInputMsg('');

    chatMutation.mutate({
      message: textToSend,
      conversationId: activeConversationId,
    });
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setLocalMessages([]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteMutation.mutate(id);
    }
  };

  // Safe markdown text parser
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      if (content.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-black text-gray-900 dark:text-white mt-3 mb-1 uppercase tracking-wider">
            {content.slice(4)}
          </h4>
        );
      }
      if (content.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-sm font-black text-gray-900 dark:text-white mt-4 mb-1">
            {content.slice(3)}
          </h3>
        );
      }
      if (content.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-base font-black text-gray-900 dark:text-white mt-5 mb-2">
            {content.slice(2)}
          </h2>
        );
      }
      if (content.trim().startsWith('* ') || content.trim().startsWith('- ')) {
        return (
          <ul key={idx} className="list-disc pl-5 my-0.5 text-sm text-gray-700 dark:text-gray-300">
            <li>{parseBoldText(content.trim().slice(2))}</li>
          </ul>
        );
      }
      return (
        <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
          {parseBoldText(content)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-gray-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full rounded-3xl bg-white border border-gray-150 shadow-sm dark:bg-[#12131a] dark:border-gray-800 overflow-hidden animate-fade-in text-left">
      {/* Sidebar - Conversations list */}
      <div className="w-80 border-r border-gray-150 dark:border-gray-800 flex flex-col justify-between bg-gray-50/50 dark:bg-gray-900/10 shrink-0">
        <div className="p-4 border-b border-gray-150 dark:border-gray-800 space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">AI Assistant</h3>
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/10 hover:bg-purple-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingList ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse mx-2 my-1" />
            ))
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs font-semibold text-gray-400">
              No conversations yet. Start a new one!
            </div>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === activeConversationId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-400'
                      : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-150/40 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-purple-500" />
                    <span className="text-xs font-bold truncate">{c.title || 'Chat Session'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg hover:bg-white dark:hover:bg-gray-850 shadow-xs transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat interface */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#12131a]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {localMessages.length === 0 && !chatMutation.isPending ? (
            // Empty State Suggested Prompts
            <div className="max-w-2xl mx-auto py-12 space-y-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                  <Bot className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ask FinTrack AI</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your enterprise personal finance assistant. Check balances, log transactions, track goals, and analyze budgets.
                </p>
              </div>

              {/* Grid of prompts */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map((p, idx) => {
                  const PromptIcon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className="flex items-center gap-3 p-4 rounded-2xl border border-gray-150 bg-gray-50/20 hover:bg-gray-50 hover:shadow-xs transition-all dark:border-gray-800 dark:bg-gray-900/10 dark:hover:bg-gray-900/30 text-left active:scale-[0.99]"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${p.color}`}>
                        <PromptIcon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Messages List
            <div className="max-w-3xl mx-auto space-y-6">
              {localMessages.map((m) => {
                const isAI = m.role === 'assistant';
                return (
                  <div key={m.id} className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 shrink-0">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 border text-sm shadow-xs ${
                        isAI
                          ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-150 dark:border-gray-800/80 text-gray-850 dark:text-gray-250'
                          : 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/10'
                      }`}
                    >
                      {isAI ? renderMarkdown(m.content) : <p className="leading-relaxed">{m.content}</p>}
                    </div>
                    {!isAI && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-4 justify-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 shrink-0">
                    <Bot className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-800/80 rounded-2xl p-4 flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-gray-400">FinTrack AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-150 dark:border-gray-800 bg-gray-50/20 dark:bg-[#12131a]">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputMsg);
              }}
              placeholder="Ask me to summarize your spending, create budget, log expenses..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-5 pr-14 py-3.5 text-sm text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold shadow-xs"
            />
            <button
              onClick={() => handleSend(inputMsg)}
              disabled={!inputMsg.trim() || chatMutation.isPending}
              className="absolute right-2.5 p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
