interface Props {
    on: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}

export default function Toggle({ on, onChange, disabled }: Props) {
    return (
        <button
            type="button"
            className={`mini-toggle${on ? " mini-toggle--on" : ""}`}
            onClick={() => onChange(!on)}
            disabled={disabled}
        >
            <div className="mini-toggle-thumb" />
        </button>
    );
}
