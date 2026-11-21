type AccountType = "savings" | "spending"

type TransactionType = "expense" | "transfer" | "income"

type TransactionCategory = "shopping" | "food" | "transport" | "entertainment" | "other" | "education"

type UserRole = "admin" | "user"

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    current_amount: number;
    is_archived: boolean;
}

export interface Users {
    id: string;
    user_code: string;
    hash_password: string;
    currency: string;
    hash_token: string | null;
    token_expires_at: string | null;
    is_deleted: boolean;
    deleted_at: string | null;
    role: UserRole;
}

export interface Transactions {
    id: string;
    user_id: string;
    type: TransactionType;
    from_account_id: string | null;
    to_account_id: string | null;
    category: TransactionCategory | null;
    amount: number;
    note: string | null;
    transaction_date: string;
    deleted_at: string | null;
}