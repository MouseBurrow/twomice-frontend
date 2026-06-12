import { useEffect, useRef, useState } from "react";

/**
 * Smooths loading transitions to prevent flicker.
 * - Waits `delay` ms before showing the loading state.
 * - Once shown, stays visible at least `minDisplay` ms.
 */
export function useShowLoading(loading: boolean, delay = 150, minDisplay = 300): boolean {
    const [show, setShow] = useState(false);
    const shownAtRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (loading) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setShow(true);
                shownAtRef.current = Date.now();
            }, delay);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
            const elapsed = Date.now() - shownAtRef.current;
            const remaining = minDisplay - elapsed;
            if (show && remaining > 0) {
                timerRef.current = setTimeout(() => setShow(false), remaining);
            } else {
                setShow(false);
            }
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [loading]);

    return show;
}
