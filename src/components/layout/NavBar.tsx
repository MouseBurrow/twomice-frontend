import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";
import BoardSearchModal from "../shared/BoardSearchModal";
import ComposeModal from "../shared/ComposeModal";
import Logo from "../shared/Logo";
import SettingsDrawer from "./SettingsDrawer";
import "./NavBar.scss";

export default function NavBar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const { density } = useDensity();
    const [boardSearch, setBoardSearch] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    const isGuest = auth.status === "guest" || auth.status === "unknown";

    const handle = localStorage.getItem("twomice_handle") ??
        (auth.status === "user" || auth.status === "admin"
            ? `anon_${auth.info.username.slice(-4)}`
            : "guest");

    return (
        <>
            <header className="site-header">
                <div className="site-header-stripe" />
                <div className="header-inner" data-density={density}>
                    <Link className="header-logo" to="/">
                        <Logo size={density === "compact" ? 28 : density === "spacious" ? 38 : 34} />
                        TwoMice
                    </Link>

                    <div className="header-search-wrap">
                        <div
                            className="header-search"
                            role="button"
                            onClick={() => setBoardSearch(true)}
                        >
                            <svg className="header-search-icon" width="13" height="13" viewBox="0 0 14 14" fill="none">
                                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/>
                                <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                            <span className="header-search-text">Search boards and posts…</span>
                            <kbd className="header-search-kbd">⌘K</kbd>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
                                <path d="M7 1v1.2M7 11.8V13M1 7h1.2M11.8 7H13M2.9 2.9l.85.85M10.25 10.25l.85.85M2.9 11.1l.85-.85M10.25 3.75l.85-.85" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                        </button>
                        {isGuest ? (
                            <button className="btn-pill" onClick={() => navigate("/auth")}>Sign In</button>
                        ) : (
                            <>
                                <button className="btn-pill header-compose-btn hide-sm" onClick={() => setComposeOpen(true)}>
                                    + New Post
                                </button>
                                <div className="header-user-wrap">
                                    <button
                                        className="header-user-btn"
                                        onClick={() => setUserMenuOpen(v => !v)}
                                        title={`Profile · ${handle}`}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                                            <path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                        </svg>
                                        {handle}
                                    </button>
                                    {userMenuOpen && (
                                        <>
                                            <div className="user-dropdown-backdrop" onClick={() => setUserMenuOpen(false)} />
                                            <div className="user-dropdown">
                                                <button onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}>Profile</button>
                                                <button onClick={() => { navigate("/settings"); setUserMenuOpen(false); }}>Settings</button>
                                                <button onClick={() => { logout(); setUserMenuOpen(false); }}>Log out</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {boardSearch && (
                <BoardSearchModal
                    onClose={() => setBoardSearch(false)}
                    navigate={(path) => { navigate(path); setBoardSearch(false); }}
                />
            )}

            {settingsOpen && (
                <SettingsDrawer onClose={() => setSettingsOpen(false)} />
            )}

            {composeOpen && (
                <ComposeModal onClose={() => setComposeOpen(false)} />
            )}
        </>
    );
}
