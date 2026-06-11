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

/** Lightweight board summary returned by feed/sidebar endpoints */
export type BoardSummary = {
    name: string;
    description: string;
    post_count: number;
};

export type PostData = {
    title: string;
    slug: string;
    content: string;
    image_url: string;
    created_at: string;
    deleted: boolean;
    vote_count?: number;
    /** Server-computed opaque anon identifier. Never a raw user ID. */
    anon_token?: string;
    /** True only in the authenticated author's own responses. Never sent to other users. */
    is_mine?: boolean;
    tags?: string[];
    reply_count?: number;
    view_count?: number;
    is_hot?: boolean;
    /** Present when nib is returned from a cross-board feed endpoint */
    board_id?: string;
    /** True when the thread has been locked by a moderator. */
    is_locked?: boolean;
};

export type CommentData = {
    hash: string;
    content: string;
    created_at: string;
    deleted: boolean;
    vote_count?: number;
    /** Server-computed opaque anon identifier. Never a raw user ID. */
    anon_token?: string;
    /** True only in the authenticated author's own responses. */
    is_mine?: boolean;
};

export type ReplyData = {
    hash: string;
    content: string;
    created_at: string;
    deleted: boolean;
};

export type UserStats = {
    nib_count: number;
    squeak_count: number;
    upvote_count: number;
    following_count: number;
};

export type FollowedBoardInfo = {
    id: string;
    name: string;
    description: string;
    post_count: number;
};

export type ReportData = {
    id: string;
    board_id: string;
    post_slug: string;
    reason: string;
    count: number;
    status: "pending" | "resolved";
    preview: string;
};

export type ModLogEntry = {
    action: string;
    board: string;
    reason: string;
    time: string;
};
