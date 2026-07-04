# 02 - UI/UX Design Specification

## 1. Application Layout
The authenticated dashboard utilizes a responsive two-column grid layout built with Material UI (MUI).

*   **Sidebar / Navigation Drawer**:
    *   *Desktop*: Permanent left sidebar (width: 260px).
    *   *Mobile*: Collapsible hamburger menu.
    *   *Links*: Dashboard, Accounts, Transactions, Categories, Budgets, Goals, Reports, Settings.
*   **Header**:
    *   Displays current page title.
    *   Quick actions: "+ Add Transaction" shortcut button.
    *   Notification Center (bell icon with unread count badge).
    *   User profile dropdown (Profile, Settings, Logout).
*   **Main Workspace**:
    *   Scrollable body area with responsive gutters (`px={3}`, `py={2}`).
*   **Persistent AI Widget**:
    *   Floating Action Button (FAB) at the bottom-right corner. Clicking opens a slide-out chat panel.

---

## 2. Page Specifications

### 2.1. Public Pages

*   **Landing Page**:
    *   *Purpose*: High-impact conversion page showcasing features, dashboard mockup, and call-to-actions.
    *   *Components*: Hero header, Feature Grid, Call to Action (CTA) buttons ("Get Started", "Login").
*   **Login Page**:
    *   *Components*: Credentials form (Email, Password fields), "Remember Me" checkbox, "Forgot Password?" link, Google Sign-In button, validation error callouts.
*   **Register Page**:
    *   *Components*: Sign-up form (Full Name, Email, Password, Password Confirmation), terms acceptance checkbox, Google Sign-In helper.
*   **Forgot/Reset Password Page**:
    *   *Components*: Email lookup form. Once verified, routes to a page for OTP/Reset Code entry and new password selection.

### 2.2. Authenticated Pages

#### Dashboard
*   **Purpose**: Real-time summary of financial status.
*   **Components**:
    *   *Key Metric Cards*: Total Balance, Monthly Income, Monthly Expenses, Active Budgets Overspent indicator.
    *   *Interactive Chart*: Cash Flow line/bar chart (Income vs. Expense last 6 months).
    *   *Recent Transactions*: List of last 5 transactions with Category badges and quick edit actions.
    *   *Budget Alert banner*: Dynamic alert panel listing overspent budgets.

#### Accounts Page
*   **Purpose**: View and manage financial accounts.
*   **Components**:
    *   *Grid of Account Cards*: Cash, Savings, checking, credit cards. Each card displays Balance, Account Number suffix, and status (Active/Archived).
    *   *Add Account Dialog*: Form with fields: Account Name, Account Type (Dropdown), Currency, Initial Balance.
    *   *Transfer Funds Modal*: Form with fields: Source Account, Destination Account, Amount, Date, Notes.

#### Transactions Page
*   **Purpose**: Search, filter, and modify transaction records.
*   **Components**:
    *   *Filter Panel*: Date Picker, Type Selector (Income, Expense, Transfer), Account select dropdown, Category multi-select, Minimum/Maximum amount inputs, Search query input.
    *   *Data Grid*: Scrollable table showing Date, Description, Account, Category (with colored chip), Amount (Green for positive, Red for negative), Actions (Edit, Delete).
    *   *Transaction Form Modal*: Fields: Date, Amount, Description, Category, Account, Recurring Toggle (Frequency, End Date), Attachment Upload (drag & drop field).

#### Categories Page
*   **Purpose**: Organize transaction categories.
*   **Components**:
    *   *Category Cards Group*: Pre-seeded system categories (disabled edit/delete) and Custom User Categories.
    *   *Category Creator Form*: Text field for Name, Color picker, Icon grid selector.

#### Budgets Page
*   **Purpose**: Control spending across categories.
*   **Components**:
    *   *Budget Cards*: Displaying Category name, Limit, Spent to Date, Progress bar (color-coded: Blue < 80%, Orange 80-99%, Red >= 100%).
    *   *Set Budget Modal*: Form selecting Category, Month/Year, Limit Amount.

#### Goals Page
*   **Purpose**: Track financial savings targets.
*   **Components**:
    *   *Goal Cards*: Target Amount, Current Balance, Percentage Progress, Target Date.
    *   *Contribution Dialog*: Form to log a contribution to the savings target.

#### Reports Page
*   **Purpose**: Detailed analytics visualization.
*   **Components**:
    *   *Tabs*: Spending by Category (Pie/Donut), Income vs. Expense Trends (Bar), Net Worth Timeline (Area Chart), Cash Flow (Waterfall).
    *   *Filters*: Date Range (This Month, Last Month, Year to Date, Custom).

#### Settings Page
*   **Purpose**: Manage user configurations.
*   **Components**:
    *   *Profile Settings*: Form for name, email change.
    *   *Regional Settings*: Preferences for default currency, timezone, date display format.

#### AI Assistant Page & Persistent Chat Panel
*   **Purpose**: Interactive natural language access to financial insights.
*   **Components**:
    *   *Chat Thread Area*: Message logs with avatar identifiers (User vs. AI Bot). Markdown support for bolding, bullet points, and tables.
    *   *Suggestions Panel*: Clickable tags to quickly ask common questions (e.g., "Summarize my spending this month", "Where can I save money?").
    *   *Input Toolbar*: Auto-resizing textarea field, Send button.

---

## 3. Screen Flows & Detailed Transactions View

### 3.1. Detailed Screen Flow: Transactions Page UI
```
[Transactions Table View]
 ├── Click "+ New Transaction" Button ──> Opens [Transaction Dialog Modal]
 ├── Click "Filter" ──────────────────────> Expands [Accordion Filter Panel]
 └── Click "Row Action: Edit" ────────────> Opens [Transaction Dialog Modal] with Prefilled Data
```

### 3.2. Form Fields & Validation Specs (Zod Schemas)
- **Transaction Amount**: Positive decimal values, scale of 2. Required.
- **Transaction Date**: Datepicker format, cannot be in future by default unless recurring template.
- **Account / Category Selection**: Dropdown values, strictly non-empty.
