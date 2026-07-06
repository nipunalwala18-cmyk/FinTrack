import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2, Sparkles, Maximize2 } from 'lucide-react';
import { useChat } from '../../hooks/useAi';
import { useNavigate } from 'react-router-dom';

export const FloatingChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  const chatMutation = useChat((data) => {
    setConversationId(data.conversationId);
    setMessages((prev) => [
      ...prev,
      {
        id: data.message.id,
        role: 'assistant',
        content: data.message.content,
      },
    ]);
  });

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || chatMutation.isPending) return;

    if (!textToSend) setInputVal('');

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: 'user',
        content: text,
      },
    ]);

    chatMutation.mutate({
      message: text,
      conversationId,
    });
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const isAIAssistantPage = window.location.pathname.includes('/ai');

  // Close floating drawer automatically and hide widget when on full AI assistant page
  useEffect(() => {
    if (isAIAssistantPage) {
      setIsOpen(false);
    }
  }, [isAIAssistantPage]);

  if (isAIAssistantPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end text-left font-sans">
      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="mb-4 w-[380px] sm:w-[410px] h-[480px] flex flex-col overflow-hidden animate-zoom-in"
          style={{
            background: '#0a0a0a',
            border: '0.5px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white/80" />
              <div className="text-left">
                <h4 className="text-sm font-bold text-white leading-none">FinTrack AI</h4>
                <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Online Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/ai-assistant');
                }}
                title="Expand View"
                className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={toggleOpen}
                className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div ref={feedRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hidden">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Sparkles className="h-5 w-5 text-white/60" />
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-sm font-bold text-white">Quick Assistant</h5>
                  <p className="text-xs text-white/40 max-w-[220px] leading-relaxed">
                    Ask me to log an expense or check your balances anytime!
                  </p>
                </div>
                {/* Onboarding Chips */}
                <div className="flex flex-col gap-2 w-full pt-2">
                  {[
                    '📊 Summarize my finances',
                    '🎯 Create a savings goal',
                    '💳 Show account balances',
                  ].map((chipText, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chipText.slice(2))}
                      className="w-full py-2.5 rounded-xl border text-xs font-semibold text-white/80 text-left px-4 transition-all cursor-pointer"
                      style={{
                        background: '#141414',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = '#141414';
                      }}
                    >
                      {chipText}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isAI = m.role === 'assistant';
                return (
                  <div key={idx} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className="max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed"
                      style={{
                        background: isAI ? '#141414' : '#fff',
                        color: isAI ? '#fff' : '#000',
                        border: isAI ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
                      }}
                    >
                      <p>{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {chatMutation.isPending && (
              <div className="flex justify-start animate-pulse">
                <div
                  className="rounded-2xl p-3 flex items-center gap-2"
                  style={{
                    background: '#141414',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white/60" />
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div
            className="p-4 shrink-0 flex items-center gap-2"
            style={{
              borderTop: '0.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about your finances..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0"
              style={{
                background: '#141414',
                borderColor: 'rgba(255,255,255,0.12)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || chatMutation.isPending}
              className="p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-30"
              style={{
                background: '#fff',
                color: '#000',
              }}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button — solid white background, black icon inside */}
      <button
        onClick={toggleOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        style={{ background: '#fff', color: '#000' }}
        title="AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
