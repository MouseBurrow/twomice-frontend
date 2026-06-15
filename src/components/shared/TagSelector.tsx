import { useEffect, useState } from "react";
import { api } from "../../api";

type Props = {
  board: string;
  bc: string;
  selected: string[];
  onChange: (tags: string[]) => void;
};

const MAX_TAGS = 4;

export default function TagSelector({ board, bc, selected, onChange }: Props) {
  const [allowed, setAllowed] = useState<string[]>([]);

  useEffect(() => {
    if (!board) return;
    let cancelled = false;
    api.getBoardTags(board)
      .then((tags: string[]) => { if (!cancelled) setAllowed(tags); })
      .catch(() => { if (!cancelled) setAllowed([]); });
    return () => { cancelled = true; };
  }, [board]);

  if (allowed.length === 0) return null;

  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else if (selected.length < MAX_TAGS) {
      onChange([...selected, tag]);
    }
  }

  return (
    <div className="tag-selector">
      <div className="tag-selector-header">
        <span className="tag-selector-label">Tags</span>
        {selected.length > 0 && (
          <span className="tag-selector-count">{selected.length}/{MAX_TAGS}</span>
        )}
      </div>
      <div className="tag-selector-chips">
        {allowed.map(tag => {
          const sel = selected.includes(tag);
          const maxed = selected.length >= MAX_TAGS && !sel;
          return (
            <button
              key={tag}
              type="button"
              className="nibble-tag-btn"
              data-sel={sel ? "true" : "false"}
              disabled={maxed}
              onClick={() => toggle(tag)}
              style={{
                '--tag-bc': bc,
                border: `1.5px solid ${sel ? bc : `color-mix(in srgb, ${bc} 30%, var(--border))`}`,
                background: sel ? `color-mix(in srgb, ${bc} 16%, transparent)` : 'transparent',
                color: sel ? bc : 'var(--text-faint)',
                opacity: maxed ? 0.32 : 1,
              } as React.CSSProperties}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
