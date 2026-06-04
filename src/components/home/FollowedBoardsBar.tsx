import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { FollowedBoardInfo } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";
import { dv } from "../../utils/density";

export default function FollowedBoardsBar() {
  const [boards, setBoards] = useState<FollowedBoardInfo[]>([]);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { density } = useDensity();

  useEffect(() => {
    if (auth.status === "guest") return;
    let cancelled = false;
    api.getFollowedBoards()
      .then(data => { if (!cancelled) setBoards(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [auth.status]);

  if (auth.status === "guest" || boards.length === 0) return null;

  return (
    <div className="followed-bar" style={{ marginBottom: dv(density, "0.75rem", "1.25rem", "1.5rem") }}>
      <div className="followed-bar-label" style={{ marginBottom: dv(density, "0.375rem", "0.625rem", "0.875rem") }}>Following</div>
      <div className="followed-bar-scroll" style={{ gap: dv(density, "0.375rem", "0.625rem", "0.875rem") }}>
        {boards.map(board => (
          <div
            key={board.id}
            className="followed-board-chip"
            onClick={() => navigate(`/b/${board.name}`)}
            style={{
              padding: dv(density, "0.375rem 0.625rem", "0.625rem 1rem", "0.8125rem 1.25rem"),
              minWidth: dv(density, "6.875rem", "9.6875rem", "11.5625rem"),
            }}
          >
            <div className="followed-board-name">b/{board.name}</div>
            {density !== "compact" && board.description && (
              <div className="followed-board-desc" style={{ marginTop: "0.1875rem" }}>{board.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
