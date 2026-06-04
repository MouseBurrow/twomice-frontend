import { ApiError, type ApiErrorPayload } from "./apiError.ts";
import type {
    AccountData, SqueakData, NibData, EchoData,
    BoardData, BoardSummary, UserStats,
} from "./types.ts";

export const API_BASE = "/api";

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers);

    if (
        options.body &&
        !headers.has("Content-Type") &&
        !(options.body instanceof FormData)
    ) {
        headers.set("Content-Type", "application/json");
    }

    const sep = path.includes("?") ? "&" : "?";
    const res = await fetch(`${API_BASE}${path}${sep}_=${Date.now()}`, {
        credentials: "include",
        headers,
        ...options,
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok) {
        let payload: unknown = undefined;
        let message = res.statusText;
        let code: string | undefined;

        if (contentType?.includes("application/json")) {
            payload = await res.json();
            message = (payload as { message?: string })?.message ?? message;
            code = (payload as { error?: string; code?: string })?.error ??
                   (payload as { code?: string })?.code;
        } else {
            message = await res.text();
        }

        throw new ApiError(path, res.status, message, code, payload as ApiErrorPayload | undefined);
    }

    if (contentType?.includes("application/json")) {
        return res.json();
    }

    return undefined as T;
}

export const api = {
    // ── Auth ─────────────────────────────────────────────────────────
    login: (body: { username: string; password: string }) =>
        request<void>("/login", { method: "POST", body: JSON.stringify(body) }),

    signup: (body: { username: string; password: string }) =>
        request<void>("/signup", { method: "POST", body: JSON.stringify(body) }),

    logout: () =>
        request<void>("/logout", { method: "POST" }),

    account: () =>
        request<AccountData>("/account"),

    // ── Boards ───────────────────────────────────────────────────────
    createBoard: (body: { name: string; description: string }) =>
        request<void>("/mcf", { method: "POST", body: JSON.stringify(body) }),

    getBoard: (topic: string) =>
        request<BoardData>(`/mcf/${topic}`),

    getAllBoards: () =>
        request<BoardData[]>("/mcf"),

    // ── Nibs ─────────────────────────────────────────────────────────
    createNib: (topic: string, body: { title: string; content: string }) =>
        request<void>(`/mcf/${topic}/nib`, { method: "POST", body: JSON.stringify(body) }),

    getNib: (topic: string, postId: string) =>
        request<NibData>(`/mcf/${topic}/nib/${postId}`),

    getAllNibs: (topic: string) =>
        request<NibData[]>(`/mcf/${topic}/nib`),

    // ── Squeaks / Echoes ─────────────────────────────────────────────
    createSqueak: (topic: string, post: string, body: { content: string }) =>
        request<void>(`/mcf/${topic}/nib/${post}/sqk`, { method: "POST", body: JSON.stringify(body) }),

    getAllSqueaks: (topic: string, post: string) =>
        request<SqueakData[]>(`/mcf/${topic}/nib/${post}/sqk`),

    createEcho: (topic: string, post: string, comment: string, body: { content: string }) =>
        request<void>(`/mcf/${topic}/nib/${post}/sqk/${comment}/echoes`, { method: "POST", body: JSON.stringify(body) }),

    getEchoes: (topic: string, post: string, comment: string) =>
        request<EchoData[]>(`/mcf/${topic}/nib/${post}/sqk/${comment}/echoes`),

    // ── Feed ─────────────────────────────────────────────────────────
    /** Cross-board feed. Returns nibs with board_id set. sort: hot|new|top */
    getFeed: (sort: "hot" | "new" | "top") =>
        request<NibData[]>(`/feed?sort=${sort}`),

    /** Active boards sorted by recent post count. */
    getActiveBoards: (limit = 8) =>
        request<BoardSummary[]>(`/mcf/active?limit=${limit}`),

    // ── Following ────────────────────────────────────────────────────
    /** Auth-gated. Returns board IDs the authenticated user follows. */
    getFollowedBoards: () =>
        request<string[]>("/users/me/following"),

    /** Auth-gated. Follow a board. */
    followBoard: (boardId: string) =>
        request<void>(`/users/me/following/${boardId}`, { method: "PUT" }),

    /** Auth-gated. Unfollow a board. */
    unfollowBoard: (boardId: string) =>
        request<void>(`/users/me/following/${boardId}`, { method: "DELETE" }),

    // ── User ─────────────────────────────────────────────────────────
    /** Auth-gated. Returns counts for the authenticated user only. */
    getUserStats: () =>
        request<UserStats>("/users/me/stats"),

    /** Auth-gated. Returns the authenticated user's own nibs. */
    getUserNibs: () =>
        request<NibData[]>("/users/me/nibs"),
};
