import { useDensity } from "../../contexts/DensityContext";
import LiveWidget from "./LiveWidget";
import TrendingWidget from "./TrendingWidget";
import ActiveBoardsWidget from "./ActiveBoardsWidget";

export default function HomeSidebar() {
  const { density } = useDensity();

  return (
    <div className="sidebar-container" data-density={density}>
      <LiveWidget />
      <TrendingWidget limit={3} />
      <ActiveBoardsWidget />
    </div>
  );
}
