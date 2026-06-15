import { useDensity } from '../../contexts/DensityContext';
import { dv } from '../../utils/density';

type Props = { onLogin: () => void };

export default function GuestBanner({ onLogin }: Props) {
  const { density } = useDensity();

  return (
    <div className="guest-banner card-stripe" style={{ marginBottom: dv(density, "0.625rem", "1rem", "1.25rem") }}>
      <div className="guest-banner-body">
        <div className="guest-banner-title">Browsing as guest</div>
        <div className="guest-banner-text">Hop in to post, vote, squeak, and follow burrows. Your identity stays anonymous.</div>
      </div>
      <button className="btn-pill" onClick={onLogin}>Enter the Burrow</button>
    </div>
  );
}
