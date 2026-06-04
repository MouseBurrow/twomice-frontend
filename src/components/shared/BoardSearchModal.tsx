import { useState, useEffect } from "react";
import { api } from "../../api";
import type { BoardData } from "../../types";

interface Props {
  onClose: () => void;
  navigate: (path: string) => void;
}

export default function BoardSearchModal({ onClose, navigate }: Props) {
  const [q, setQ] = useState("");
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllBoards()
      .then(setBoards)
      .catch(() => setBoards([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = boards.filter(b =>
    b.name.toLowerCase().includes(q.toLowerCase()) ||
    b.description.toLowerCase().includes(q.toLowerCase())
  );

  const handleBoardClick = (boardName: string) => {
    navigate("/b/" + boardName);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: "35rem", maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
        <div className="modal-stripe" />
        <div className="modal-header" style={{ padding: "1rem 1.25rem" }}>
          <div className="modal-title" style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>Browse Boards</div>
          <input className="board-search-input" type="text" placeholder="Search boards…" autoFocus value={q} onChange={e => setQ(e.target.value)} />
        </div>
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
      </div>
    </div>
  );
}
