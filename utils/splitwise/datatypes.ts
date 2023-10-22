import exp from "constants";

export interface Balance {
    currency_code: string,
    amount: string,
};

export interface Debt {
    from: number,
    to: number,
    amount: string,
    currency_code: string
};

export interface Group {
    id: number,
    name: string,
    group_type: "apartment" | "house" | "trip" | "other",
    updated_at: string,
    simplify_by_default: boolean,
    members: {
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        registration_status: "confirmed" | "dummy" | "invited",
        picture: {
            small: string,
            medium: string,
            large: string
        },
        balance: Balance[]
    }[]
    original_debts: Debt[],
    simplified_debts: Debt[],
    avatar: {
        original: string | null,
        xxlarge: string,
        xlarge: string,
        large: string,
        medium: string,
        small: string
    },
    custom_avatar: true,
    cover_photo: {
        xxlarge: string,
        xlarge: string
    },
    invite_link: string
};

export interface Friend {
    id: number,
    first_name: string | null,
    last_name: string | null,
    email: string | null,
    registration_status: string,
    picture: {
        small: string | null,
        medium: string | null,
        large: string | null
    },
    balance: Balance[],
    groups: {
        group_id: number,
        balance: number
    }[],
    updated_at: string
};

export interface Repayment {
    from: number,
    to: number,
    amount: string,
};

export interface User {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    registration_status: "confirmed" | "dummy" | "invited",
    picture: {
        small?: string,
        medium?: string,
        large?: string
    },
    custom_picture?: false
};

export interface Expense {
    id: number,
    group_id: number | null,
    friendship_id: number | null,
    expense_bundle_id: number | null,
    description: string,
    repeats: boolean,
    repeat_interval: "never" | "weekly" | "fortnightly" | "monthly" | "yearly" | null,
    email_reminder: boolean,
    email_reminder_in_advance: number,
    next_repeat: boolean,
    details: string | null,
    comments_count: number,
    payment: boolean,
    creation_method: string | null,
    transaction_method: string,
    transaction_confirmed: boolean | null,
    transaction_id: number | null,
    transaction_status: null,
    cost: string,
    currency_code: string,
    repayments: Repayment[],
    date: string,
    created_at: string,
    created_by: User | null,
    updated_at: string,
    updated_by: User | null,
    deleted_at: string | null,
    deleted_by: User | null,
    category: {
        id: number,
        name: string
    }[],
    receipt: {
        large: string | null,
        original: string | null
    },
    users: {
        user: User,
        user_id: number,
        paid_share: string,
        owed_share: string,
        net_balance: string,
    }[]
};
