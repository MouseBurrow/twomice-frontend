import PushPin from "../shared/PushPin";
import LiveWidget from "./LiveWidget";
import TrendingWidget from "./TrendingWidget";
import ActiveBoardsWidget from "./ActiveBoardsWidget";
import { boardColorFromName } from "../../utils/hash";
import type { FollowedBoardInfo } from "../../types";

const SIDEBAR_ROTS = [-0.5, 0.4, -0.35, 0.55];

type Props = {
    followed?: FollowedBoardInfo[];
    navigate?: (path: string) => void;
};

export default function HomeSidebar({ followed, navigate }: Props) {
    return (
        <div className="sidebar-container">
            {followed && followed.length > 0 && (
                <div style={{ position: 'relative', marginTop: 18 }}>
                    <PushPin />
                    <div style={{ transform: `rotate(${SIDEBAR_ROTS[0]}deg)`, transformOrigin: '50% 4px' }}>
                        <div className="widget-card">
                            <div className="widget-header">Your Burrow</div>
                            <div>
                                {followed.map(b => {
                                    const bc = boardColorFromName(b.name);
                                    return (
                                        <div key={b.id} className="followed-item" onClick={() => navigate?.(`/b/${b.name}`)}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: bc, display: 'inline-block', flexShrink: 0, border: '1.5px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                            <div className="followed-item-info">
                                                <div className="followed-item-name" style={{ color: bc }}>b/{b.name}</div>
                                                <div className="followed-item-desc">{b.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[1]}deg)`, transformOrigin: '50% 4px' }}>
                    <LiveWidget />
                </div>
            </div>
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[2]}deg)`, transformOrigin: '50% 4px' }}>
                    <TrendingWidget limit={3} />
                </div>
            </div>
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[3]}deg)`, transformOrigin: '50% 4px' }}>
                    <ActiveBoardsWidget />
                </div>
            </div>
        </div>
    );
}
