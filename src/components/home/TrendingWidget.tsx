import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import type { PostData } from "../../types";
import UpArrow from "../../icons/UpArrow";
import ReplyBubble from "../../icons/ReplyBubble";

type Props = { limit?: number };

export default function TrendingWidget({ limit = 4 }: Props) {
  const [trending, setTrending] = useState<PostData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api.getFeed("hot").then((feed) => {
      if (!cancelled) setTrending(feed.slice(0, limit));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [limit]);

  if (trending.length === 0) return null;

  return (
    <div className="trending-widget">
      <div className="trending-widget-header">Hot Cheese</div>
      <div>
        {trending.map((post, idx) => (
          <div
            key={`${post.slug}-${idx}`}
            className="trending-item"
            onClick={() => { if (post.board_id) navigate(`/b/${post.board_id}/nib/${post.slug}`); }}
          >
            {post.board_id && (
              <div className="trending-board-name">b/{post.board_id}</div>
            )}
            <div className="trending-title">{post.title}</div>
            <div className="trending-footer">
              <span className="trending-arrow">
                <UpArrow />
              </span>
              <span className="trending-score">{post.vote_count ?? 0}</span>
              {post.board_id && (
                <span className="trending-reply">
                  <ReplyBubble />
                  {post.reply_count ?? 0}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
