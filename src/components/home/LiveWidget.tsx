import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { PostData } from "../../types";
import { useDensity } from "../../contexts/DensityContext";

export default function LiveWidget() {
  const [items, setItems] = useState<PostData[]>([]);
  const navigate = useNavigate();
  const { density } = useDensity();

  useEffect(() => {
    api.getFeed("new").then((feed) => {
      setItems(feed.slice(0, 6));
    }).catch(() => {});
  }, []);

  return (
    <div className="live-widget">
      <div className="live-widget-header">
        Live
        <div className="live-dot" />
      </div>
      <div>
        {items.map((item, idx) => (
          <div
            key={`${item.slug}-${idx}`}
            className="live-item"
            onClick={() => { if (item.board_id) navigate(`/b/${item.board_id}/post/${item.slug}`); }}
          >
            <div className={`live-item-dot ${item.is_hot ? "live-item-dot--hot" : "live-item-dot--new"}`} />
            <div className="live-item-body">
              {item.board_id && (
                <div className="live-board-name">b/{item.board_id}</div>
              )}
              <div className="live-title">{item.title}</div>
              {density !== "compact" && (
                <div className="live-time">
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
