import { useState, useEffect } from "react";
import { api } from "../../api";
import { ApiError } from "../../apiError";
import type { BoardData } from "../../types";

interface Props {
  onClose: () => void;
  navigate: (path: string) => void;
}

export default function BoardSearchModal({ onClose, navigate }: Props) {
  const [q, setQ] = useState("");
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
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
    b.name.toLowerCase().includes(q.toLowerCase()) ||
    b.description.toLowerCase().includes(q.toLowerCase())
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
        <div className="modal-stripe" />
        <div className="modal-header" style={{ padding: "1rem 1.25rem" }}>
          <div className="modal-title" style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
            {creating ? "Start a new board" : "Browse Boards"}
          </div>
          {!creating && (
            <input className="board-search-input" type="text" placeholder="Search boards…" autoFocus value={q} onChange={e => setQ(e.target.value)} />
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
                onChange={e => setNewName(e.target.value)}
                maxLength={32}
              />
            </div>
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">Description</label>
              <textarea
                className="field-textarea"
                placeholder="What's this board about?"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={2}
              />
            </div>
            {createError && (
              <div className="field-error" style={{ marginBottom: "0.75rem" }}>{createError}</div>
            )}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" className="modal-cancel" onClick={() => { setCreating(false); setCreateError(null); }}>Back</button>
              <button type="submit" className="modal-submit" disabled={!newName.trim() || createBusy}>
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
