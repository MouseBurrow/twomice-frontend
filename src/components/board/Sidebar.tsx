import { useDensity } from "../../contexts/DensityContext";
import LiveWidget from "../home/LiveWidget";
import TrendingWidget from "../home/TrendingWidget";

export default function Sidebar() {
  const { density } = useDensity();

  return (
    <div className="sidebar-container" data-density={density}>
      <LiveWidget />
      <TrendingWidget limit={4} />
    </div>
  );
}
