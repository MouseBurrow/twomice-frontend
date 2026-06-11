import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
    show: boolean;
    type: "post" | "comment";
    locked?: boolean;
    onLock?: () => void;
    onRemove?: () => void;
    onBan?: (duration: "1d" | "perm") => void;
}

export default function ModActions({ show, type, locked, onLock, onRemove, onBan }: Props) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    if (!show) return null;

    function handleOpen(e: React.MouseEvent) {
        e.stopPropagation();
        const rect = btnRef.current!.getBoundingClientRect();
        const menuW = 172;
        setPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - menuW) });
        setOpen(v => !v);
    }

    const items: Array<[string, (() => void) | undefined, boolean]> = [
        ...(type === "post" ? [[locked ? "Unlock thread" : "Lock thread", onLock, false] as const] : []),
        ["Warn user", undefined, false],
        ["Remove content", onRemove, true],
        ["Ban user (1d)", () => onBan?.("1d"), true],
        ["Ban user (perm)", () => onBan?.("perm"), true],
    ];

    const dropdown = open && createPortal(
        <div
            ref={menuRef}
            className="mod-actions-dropdown"
            onClick={e => e.stopPropagation()}
            style={{ top: pos.top, left: pos.left }}
        >
            <div className="mod-actions-dropdown-header">Mod tools</div>
            {items.map(([label, fn, danger]) => (
                <button
                    key={label}
                    type="button"
                    className={`mod-actions-item${danger ? " mod-actions-item--danger" : ""}`}
                    onClick={() => { fn?.(); setOpen(false); }}
                >
                    {label}
                </button>
            ))}
        </div>,
        document.body,
    );

    return (
        <div className="mod-actions" onClick={e => e.stopPropagation()}>
            <button
                ref={btnRef}
                type="button"
                className="mod-actions-trigger"
                onClick={handleOpen}
                title="Mod tools"
            >
                ⚑
            </button>
            {dropdown}
        </div>
    );
}
