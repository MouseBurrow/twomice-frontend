import PushPin from "../shared/PushPin";
import LiveWidget from "../home/LiveWidget";
import TrendingWidget from "../home/TrendingWidget";

const SIDEBAR_ROTS = [-0.5, 0.4];

export default function Sidebar() {
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
                    <TrendingWidget limit={4} />
                </div>
            </div>
        </div>
    );
}
