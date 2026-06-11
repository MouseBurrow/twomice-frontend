import PushPin from "../shared/PushPin";
import LiveWidget from "../home/LiveWidget";
import TrendingWidget from "../home/TrendingWidget";
import "../../assets/components.scss";

const SIDEBAR_ROTS = [-0.5, 0.4];

export default function Sidebar() {
    return (
        <div className="sidebar-container">
            <div className="sidebar-scrap" style={{ marginTop: 18 }}>
                <PushPin />
                <div className="sidebar-scrap-inner" style={{ transform: `rotate(${SIDEBAR_ROTS[0]}deg)` }}>
                    <LiveWidget />
                </div>
            </div>
            <div className="sidebar-scrap" style={{ marginTop: 18 }}>
                <PushPin />
                <div className="sidebar-scrap-inner" style={{ transform: `rotate(${SIDEBAR_ROTS[1]}deg)` }}>
                    <TrendingWidget limit={4} />
                </div>
            </div>
        </div>
    );
}
