import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useChat } from '../../hooks/useAi';

export const FloatingChatWidget: React.FC = () => {
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

  const handleSend = () => {
    if (!inputVal.trim() || chatMutation.isPending) return;

    const userText = inputVal;
    setInputVal('');

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: 'user',
        content: userText,
      },
    ]);

    chatMutation.mutate({
      message: userText,
      conversationId,
    });
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end text-left font-sans">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="mb-4 w-[360px] h-[480px] rounded-3xl bg-white border border-gray-150 shadow-2xl dark:bg-[#12131a] dark:border-gray-800 flex flex-col overflow-hidden animate-zoom-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 animate-pulse" />
              <div>
                <h4 className="text-sm font-black leading-none">FinTrack AI</h4>
                <span className="text-[10px] font-bold text-purple-200">Online Assistant</span>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="rounded-lg p-1 text-purple-200 hover:text-white hover:bg-purple-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages List */}
          <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">Quick Assistant</h5>
                  <p className="text-[11px] text-gray-400 max-w-[200px]">
                    Ask me to log an expense or check your balances anytime!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isAI = m.role === 'assistant';
                return (
                  <div key={idx} className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed border shadow-xs ${
                        isAI
                          ? 'bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800/80 text-gray-800 dark:text-gray-250'
                          : 'bg-purple-600 border-purple-600 text-white'
                      }`}
                    >
                      <p>{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}

            {chatMutation.isPending && (
              <div className="flex gap-2.5 justify-start">
                <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-2xl p-3 flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600 dark:text-purple-400" />
                  <span className="text-[10px] font-bold text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-gray-150 dark:border-gray-800 bg-white dark:bg-[#12131a] flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask helper..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold"
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim() || chatMutation.isPending}
              className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all"
        title="AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
