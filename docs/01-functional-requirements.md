# 01 - Functional Requirements

## 1. Introduction & Scope
The **Personal Finance Manager** MVP is a secure, single-user-focused financial tracking application. Its primary objective is to allow users to manage their personal finances through secure authentication, accounts management, transaction recording, category allocation, budget tracking, savings goal management, report generation, CSV/Excel import/export, and interactions with an AI Financial Assistant. All features marked as future (such as bank synchronization, investment portfolio tracking, bill reminders, receipt OCR, mobile applications, and voice assistant features) are excluded from this MVP.

---

## 2. User Roles
- **Regular User**: Configures profile, manages personal financial accounts, transactions, categories, budgets, and savings goals. Accesses personal financial reports and interacts with the AI Financial Assistant.
- **Administrator**: Minimally implemented in the MVP to monitor overall system health, view audit logs, manage global transaction categories/templates, and configure basic AI model parameters.

---

## 3. Functional Modules

### 3.1. Authentication
*   **User Registration**:
    *   *Inputs*: Email address, password, confirm password, full name.
    *   *Validation*: Password must be strong (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char). Email must be valid format and unique.
    *   *Outputs*: Newly created user account, JWT access and refresh token.
*   **Login / Logout**:
    *   *Inputs*: Email, password (for credentials login).
    *   *Validation*: Authenticated credentials match stored argon2/bcrypt hash.
    *   *Outputs*: JWT Access token (short-lived) and Refresh token (stored securely in HttpOnly cookie).
*   **Google OAuth Login**:
    *   *Inputs*: Google auth code/credential token.
    *   *Outputs*: User account created or resolved, JWT session started.
*   **Password Reset**:
    *   *Inputs*: Email address (to request reset code), new password (with reset token).
    *   *Outputs*: Password updated, existing active sessions invalidated.

### 3.2. User Profile
*   **Profile Management**:
    *   *Inputs*: Name, currency preference (e.g., USD, EUR, INR), timezone, date format (e.g., YYYY-MM-DD, DD/MM/YYYY).
    *   *Outputs*: Updated user profile metadata.
*   **Change Password**:
    *   *Inputs*: Current password, new password, confirm new password.
    *   *Validation*: Verification of current password before allowing change.

### 3.3. Accounts
*   **Manage Accounts (CRUD)**:
    *   *Inputs*: Account Name, Account Type (Cash, Bank Account, Credit Card), Initial Balance, Currency.
    *   *Business Rules*:
        *   Initial balance must be a valid decimal (positive or negative).
        *   Accounts with associated transactions cannot be deleted; they must be archived instead.
    *   *Archiving Accounts*: Archived accounts remain in historical reports but cannot be selected for new transactions.

### 3.4. Transactions
*   **Add / Edit / Delete Transaction**:
    *   *Inputs*: Amount, Type (Income, Expense, Transfer), Date, Account, Category, Description/Notes, Attachment (optional).
    *   *Business Rules*:
        *   Every transaction must belong to exactly one account and one primary category.
        *   Transfers require a source account and a destination account. Transfers do not count as income or expense in reports.
        *   Attachments must be validated for size (< 5MB) and type (PNG, JPEG, PDF).
*   **Search & Filter**:
    *   *Inputs*: Date range, category IDs, account IDs, min/max amount, text search in description.
*   **Recurring Transactions**:
    *   *Inputs*: Schedule pattern (Daily, Weekly, Monthly, Yearly), start date, end date (optional), base transaction info.

### 3.5. Categories
*   **Manage Categories**:
    *   *Inputs*: Category Name, Type (Income/Expense), Icon, Color.
    *   *Business Rules*:
        *   Category names must be unique per user.
        *   System provides a set of read-only global categories (e.g., Food, Rent, Salary).

### 3.6. Budgets
*   **Set Budgets**:
    *   *Inputs*: Category, Monthly Limit, Year/Month (e.g., 2026-07).
    *   *Validation*: Limit must be a positive number.
*   **Track Progress**:
    *   *Calculation*: Sum of expenses in the selected category/month vs. the set limit.
    *   *Outputs*: Real-time budget progress bar and alert triggers.

### 3.7. Goals
*   **Savings Goals**:
    *   *Inputs*: Goal Name, Target Amount, Target Date, Linked Account (optional).
*   **Record Contributions**:
    *   *Inputs*: Amount, Transaction reference (optional).
    *   *Outputs*: Updated goal progress percentage.

### 3.8. Reports & Analytics
*   **Income vs. Expenses**: Comparison chart over time.
*   **Spending by Category**: Donut/pie chart of expenses.
*   **Monthly Trends**: Line chart of net cash flow month-over-month.
*   **Net Worth**: Cumulative balance of all non-archived accounts over time.
*   **Budget Performance**: Budgeted vs. actual spending report.

### 3.9. Import & Export
*   **CSV Import**: Parses uploaded CSV file, mapping columns to Date, Description, Category, Amount, Account. Shows validation preview before applying.
*   **CSV / Excel Export**: Downloads transaction lists for a selected period.

### 3.10. Notifications
*   **Triggers**:
    *   *Budget Exceeded*: Triggered when an expense transaction pushes a category's total past its budget.
    *   *Goal Achieved*: Triggered when contributions reach 100% of target.
    *   *Upcoming Recurring*: Alert 3 days before a recurring transaction fires.

### 3.11. AI Financial Assistant
*   **Interactive Chatbot**:
    *   *Capability*: Answers natural-language questions using the authenticated user's data only.
    *   *Security & Isolation*: The AI service must read financial summaries and transactions through dedicated service APIs. It never communicates directly with the database.
    *   *Advisory Only*: AI cannot create, edit, or delete transactions; it can only suggest actions that the user must manually confirm.

---

## 4. Non-Functional Requirements

### 4.1. Performance
- **Dashboard Load**: Dashboard must load within 2 seconds under normal conditions.
- **AI Assistant Response**: Response generation must initiate within 5 seconds of request.
- **Transaction Scaling**: System must maintain performance with up to 100,000 transactions per user.

### 4.2. Security
- **Transport**: HTTPS mandatory.
- **Secrets**: Passwords hashed using bcrypt/argon2. JWT tokens signed with RS256/HS256.
- **Access Controls**: Strict object-level permissions. A user can only access/modify data where `userId == currentUserId`.
- **Encryption**: Database fields for OAuth tokens and third-party integrations (if any) are encrypted at rest.

### 4.3. Reliability
- **Backups**: Automated daily snapshots of PostgreSQL database.
- **Data Integrity**: Database-level foreign key constraints and transactional boundaries using Prisma Transactions.

### 4.4. Maintainability
- **Modularity**: NestJS modules isolate domain logic (e.g., `AuthModule`, `TransactionModule`, `AiModule`).
- **AI Abstraction**: The AI service uses an interface structure allowing switching from OpenAI to local LLM providers without modifications to other modules.
