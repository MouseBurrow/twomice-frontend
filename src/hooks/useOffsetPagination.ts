import { useCallback, useRef, useState } from "react";
import type { OffsetPage } from "../types";

type HasHash = { hash: string };

export function useOffsetPagination<T extends HasHash>(
    limit: number,
) {
    const [items, setItems] = useState<T[]>([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const itemsRef = useRef(items);
    itemsRef.current = items;
    const offsetRef = useRef(offset);
    offsetRef.current = offset;
    const totalRef = useRef(total);
    totalRef.current = total;

    const hasMore = offset + limit < total;

    const loadMore = useCallback(async (
        fetchFn: (nextOffset: number) => Promise<OffsetPage<T>>,
    ): Promise<T[]> => {
        const next = offsetRef.current + limit;
        if (loadingRef.current || next >= totalRef.current) return [];
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await fetchFn(next);
            const cur = itemsRef.current;
            const existing = new Set(cur.map(x => x.hash));
            const fresh = res.data.filter(x => !existing.has(x.hash));
            if (fresh.length > 0) {
                const nextItems = [...cur, ...fresh];
                itemsRef.current = nextItems;
                setItems(nextItems);
                setOffset(next);
                return fresh;
            }
            setOffset(totalRef.current);
            return [];
        } catch {
            return [];
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [limit]);

    const replace = useCallback((newItems: T[], newTotal: number, newOffset = 0) => {
        itemsRef.current = newItems;
        setItems(newItems);
        setOffset(newOffset);
        setTotal(newTotal);
    }, []);

    return { items, setItems, offset, setOffset, total, hasMore, loading, loadMore, replace };
}
