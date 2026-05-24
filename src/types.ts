export type AuthState =
    { status: "unknown" } |
    { status: "guest" } |
    { status: "user"; info: AccountData } |
    { status: "admin"; info: AccountData };

export type AccountData = {
    username: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
};

export type BoardData = {
    name: string;
    description: string;
    created_at: string;
    deleted: boolean;
};

export type NibData = {
    title: string;
    slug: string;
    content: string;
    image_url: string;
    created_at: string;
    deleted: boolean;
    vote_count?: number;
};

export type SqueakData = {
    hash: string;
    content: string;
    created_at: string;
    deleted: boolean;
    vote_count?: number;
};

export type EchoData = {
    hash: string;
    content: string;
    created_at: string;
    deleted: boolean;
};
