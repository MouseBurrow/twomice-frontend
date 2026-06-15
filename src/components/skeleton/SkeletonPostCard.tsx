import { useMemo } from "react";
import { useDensity } from "../../contexts/DensityContext";
import "./skeleton.scss";

const ROTS = [2, -1.5, 0.5, -0.8, 1.2, -2.5, 0, 1.8, -1, 0.3];
const CORNERS = [12, 20, 8, 16];

function rand<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function SkeletonPostCard() {
    const { density } = useDensity();
    const isCompact = density === "compact";

    const style = useMemo(() => {
        const rot = rand(ROTS);
        const shadowX = rot > 0 ? -5 : 5;
        return {
            '--card-rot': `${rot}deg`,
            '--bc': 'var(--accent)',
            borderRadius: rand(CORNERS),
            boxShadow: `${shadowX}px 8px 20px var(--shadow), 0 1px 4px var(--shadow)`,
        } as React.CSSProperties;
    }, []);

    return (
        <div className="pcard-wrap scrap">
            <div className="skeleton-pin" />

            <article
                className="post-card"
                data-density={density}
                style={style}
            >
                <div className="post-card-inner">
                    <div className="post-card-meta-row">
                        <span className="shimmer-line shimmer-meta-sm" />
                        <span className="shimmer-line shimmer-meta-lg" />
                    </div>

                    <div className="post-card-title">
                        <span className="shimmer-line shimmer-title" />
                    </div>

                    {!isCompact && (
                        <div className="post-card-preview">
                            <span className="shimmer-line shimmer-prev-lg" />
                            <span className="shimmer-line shimmer-prev-sm" />
                        </div>
                    )}

                    <div className="pcard-footer">
                        <div className="skeleton-votes">
                            <span className="shimmer-line shimmer-votes" />
                        </div>
                        <div className="pcard-footer-end">
                            <span className="shimmer-line shimmer-footer" />
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
