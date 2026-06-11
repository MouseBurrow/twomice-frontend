import PushPin from "../shared/PushPin";
import LiveWidget from "./LiveWidget";
import TrendingWidget from "./TrendingWidget";
import ActiveBoardsWidget from "./ActiveBoardsWidget";

const SIDEBAR_ROTS = [-0.5, 0.4, -0.35, 0.55];

export default function HomeSidebar() {
    return (
        <div className="sidebar-container">
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[0]}deg)`, transformOrigin: '50% 4px' }}>
                    <LiveWidget />
                </div>
            </div>
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[1]}deg)`, transformOrigin: '50% 4px' }}>
                    <TrendingWidget limit={3} />
                </div>
            </div>
            <div style={{ position: 'relative', marginTop: 18 }}>
                <PushPin />
                <div style={{ transform: `rotate(${SIDEBAR_ROTS[2]}deg)`, transformOrigin: '50% 4px' }}>
                    <ActiveBoardsWidget />
                </div>
            </div>
        </div>
    );
}
