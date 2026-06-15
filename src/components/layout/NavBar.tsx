import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDensity } from "../../contexts/DensityContext";
import Search from "../../icons/Search";
import Settings from "../../icons/Settings";
import User from "../../icons/User";
import BoardSearchModal from "./BoardSearchModal";
import ComposeModal from "./ComposeModal";
import Logo from "../../icons/Logo";
import SettingsDrawer from "./SettingsDrawer";
import "./NavBar.scss";

export default function NavBar() {
    const { auth, logout, isGuest } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { density } = useDensity();
    const [boardSearch, setBoardSearch] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    const isAdmin = auth.status === "admin";
    const username = auth.status === "user" || auth.status === "admin"
        ? auth.info.username
        : "guest";

    return (
        <>
            <header className="site-header">
                <div className="site-header-stripe" />
                <div className="header-inner" data-density={density}>
                    <Link className="header-logo" to="/">
                        <Logo size={density === "compact" ? 28 : 34} />
                        TwoMice
                    </Link>

                    <div className="header-search-wrap">
                        <div
                            className="header-search"
                            role="button"
                            onClick={() => setBoardSearch(true)}
                        >
                            <Search className="header-search-icon" />
                            <span className="header-search-text">Sniff around the burrow…</span>
                            <kbd className="header-search-kbd">⌘K</kbd>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
                            <Settings />
                        </button>
                        {isAdmin && (
                            <button className={`icon-btn${location.pathname === "/admin" ? " icon-btn--active" : ""}`} title="Mod Panel" onClick={() => navigate("/admin")}>
                                ⚑
                            </button>
                        )}
                        {isGuest ? (
                            <button className="btn-pill" onClick={() => navigate("/auth")}>Enter the Burrow</button>
                        ) : (
                            <>
                                <button className="btn-pill header-compose-btn hide-sm" onClick={() => setComposeOpen(true)}>
                                    + New Squeak
                                </button>
                                <div className="header-user-wrap">
                                    <button
                                        className="header-user-btn"
                                        onClick={() => setUserMenuOpen(v => !v)}
                                        title={`Profile · ${username}`}
                                    >
                                        <User />
                                        {username}
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
