# 12 - AI Assistant Design

This specification details the architecture, safety, and integration mechanics of the AI Financial Assistant in the Personal Finance Manager MVP.

## 1. System Prompt & Behavior Guidelines
The AI Assistant prompt is stored independently of the source code in `backend/src/modules/ai/prompts/system-prompt.txt`.

### Prompt Constraints
1.  **Strict Advisory Role**: The assistant cannot execute or update financial data directly.
2.  **Strict Data Boundary**: The assistant must only access context items injected by the application server. It must refuse queries searching for other users' info.
3.  **Advisory Disclaimer**: Every response referencing planning suggestions must conclude with a standard disclaimer: *"AI-generated insights are advisory only. Please review financial decisions carefully."*

---

## 2. Context Extraction & Building Flow
To maintain isolation, the LLM has no direct connection to the SQL database. It relies on the backend server to build its context payload.

```
                  ┌──────────────────┐
                  │   User Request   │
                  └────────┬─────────┘
                           ▼
               ┌───────────────────────┐
               │   Fetch Context Data  │
               └───────────┬───────────┘
                           │ (Account balances, Monthly budget limits,
                           │  Expense total, Recent 10 transactions)
                           ▼
               ┌───────────────────────┐
               │ Build LLM Chat Prompt │
               └───────────┬───────────┘
                           │ (System Prompt + Context + Chat History)
                           ▼
               ┌───────────────────────┐
               │    Send request to    │
               │   Configured LLM API  │
               └───────────────────────┘
```

### Context Payload Schema
```json
{
  "accounts": [
    { "name": "Checking", "balance": 2500.50, "currency": "USD" }
  ],
  "budgetStatus": [
    { "category": "Food", "limit": 500.00, "spent": 125.50 }
  ],
  "recentTransactions": [
    { "date": "2026-07-04", "amount": 45.50, "type": "EXPENSE", "category": "Food", "description": "Weekly Groceries" }
  ]
}
```

---

## 3. Conversation Memory Strategy
*   **Database Storage**: Conversations (`ai_conversations`) and Messages (`ai_messages`) are persisted in PostgreSQL.
*   **Memory Injection**: On subsequent questions, the backend loads the last 5 messages of the conversation thread and formats them as standard `user` and `assistant` role inputs for the chat payload.

---

## 4. AI Provider Integration & Abstraction
The AI service is decoupled using NestJS dependency provider registration.

```typescript
export interface AiProvider {
  generateResponse(
    systemPrompt: string,
    history: ChatMessage[],
    userMessage: string,
    context: string
  ): Promise<string>;
}
```

### Configured Providers
*   **OpenAiProvider (Default MVP)**: Standard REST SDK client connecting to GPT-4o.
*   **SelfHostedProvider (Alternative)**: Connects to local self-hosted endpoints (e.g., Ollama / LocalAI instance).

---

## 5. Audit Logging & Compliance
*   **Audit Logging**: Every query and interaction is logged in the `AuditLog` table.
*   **Content Redaction**: PII scrubbers scan messages prior to logging. Credit card and bank account numbers are replaced with `<REDACTED>`.
