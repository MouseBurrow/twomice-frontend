import { useState, useEffect } from "react";
import { api } from "../../api";
import { ApiError } from "../../apiError";
import type { BoardData } from "../../types";

interface Props {
  onClose: () => void;
  defaultBoard?: string;
}

export default function ComposeModal({ onClose, defaultBoard }: Props) {
  const [board, setBoard] = useState(defaultBoard ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getAllBoards()
      .then(b => {
        if (!cancelled) {
          setBoards(b);
          if (!defaultBoard && b.length > 0) setBoard(b[0].name);
        }
      })
      .catch(() => { if (!cancelled) setBoards([]); });
    return () => { cancelled = true; };
  }, [defaultBoard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.createPost(board, { title, content });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Failed to post");
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = title.trim() && content.trim() && !busy;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-stripe" />
        <div className="modal-header">
          <div className="modal-title">New Post</div>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Board</label>
            <select className="field-select" value={board} onChange={e => setBoard(e.target.value)}>
              {boards.map(b => (
                <option key={b.name} value={b.name}>b/{b.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Title</label>
            <input className="field-input" type="text" placeholder="What's this about?" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Message</label>
            <textarea className="field-textarea" placeholder="Start a line with > for greentext…" value={content} onChange={e => setContent(e.target.value)} />
            {error && <div className="field-error">{error}</div>}
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-submit" onClick={handleSubmit} disabled={!canSubmit}>
            {busy ? <><div className="modal-spinner" />Posting…</> : "Post Anonymously"}
          </button>
        </div>
      </div>
    </div>
  );
}
