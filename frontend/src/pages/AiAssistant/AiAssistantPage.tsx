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
import { DASHBOARD_AI_CONV_KEY } from '../../components/dashboard/DashboardAIAssistantCard';
import type { AiMessage } from '../../services/ai.service';
import { INPUT_BASE, INPUT_STYLE, INPUT_FOCUS_STYLE, INPUT_BLUR_STYLE } from '../../components/accounts/fieldStyles';
import { ConfirmationDialog } from '../../components/layout/ConfirmationDialog';

const SUGGESTED_PROMPTS = [
  { text: 'Summarize my finances', icon: Sparkles, color: 'text-white bg-white/5 border-white/10' },
  { text: 'Add ₹500 on groceries today', icon: Wallet, color: 'text-white bg-white/5 border-white/10' },
  { text: 'Create a "Car Fund" goal', icon: PiggyBank, color: 'text-white bg-white/5 border-white/10' },
  { text: 'Show my current goals', icon: Compass, color: 'text-white bg-white/5 border-white/10' },
  { text: 'How much spent this month?', icon: Calendar, color: 'text-white bg-white/5 border-white/10' },
  { text: 'Where can I save money?', icon: HelpCircle, color: 'text-white bg-white/5 border-white/10' },
];

export const AiAssistantPage: React.FC = () => {
  const { data: conversations = [], isLoading: isLoadingList } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return sessionStorage.getItem(DASHBOARD_AI_CONV_KEY);
  });

  const { data: activeConversation, isLoading: isLoadingConversation } = useConversation(activeConversationId);
  const [localMessages, setLocalMessages] = useState<AiMessage[]>([]);

  // Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const chatMutation = useChat((data) => {
    setActiveConversationId(data.conversationId);
  });

  const deleteMutation = useDeleteConversation(() => {
    if (activeConversationId) {
      setActiveConversationId(null);
      setLocalMessages([]);
    }
    setDeleteConfirmId(null);
  });

  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync messages
  useEffect(() => {
    if (activeConversation?.messages) {
      setLocalMessages(activeConversation.messages);
    } else {
      setLocalMessages([]);
    }
  }, [activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, chatMutation.isPending]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || chatMutation.isPending) return;

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
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    let elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listType: 'bullet' | 'number' | null = null;
    let tableHeader: string[] = [];
    let tableRows: string[][] = [];
    let isTable = false;

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        if (listType === 'bullet') {
          elements.push(
            <ul key={key} className="list-disc pl-5 my-2 space-y-1 text-xs text-white/70">
              {listItems.map((item, idx) => (
                <li key={idx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        } else if (listType === 'number') {
          elements.push(
            <ol key={key} className="list-decimal pl-5 my-2 space-y-1 text-xs text-white/70">
              {listItems.map((item, idx) => (
                <li key={idx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ol>
          );
        }
        listItems = [];
        listType = null;
      }
    };

    const flushTable = (key: string) => {
      if (isTable && tableHeader.length > 0) {
        elements.push(
          <div key={key} className="overflow-x-auto my-3 scrollbar-hidden" style={{ border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {tableHeader.map((h, i) => (
                    <th key={i} className="py-2.5 px-4 font-bold text-white/60 uppercase tracking-wider">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-2.5 px-4 text-white/80">{parseInlineMarkdown(cell.trim())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeader = [];
        tableRows = [];
        isTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const currentKey = `md-${index}`;

      // Table parsing logic
      if (trimmed.startsWith('|')) {
        flushList(currentKey);
        const parts = trimmed.split('|').map(p => p.trim()).filter((p, i, arr) => i > 0 && i < arr.length - 1);
        if (trimmed.includes('---')) {
          // Table separator line, ignore
        } else if (!isTable && tableHeader.length === 0) {
          tableHeader = parts;
          isTable = true;
        } else {
          tableRows.push(parts);
        }
        return;
      } else {
        flushTable(currentKey);
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        flushList(currentKey);
        elements.push(
          <h4 key={currentKey} className="text-xs font-bold text-white mt-4 mb-2 uppercase tracking-wider">
            {parseInlineMarkdown(trimmed.slice(4))}
          </h4>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList(currentKey);
        elements.push(
          <h3 key={currentKey} className="text-sm font-bold text-white mt-4 mb-2">
            {parseInlineMarkdown(trimmed.slice(3))}
          </h3>
        );
      } else if (trimmed.startsWith('# ')) {
        flushList(currentKey);
        elements.push(
          <h2 key={currentKey} className="text-base font-bold text-white mt-5 mb-3">
            {parseInlineMarkdown(trimmed.slice(2))}
          </h2>
        );
      }
      // Bullet lists
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (listType !== 'bullet') {
          flushList(currentKey);
          listType = 'bullet';
        }
        listItems.push(trimmed.slice(2));
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmed)) {
        if (listType !== 'number') {
          flushList(currentKey);
          listType = 'number';
        }
        const textOnly = trimmed.replace(/^\d+\.\s/, '');
        listItems.push(textOnly);
      }
      // Normal paragraphs
      else {
        flushList(currentKey);
        if (trimmed.length > 0) {
          elements.push(
            <p key={currentKey} className="text-xs text-white/70 my-2 leading-relaxed">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        } else {
          elements.push(<div key={currentKey} className="h-2" />);
        }
      }
    });

    flushList('final-list');
    flushTable('final-table');

    return elements;
  };

  const parseInlineMarkdown = (text: string) => {
    // Basic inline code parse: `code`
    let parts: React.ReactNode[] = [text];

    // Process Bold: **text**
    let boldSplit = text.split(/(\*\*.*?\*\*)/g);
    let boldParsed = boldSplit.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`b-${i}`} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return boldParsed;
  };

  return (
    <div
      className="flex h-[calc(100vh-140px)] w-full overflow-hidden animate-fade-in text-left"
      style={{
        background: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 24,
      }}
    >
      {/* Sidebar - Conversations list */}
      <div
        className="w-80 flex flex-col justify-between shrink-0"
        style={{ borderRight: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="p-4 space-y-3 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">AI Assistant</h3>
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white hover:bg-white/90 active:scale-[0.98] px-4 py-2.5 text-sm font-semibold text-black transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-2.5 space-y-1.5 scrollbar-hidden">
          {isLoadingList ? (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-11 rounded-xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              />
            ))
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
              No conversations.
            </div>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === activeConversationId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer group transition-all"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: '0.5px solid',
                    borderColor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare
                      className="h-4 w-4 shrink-0 transition-colors"
                      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.3)' }}
                    />
                    <span className="text-xs font-semibold truncate text-white/80">{c.title || 'Chat Session'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-455 p-1 rounded-lg hover:bg-white/5 transition-all shrink-0 cursor-pointer"
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
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-transparent">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hidden">
          {localMessages.length === 0 && !chatMutation.isPending ? (
            // Empty State Suggested Prompts
            <div className="max-w-2xl mx-auto py-12 space-y-8 text-center">
              <div className="space-y-3">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Bot className="h-7 w-7 text-white/60" />
                </div>
                <h2 className="text-xl font-bold text-white">Ask FinTrack AI</h2>
                <p className="text-xs max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
                      className="flex items-center gap-3 p-4 rounded-xl border text-left active:scale-[0.99] transition-all cursor-pointer"
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
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderColor: 'rgba(255,255,255,0.08)',
                        }}
                      >
                        <PromptIcon className="h-4 w-4 text-white/80" />
                      </div>
                      <span className="text-xs font-semibold text-white/80">{p.text}</span>
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
                  <div key={m.id} className={`flex gap-3.5 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '0.5px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <Bot className="h-4.5 w-4.5 text-white/60" />
                      </div>
                    )}
                    <div
                      className="max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed"
                      style={{
                        background: isAI ? '#141414' : '#fff',
                        color: isAI ? '#fff' : '#000',
                        border: isAI ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
                      }}
                    >
                      {isAI ? parseMarkdown(m.content) : <p className="leading-relaxed font-semibold">{m.content}</p>}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-3.5 justify-start animate-pulse">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '0.5px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Bot className="h-4.5 w-4.5 text-white/60" />
                  </div>
                  <div
                    className="rounded-2xl p-4 flex items-center gap-2"
                    style={{
                      background: '#141414',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white/60" />
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div
          className="p-4"
          style={{
            borderTop: '0.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.01)',
          }}
        >
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputMsg);
              }}
              placeholder="Ask me to summarize your spending, create budget, log expenses..."
              className={INPUT_BASE}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.border = INPUT_FOCUS_STYLE)}
              onBlur={e => (e.currentTarget.style.border = INPUT_BLUR_STYLE)}
            />
            <button
              onClick={() => handleSend(inputMsg)}
              disabled={!inputMsg.trim() || chatMutation.isPending}
              className="absolute right-2 top-2 p-2 rounded-xl transition-all cursor-pointer disabled:opacity-30"
              style={{
                background: '#fff',
                color: '#000',
              }}
            >
              <Send className="h-3.5 w-3.5 font-bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Delete Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default AiAssistantPage;
