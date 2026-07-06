import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  ArrowRight,
  ArrowUp,
  Loader2,
} from 'lucide-react';
import { useChat } from '../../hooks/useAi';

/** sessionStorage key shared with AiAssistantPage so conversation carries over */
export const DASHBOARD_AI_CONV_KEY = 'fintrack_dashboard_ai_conv_id';

const QUICK_CHIPS = [
  'Summarize this month',
  'Am I close to my goals?',
  'Where can I save more?',
] as const;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const DashboardAIAssistantCard: React.FC = () => {
  const navigate = useNavigate();

  // Persist conversationId in sessionStorage so the full AI page can resume it
  const [conversationId, setConversationId] = useState<string | null>(() =>
    sessionStorage.getItem(DASHBOARD_AI_CONV_KEY)
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const chatMutation = useChat((data) => {
    const newConvId = data.conversationId;
    setConversationId(newConvId);
    sessionStorage.setItem(DASHBOARD_AI_CONV_KEY, newConvId);

    setMessages((prev) => [
      ...prev,
      {
        id: data.message.id,
        role: 'assistant',
        content: data.message.content,
      },
    ]);
  });

  // Auto-scroll feed to bottom on new messages / loading state
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || chatMutation.isPending) return;

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), role: 'user', content: trimmed },
      ]);
      setInput('');

      chatMutation.mutate({ message: trimmed, conversationId });
    },
    [chatMutation, conversationId]
  );

  const handleOpenFull = () => {
    // Navigate; AiAssistantPage reads DASHBOARD_AI_CONV_KEY on mount to resume
    navigate('/ai-assistant');
  };

  const isEmpty = messages.length === 0 && !chatMutation.isPending;

  return (
    <div
      className="w-full rounded-2xl flex flex-col flex-1"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        // flex-1 lets this card grow to fill remaining left-column height;
        // maxHeight removed so height is driven purely by the grid stretch.
      }}
    >
      {/* ── Header row ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.45)' }} />
          <span className="text-sm font-semibold" style={{ color: '#fff' }}>
            AI Assistant
          </span>
        </div>
        <button
          onClick={handleOpenFull}
          className="flex items-center gap-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          aria-label="Open full AI Assistant page"
        >
          <span>Open full view</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Message feed ─────────────────────────────────────
           flex-1 min-h-0: feed stretches to absorb all available space
           so suggestion chips and input bar stay cleanly at the bottom.
      ────────────────────────────────────────────────────────── */}
      <div
        ref={feedRef}
        className="flex-grow overflow-y-auto px-5 pt-4 space-y-3 min-h-0"
        aria-live="polite"
        aria-label="AI conversation"
      >
        {isEmpty ? (
          /* Proactive placeholder tile */
          <div
            className="rounded-xl p-3.5 text-left"
            style={{ background: '#141414' }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Ask me anything about your finances — spending trends, goal progress, where to save more, or anything else.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isAI = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                  style={
                    isAI
                      ? { background: '#141414', color: 'rgba(255,255,255,0.78)' }
                      : {
                          background: '#fff',
                          color: '#000',
                        }
                  }
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}

        {/* Loading / typing indicator */}
        {chatMutation.isPending && (
          <div className="flex justify-start" aria-label="AI is thinking">
            <div
              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
              style={{ background: '#141414' }}
            >
              <Loader2
                className="h-3.5 w-3.5 animate-spin shrink-0"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              />
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Thinking…
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Quick-suggestion chips ──────────────────────────── */}
      <div
        className="px-5 pt-3 pb-0 flex flex-wrap gap-2 shrink-0"
        aria-label="Quick prompts"
      >
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            disabled={chatMutation.isPending}
            className="rounded-full px-3 py-1 text-[11.5px] font-medium transition-all disabled:opacity-40 active:scale-[0.97]"
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
            onMouseEnter={e => {
              if (!chatMutation.isPending) {
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── Input bar — always at bottom ──────────────────────── */}
      <div className="px-5 py-4 shrink-0">
        {/* Visually hidden label for accessibility */}
        <label htmlFor="dashboard-ai-input" className="sr-only">
          Ask about your finances
        </label>
        <div className="relative flex items-center">
          <input
            id="dashboard-ai-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask about your finances"
            disabled={chatMutation.isPending}
            className="w-full pr-11 pl-4 py-2.5 text-[13px] font-medium transition-all focus:outline-none disabled:opacity-50"
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              color: '#fff',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || chatMutation.isPending}
            aria-label="Send message"
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-30 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
            style={{ background: '#fff', color: '#000' }}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAIAssistantCard;
