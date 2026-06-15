import { useState, useEffect } from "react";
import { api } from "../../api";
import { ApiError } from "../../apiError";
import { autoResize } from "../../utils/autoResize";
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
      <div className="modal-card modal-card--search" onClick={e => e.stopPropagation()}>
        <div className="modal-stripe" style={creating ? { background: `linear-gradient(90deg, ${newColor}, color-mix(in srgb, ${newColor} 60%, #fff))` } : undefined} />

        <div className="bsearch-header">
          <div className="bsearch-header-row">
            {creating && (
              <span className="bsearch-header-dot" style={{ background: newColor }} />
            )}
            <span className="bsearch-header-title">{creating ? "New Board" : "Browse Boards"}</span>
          </div>
          {!creating && (
            <input className="board-search-input" type="text" placeholder="Search boards…" autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          )}
        </div>

        {creating ? (
          <form className="bsearch-create" onSubmit={handleCreate}>
            <div className="field">
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
            <div className="field">
              <label className="field-label">Slug — URL: b/{newSlug || 'yourboard'}</label>
              <div className="bsearch-slug-wrap">
                <span className="bsearch-slug-prefix">b/</span>
                <input
                    className="field-input bsearch-slug-input"
                    placeholder="yourboard"
                    value={newSlug}
                    onChange={e => { setSlugTouched(true); setNewSlug(toSlug(e.target.value)); }}
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Description <span className="field-label-note">(optional)</span></label>
              <textarea
                className="field-textarea"
                placeholder="What's this board about?"
                onInput={autoResize}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={2}
                style={{ borderColor: newDesc ? newColor : undefined }}
              />
            </div>
            <div className="field">
              <label className="field-label">Board Colour</label>
              <div className="bsearch-swatches">
                {SWATCH_COLORS.map(c => (
                    <button
                        key={c} type="button"
                        className={`bsearch-swatch${newColor === c ? " bsearch-swatch--active" : ""}`}
                        onClick={() => setNewColor(c)}
                        style={{ background: c }}
                    />
                ))}
              </div>
            </div>
            {createError && (
              <div className="field-error">{createError}</div>
            )}
            <div className="bsearch-create-actions">
              <button type="button" className="modal-cancel" onClick={() => { setCreating(false); setCreateError(null); }}>Back</button>
              <button type="submit" className="modal-submit" disabled={!newName.trim() || !newSlug.trim() || createBusy} style={newName.trim() ? { background: newColor } : undefined}>
                {createBusy ? "Creating…" : "Create board"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="bsearch-list">
              {loading ? (
                <div className="bsearch-empty">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="bsearch-empty">No boards match</div>
              ) : (
                filtered.map(b => (
                  <div key={b.name} className="bsearch-item" onClick={() => handleBoardClick(b.name)}>
                    <span className="bsearch-item-name">b/{b.name}</span>
                    <span className="bsearch-item-desc">{b.description}</span>
                  </div>
                ))
              )}
            </div>
            <div className="bsearch-footer">
              <button type="button" className="btn-ghost bsearch-create-btn" onClick={() => setCreating(true)}>
                + Start a new board
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
