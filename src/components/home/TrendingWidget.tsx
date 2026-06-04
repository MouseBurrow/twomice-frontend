import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { PostData } from "../../types";

type Props = { limit?: number };

export default function TrendingWidget({ limit = 4 }: Props) {
  const [trending, setTrending] = useState<PostData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getFeed("hot").then((feed) => {
      setTrending(feed.slice(0, limit));
    }).catch(() => {});
  }, [limit]);

  if (trending.length === 0) return null;

  return (
    <div className="trending-widget">
      <div className="trending-widget-header">🔥 Trending</div>
      <div>
        {trending.map((post, idx) => (
          <div
            key={`${post.slug}-${idx}`}
            className="trending-item"
            onClick={() => { if (post.board_id) navigate(`/b/${post.board_id}/post/${post.slug}`); }}
          >
            {post.board_id && (
              <div className="trending-board-name">b/{post.board_id}</div>
            )}
            <div className="trending-title">{post.title}</div>
            <div className="trending-stats">
              <span>▲ {post.vote_count ?? 0}</span>
              <span>💬 {post.reply_count ?? 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
