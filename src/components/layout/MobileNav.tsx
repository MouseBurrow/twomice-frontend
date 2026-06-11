import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./MobileNav.scss";

export default function MobileNav() {
    const { isGuest } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const cur = location.pathname;

    return (
        <nav className="mobile-nav">
            <button
                className={`mobile-nav-btn${cur === "/" ? " mobile-nav-btn--active" : ""}`}
                onClick={() => navigate("/")}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 8.5L9 2l7 6.5V16a1 1 0 01-1 1H11v-4H7v4H3a1 1 0 01-1-1V8.5z"
                        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
                        fill={cur === "/" ? "currentColor" : "none"}
                        fillOpacity={cur === "/" ? .18 : 0} />
                </svg>
                <span>Home</span>
            </button>

            <button className="mobile-nav-btn" onClick={() => document.dispatchEvent(new CustomEvent("open-board-search"))}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span>Search</span>
            </button>

            <button
                className={`mobile-nav-btn${cur === "/profile" ? " mobile-nav-btn--active" : ""}`}
                onClick={() => isGuest ? navigate("/auth") : navigate("/profile")}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4"
                        fill={cur === "/profile" ? "currentColor" : "none"}
                        fillOpacity={cur === "/profile" ? .18 : 0} />
                    <path d="M2 16.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span>{isGuest ? "Sign in" : "Profile"}</span>
            </button>
        </nav>
    );
}
