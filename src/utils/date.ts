export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
}

export function formatRelativeTime(iso: string): string {
    const now = Date.now();
    const diff = now - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 7) {
        return new Date(iso).toLocaleDateString();
    }
    if (days >= 1) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    if (hours >= 1) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    if (minutes >= 1) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    return 'just now';
}
