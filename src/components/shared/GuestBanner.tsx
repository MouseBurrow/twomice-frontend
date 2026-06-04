import { useDensity } from '../../contexts/DensityContext';
import { dv } from '../../utils/density';

type Props = { onLogin: () => void };

export default function GuestBanner({ onLogin }: Props) {
  const { density } = useDensity();

  return (
    <div className="guest-banner" style={{ marginBottom: dv(density, "0.625rem", "1rem", "1.25rem") }}>
      <div className="guest-banner-stripe" />
      <div style={{ paddingTop: "0.125rem" }}>
        <div className="guest-banner-title">Browsing as guest</div>
        <div className="guest-banner-text">Sign in to post, vote, reply, and follow boards. Your identity stays anonymous.</div>
      </div>
      <button className="btn-pill" style={{ fontSize: "0.8125rem" }} onClick={onLogin}>Sign In</button>
    </div>
  );
}
