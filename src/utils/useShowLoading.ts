import { useEffect, useRef, useState } from "react";

/**
 * Smooths loading transitions to prevent flicker.
 * - Shows immediately when loading starts.
 * - Stays visible at least `minDisplay` ms after loading ends.
 */
export function useShowLoading(loading: boolean, minDisplay = 300): boolean {
    const [show, setShow] = useState(loading);
    const showRef = useRef(show);
    const shownAtRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        if (loading) {
            if (timerRef.current) clearTimeout(timerRef.current);
            showRef.current = true;
            setShow(true);
            shownAtRef.current = Date.now();
        } else {
            const elapsed = Date.now() - shownAtRef.current;
            const remaining = minDisplay - elapsed;
            if (showRef.current && remaining > 0) {
                timerRef.current = setTimeout(() => {
                    showRef.current = false;
                    setShow(false);
                }, remaining);
            } else {
                showRef.current = false;
                setShow(false);
            }
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [loading]);

    return show;
}
