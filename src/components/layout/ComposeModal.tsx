import { useState, useEffect } from "react";
import { api } from "../../api";
import { useCreateNibble } from "../../hooks/useCreateNibble";
import { autoResize } from "../../utils/autoResize";
import { boardColorFromName } from "../../utils/hash";
import type { BoardData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import TagSelector from "./TagSelector";

interface Props {
  onClose: () => void;
  defaultBoard?: string;
}

export default function ComposeModal({ onClose, defaultBoard }: Props) {
  const [board, setBoard] = useState(defaultBoard ?? "");
  const [boards, setBoards] = useState<BoardData[]>([]);

  const { title, setTitle, content, setContent, tags, setTags, loading: busy, error, submit } = useCreateNibble({
    board,
    onSuccess: onClose,
    contentRequired: true,
  });

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

  const canSubmit = title.trim() && content.trim() && !busy;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-stripe" />
        <div className="modal-header">
          <div className="modal-title">New Nibble</div>
        </div>

        <form className="modal-body" onSubmit={e => { e.preventDefault(); submit(); }}>
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
            <textarea className="field-textarea" onInput={autoResize} placeholder="Start a line with > for greentext…" value={content} onChange={e => setContent(e.target.value)} />
          </div>

          <TagSelector board={board} bc={boardColorFromName(board || "general")} selected={tags} onChange={setTags} />

          <ErrorMessage error={error}/>
        </form>

        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-submit" onClick={submit} disabled={!canSubmit}>
            {busy ? <><div className="modal-spinner" />Posting…</> : "Post Anonymously"}
          </button>
        </div>
      </div>
    </div>
  );
}
