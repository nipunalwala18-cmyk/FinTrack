# 04 - API Specification

The backend REST API is hosted by NestJS. It requires JWT Bearer authentication on all non-public endpoints.

## 1. Global Specifications
*   **Base URL**: `/api/v1`
*   **Request/Response Format**: `application/json`
*   **Standard Success Structure**: All direct item returns match their respective entity definitions. List responses return pagination objects.
*   **Standard Error Structure**:
    ```json
    {
      "statusCode": 400,
      "message": ["amount must be a positive number"],
      "error": "Bad Request"
    }
    ```

---

## 2. Authentication API (`/auth`)

### 2.1. Register User
*   **Endpoint**: `POST /auth/register`
*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "fullName": "Jane Doe"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "id": "e8b2bf31-6b22-4217-baeb-38c227cf46bd",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
    ```

### 2.2. Login
*   **Endpoint**: `POST /auth/login`
*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
      "expiresIn": 900
    }
    ```
    *(Note: Refresh token is returned in a secure, HTTP-only cookie named `refresh_token`)*

### 2.3. Google OAuth
*   **Endpoint**: `POST /auth/google`
*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "token": "google-id-token"
    }
    ```
*   **Response (200 OK)**: Matches login response credentials block.

---

## 3. Accounts API (`/accounts`)

### 3.1. List Accounts
*   **Endpoint**: `GET /accounts`
*   **Auth Required**: Yes
*   **Query Parameters**: `includeArchived=true/false`
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "ac1b88e1-5e2a-4bc4-b778-9e53dbd98212",
        "name": "Primary Checking",
        "type": "Bank",
        "balance": 2500.50,
        "currency": "USD",
        "isArchived": false
      }
    ]
    ```

### 3.2. Create Account
*   **Endpoint**: `POST /accounts`
*   **Auth Required**: Yes
*   **Request Body**:
    ```json
    {
      "name": "Cash Wallet",
      "type": "Cash",
      "currency": "USD",
      "initialBalance": 100.00
    }
    ```
*   **Response (201 Created)**: Returns created account object.

### 3.3. Archive Account
*   **Endpoint**: `PATCH /accounts/:id/archive`
*   **Auth Required**: Yes
*   **Response (200 OK)**: Account status updated with `isArchived: true`.

---

## 4. Transactions API (`/transactions`)

### 4.1. List Transactions
*   **Endpoint**: `GET /transactions`
*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `page` (default: 1), `limit` (default: 20)
    *   `startDate`, `endDate` (ISO 8601)
    *   `type` (INCOME, EXPENSE, TRANSFER)
    *   `accountId`, `categoryId`
*   **Response (200 OK)**:
    ```json
    {
      "data": [
        {
          "id": "t2c88f11-7a2e-4cb8-b0a1-43224412ef62",
          "amount": 45.50,
          "type": "EXPENSE",
          "date": "2026-07-04T12:00:00Z",
          "description": "Weekly Groceries",
          "accountId": "ac1b88e1-5e2a-4bc4-b778-9e53dbd98212",
          "categoryId": "c5f59011-8e99-4cda-92bd-22123ef667dd"
        }
      ],
      "meta": {
        "totalItems": 150,
        "itemCount": 1,
        "itemsPerPage": 20,
        "totalPages": 8,
        "currentPage": 1
      }
    }
    ```

### 4.2. Create Transaction
*   **Endpoint**: `POST /transactions`
*   **Auth Required**: Yes
*   **Request Body**:
    ```json
    {
      "amount": 45.50,
      "type": "EXPENSE",
      "date": "2026-07-04T12:00:00Z",
      "description": "Weekly Groceries",
      "accountId": "ac1b88e1-5e2a-4bc4-b778-9e53dbd98212",
      "categoryId": "c5f59011-8e99-4cda-92bd-22123ef667dd"
    }
    ```
*   **Response (201 Created)**: Returns created transaction object.

---

## 5. Budgets API (`/budgets`)

### 5.1. List Budgets
*   **Endpoint**: `GET /budgets`
*   **Query Parameters**: `monthYear=2026-07-01`
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "b32812ff-33cc-49d8-9a2c-d4e5f7622341",
        "categoryId": "c5f59011-8e99-4cda-92bd-22123ef667dd",
        "limitAmount": 500.00,
        "spentAmount": 125.50,
        "monthYear": "2026-07-01T00:00:00.000Z"
      }
    ]
    ```

### 5.2. Upsert Budget
*   **Endpoint**: `POST /budgets`
*   **Request Body**:
    ```json
    {
      "categoryId": "c5f59011-8e99-4cda-92bd-22123ef667dd",
      "limitAmount": 500.00,
      "monthYear": "2026-07-01"
    }
    ```
*   **Response (200 OK)**: Returns updated/created budget record.

---

## 6. Reports API (`/reports`)

### 6.1. Get Spending by Category
*   **Endpoint**: `GET /reports/spending-by-category`
*   **Query Parameters**: `startDate=2026-07-01&endDate=2026-07-31`
*   **Response (200 OK)**:
    ```json
    [
      {
        "categoryId": "c5f59011-8e99-4cda-92bd-22123ef667dd",
        "categoryName": "Groceries",
        "total": 125.50,
        "percentage": 100.00
      }
    ]
    ```

---

## 7. AI Assistant API (`/ai`)

### 7.1. Create Conversation
*   **Endpoint**: `POST /ai/conversations`
*   **Response (201 Created)**:
    ```json
    {
      "id": "ai882312-d922-4fe1-ba1b-9e8cbbdc4533",
      "title": "New Conversation",
      "createdAt": "2026-07-04T18:30:00Z"
    }
    ```

### 7.2. Send Message
*   **Endpoint**: `POST /ai/conversations/:id/messages`
*   **Request Body**:
    ```json
    {
      "message": "Can you summarize my spending on Groceries this month?"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "userMessage": {
        "id": "m1122334-a212-4ee1-b0aa-9e32ffb3cd12",
        "role": "user",
        "content": "Can you summarize my spending on Groceries this month?"
      },
      "aiResponse": {
        "id": "m5566778-b543-4ee1-b0bb-9e32ffb3cd99",
        "role": "assistant",
        "content": "You have spent a total of **$125.50** on Groceries this month, which represents 25% of your target budget ($500.00)."
      }
    }
    ```
