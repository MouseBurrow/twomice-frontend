import { useSyncExternalStore } from "react";

export type DateFormat = "relative" | "smart" | "absolute";

let _dfListeners: Array<() => void> = [];

export function notifyDateFormatChange() {
    _dfListeners.forEach(l => l());
}

function subscribeDateFormat(cb: () => void) {
    _dfListeners.push(cb);
    return () => { _dfListeners = _dfListeners.filter(l => l !== cb); };
}

function getDateFormatSnapshot(): string {
    return localStorage.getItem("twomice_dateformat") ?? "smart";
}

export function useDateFormat(): DateFormat {
    return useSyncExternalStore(subscribeDateFormat, getDateFormatSnapshot) as DateFormat;
}

function formatRelative(iso: string, fmt: DateFormat): string {
    const now = Date.now();
    const date = new Date(iso);
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (fmt === "absolute") {
        return date.toLocaleDateString();
    }

    if (fmt === "relative") {
        if (years >= 1) return `${years}y ago`;
        if (months >= 1) return `${months}mo ago`;
        if (weeks >= 1) return `${weeks}w ago`;
        if (days >= 1) return `${days}d ago`;
        if (hours >= 1) return `${hours}h ago`;
        if (minutes >= 1) return `${minutes}m ago`;
        return "just now";
    }

    if (days >= 30) {
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
    if (days >= 1) {
        return `${days}d ago`;
    }
    if (hours >= 1) {
        return `${hours}h ago`;
    }
    if (minutes >= 1) {
        return `${minutes}m ago`;
    }
    return "just now";
}

export function formatRelativeTime(iso: string, format?: DateFormat): string {
    const fmt = format ?? (localStorage.getItem("twomice_dateformat") as DateFormat | null) ?? "smart";
    return formatRelative(iso, fmt);
}

export function useFormatRelativeTime(iso: string): string {
    const fmt = useDateFormat();
    return formatRelative(iso, fmt);
}
