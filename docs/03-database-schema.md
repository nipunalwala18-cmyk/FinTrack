# 03 - Database Schema

This database schema is designed for PostgreSQL and mapped via Prisma ORM.

## 1. ER Diagram (Textual Representation)
```
  [User] 1 ──── 0..* [Account] 1 ──── 0..* [Transaction] 0..* ──── 1 [Category]
    │                  │                      │
    │ 1                │ 1 (Source/Dest)      │ 1
    ├── 0..* [Budget]  ├── 0..* [Transfer]    └── 0..* [Attachment]
    │                  │
    ├── 0..* [Goal] ───┘ (Target Account)
    │
    ├── 0..* [RecurringTransaction]
    ├── 0..* [Notification]
    ├── 0..* [AuditLog]
    └── 0..* [AiConversation] 1 ──── 0..* [AiMessage]
```

---

## 2. Table Definitions

### 2.1. User Table (`users`)
Holds credential details, registration status, and profile preferences.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Login credential |
| `password_hash` | VARCHAR(255) | NULL (nullable for OAuth users) | Hashed password (Argon2id) |
| `full_name` | VARCHAR(255) | NOT NULL | User's display name |
| `currency` | VARCHAR(10) | NOT NULL, default: 'USD' | Default display currency |
| `timezone` | VARCHAR(100) | NOT NULL, default: 'UTC' | User's local timezone |
| `date_format` | VARCHAR(50) | NOT NULL, default: 'YYYY-MM-DD' | Date formatting rule |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |
| `updated_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |
| `deleted_at` | TIMESTAMP | NULL | Soft delete timestamp |

### 2.2. Account Table (`accounts`)
Tracks financial accounts owned by the users.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL, INDEX | Owner relation |
| `name` | VARCHAR(100) | NOT NULL | Account name (e.g. Checking) |
| `type` | VARCHAR(30) | NOT NULL | Cash, Bank, CreditCard |
| `balance` | DECIMAL(15, 2) | NOT NULL, default: 0.00 | Current cached balance |
| `currency` | VARCHAR(10) | NOT NULL, default: 'USD' | Account denomination |
| `is_archived` | BOOLEAN | NOT NULL, default: false | Archive toggle |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |
| `updated_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |

### 2.3. Category Table (`categories`)
Defines the classification system for transactions.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NULL (System default) | User-specific or system-wide |
| `name` | VARCHAR(100) | NOT NULL | Category name |
| `type` | VARCHAR(20) | NOT NULL | INCOME or EXPENSE |
| `color` | VARCHAR(7) | NOT NULL, default: '#CCCCCC' | Hex code representation |
| `icon` | VARCHAR(50) | NOT NULL, default: 'Folder' | UI rendering metadata |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |

### 2.4. Transaction Table (`transactions`)
Logs individual ledger entries.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `account_id` | UUID | FOREIGN KEY -> accounts(id), NOT NULL, INDEX | Source financial account |
| `category_id` | UUID | FOREIGN KEY -> categories(id), NOT NULL, INDEX | Primary categorization |
| `amount` | DECIMAL(15, 2) | NOT NULL | Value of transaction |
| `type` | VARCHAR(20) | NOT NULL | INCOME, EXPENSE, TRANSFER |
| `date` | TIMESTAMP | NOT NULL, INDEX | Date of occurrence |
| `description` | TEXT | NULL | User comments |
| `transfer_to_account_id` | UUID | FOREIGN KEY -> accounts(id), NULL | Matches target account for transfers |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |
| `updated_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |

### 2.5. Budget Table (`budgets`)
Maps budget limits per category for tracking.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL, INDEX | Owner relation |
| `category_id` | UUID | FOREIGN KEY -> categories(id), NOT NULL | Category targeted |
| `limit_amount` | DECIMAL(15, 2) | NOT NULL | Spending threshold |
| `month_year` | DATE | NOT NULL | Targeted month (e.g. 2026-07-01) |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |

### 2.6. Savings Goal Table (`goals`)
Savings metrics tracking.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL, INDEX | Owner relation |
| `name` | VARCHAR(150) | NOT NULL | Goal designation |
| `target_amount` | DECIMAL(15, 2) | NOT NULL | Dollar requirement |
| `current_amount` | DECIMAL(15, 2) | NOT NULL, default: 0.00 | Logged progress |
| `target_date` | TIMESTAMP | NOT NULL | Desired deadline |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Audit field |

### 2.7. Recurring Transaction Table (`recurring_transactions`)
Templates for automated scheduling.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL | Owner |
| `account_id` | UUID | FOREIGN KEY -> accounts(id), NOT NULL | Source account |
| `category_id` | UUID | FOREIGN KEY -> categories(id), NOT NULL | Category |
| `amount` | DECIMAL(15, 2) | NOT NULL | Value |
| `type` | VARCHAR(20) | NOT NULL | INCOME, EXPENSE, TRANSFER |
| `frequency` | VARCHAR(30) | NOT NULL | DAILY, WEEKLY, MONTHLY, YEARLY |
| `start_date` | TIMESTAMP | NOT NULL | When schedule activates |
| `end_date` | TIMESTAMP | NULL | Expiration date |
| `last_run` | TIMESTAMP | NULL | Last time executed |

### 2.8. Notification Table (`notifications`)
User notification records.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL, INDEX | Recipient relation |
| `title` | VARCHAR(255) | NOT NULL | Notification header |
| `message` | TEXT | NOT NULL | Context description |
| `type` | VARCHAR(50) | NOT NULL | BUDGET_ALERT, GOAL_ALERT, SYSTEM |
| `is_read` | BOOLEAN | NOT NULL, default: false | Status check |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Timestamp |

### 2.9. Audit Log Table (`audit_logs`)
Stores user session activities.

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, default: gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY -> users(id), NULL (e.g. system task) | Performed by |
| `action` | VARCHAR(100) | NOT NULL | Auth event, updates, delete operations |
| `details` | JSONB | NULL | Extra context logs |
| `ip_address` | VARCHAR(45) | NULL | IPv4/IPv6 client IP |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Action timestamp |

### 2.10. AI Conversation & Message Table (`ai_conversations`, `ai_messages`)
Stores interactive chat history for the AI Financial Assistant.

#### AI Conversation Table
| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Conversation session |
| `user_id` | UUID | FOREIGN KEY -> users(id), NOT NULL, INDEX | Owner relation |
| `title` | VARCHAR(255) | NULL | Auto-generated summary title |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Session initialization |

#### AI Message Table
| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Message entry |
| `conversation_id` | UUID | FOREIGN KEY -> conversations(id), ON DELETE CASCADE | Parent session |
| `role` | VARCHAR(20) | NOT NULL | 'user' or 'assistant' |
| `content` | TEXT | NOT NULL | Message body text |
| `created_at` | TIMESTAMP | NOT NULL, default: CURRENT_TIMESTAMP | Send timestamp |

---

## 3. Database Soft Delete & Indexing Strategy
- **Soft Deletes**: Active only on the `users` table. The backend filters queries implicitly with `deleted_at: null`.
- **Foreign Keys**: Cascade delete is active *only* for AI conversations and message sub-tables to ensure no orphaned messages.
- **Indexes**: Added to `user_id` across accounts, transactions, budgets, goals, and conversations tables to accelerate query operations. Composite index established on `(account_id, date)` on transaction records to streamline query filters.
