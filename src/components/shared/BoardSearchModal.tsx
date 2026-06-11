import { useState, useEffect } from "react";
import { api } from "../../api";
import { ApiError } from "../../apiError";
import type { BoardData } from "../../types";

interface Props {
  onClose: () => void;
  navigate: (path: string) => void;
}

const SWATCH_COLORS = [
    '#8b4513','#b5541a','#c8761a',
    '#b02272','#c45482','#8b2252',
    '#2d6a4f','#1a6a3a','#52a878',
    '#3d5a8a','#1d5a7a','#5a7aaa',
    '#7a3a10','#5a3d8a','#6a3d8a',
    '#8a1a1a','#4a4a5a','#1a1a4a',
];

function toSlug(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
}

export default function BoardSearchModal({ onClose, navigate }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newColor, setNewColor] = useState('#8b4513');
  const [slugTouched, setSlugTouched] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getAllBoards()
      .then(data => { if (!cancelled) setBoards(data); })
      .catch(() => { if (!cancelled) setBoards([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = boards.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBoardClick = (boardName: string) => {
    navigate("/b/" + boardName);
    onClose();
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || createBusy) return;
    setCreateBusy(true);
    setCreateError(null);
    try {
      await api.createBoard({ name: newName.trim(), description: newDesc.trim() });
      navigate("/b/" + newName.trim());
      onClose();
    } catch (err: unknown) {
      setCreateError(err instanceof ApiError ? err.message : "Failed to create board");
    } finally {
      setCreateBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: "35rem", maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
        <div className="modal-stripe" style={creating ? { background: `linear-gradient(90deg, ${newColor}, color-mix(in srgb, ${newColor} 60%, #fff))` } : undefined} />
        <div className="modal-header" style={{ padding: "1rem 1.25rem" }}>
          <div className="modal-title" style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
            {creating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: newColor, display: 'inline-block', border: '2px solid rgba(0,0,0,0.12)', boxShadow: `0 1px 4px rgba(0,0,0,0.25), 0 0 0 3px color-mix(in srgb,${newColor} 18%,transparent)`, flexShrink: 0 }} />
                New Board
              </div>
            ) : "Browse Boards"}
          </div>
          {!creating && (
            <input className="board-search-input" type="text" placeholder="Search boards…" autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          )}
        </div>

        {creating ? (
          <form onSubmit={handleCreate} style={{ padding: "0 1.25rem 1rem" }}>
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">Board name</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. cooking, game-dev, etc."
                autoFocus
                value={newName}
                onChange={e => {
                    setNewName(e.target.value);
                    if (!slugTouched) setNewSlug(toSlug(e.target.value));
                }}
                maxLength={32}
                style={{ borderColor: newName ? newColor : undefined }}
              />
            </div>
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">Slug — URL: b/{newSlug || 'yourboard'}</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 13, color: 'var(--text-faint)',
                    fontFamily: "'Space Grotesk', sans-serif", pointerEvents: 'none',
                }}>b/</span>
                <input
                    className="field-input"
                    style={{ paddingLeft: 28, borderColor: newSlug ? newColor : undefined }}
                    placeholder="yourboard"
                    value={newSlug}
                    onChange={e => { setSlugTouched(true); setNewSlug(toSlug(e.target.value)); }}
                />
              </div>
            </div>
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">Description <span style={{ color: 'var(--text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea
                className="field-textarea"
                placeholder="What's this board about?"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={2}
                style={{ borderColor: newDesc ? newColor : undefined }}
              />
            </div>
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">Board Colour</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SWATCH_COLORS.map(c => (
                    <button
                        key={c} type="button"
                        onClick={() => setNewColor(c)}
                        style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: c, border: 'none', cursor: 'pointer',
                            outline: newColor === c ? `3px solid ${c}` : '3px solid transparent',
                            outlineOffset: 2,
                            transform: newColor === c ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.12s, outline 0.12s',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
                        }}
                    />
                ))}
              </div>
            </div>
            {createError && (
              <div className="field-error" style={{ marginBottom: "0.75rem" }}>{createError}</div>
            )}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" className="modal-cancel" onClick={() => { setCreating(false); setCreateError(null); }}>Back</button>
              <button type="submit" className="modal-submit" disabled={!newName.trim() || !newSlug.trim() || createBusy} style={newName.trim() ? { background: newColor } : undefined}>
                {createBusy ? "Creating…" : "Create board"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="board-search-list">
              {loading ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading…</div>
              ) : filtered.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No boards match</div>
              ) : (
                filtered.map(b => (
                  <div key={b.name} className="board-search-item" onClick={() => handleBoardClick(b.name)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span className="board-search-item-name">b/{b.name}</span>
                      <span className="board-search-item-desc">{b.description}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ width: "100%", padding: "0.5rem", fontSize: "0.875rem" }}
                onClick={() => setCreating(true)}
              >
                + Start a new board
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
