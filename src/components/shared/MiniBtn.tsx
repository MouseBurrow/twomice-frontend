import type { ReactNode } from "react";

interface Props {
    active?: boolean;
    onClick?: () => void;
    children: ReactNode;
}

export default function MiniBtn({ active, onClick, children }: Props) {
    return (
        <button
            type="button"
            className={`mini-btn${active ? " mini-btn--active" : ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
