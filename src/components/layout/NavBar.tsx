import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./NavBar.scss";

function parseBreadcrumb(pathname: string): { board?: string; isNib?: boolean } {
    const m = pathname.match(/^\/b\/([^/]+)(\/nib\/)?/);
    if (!m) return {};
    return { board: m[1], isNib: Boolean(m[2]) };
}

export default function NavBar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");

    const { board, isNib } = parseBreadcrumb(location.pathname);
    const handle = localStorage.getItem("twomice_handle") ??
        (auth.status === "user" || auth.status === "admin"
            ? `anon_${auth.info.username.slice(-4)}`
            : "guest");

    const pinnedBoards: string[] =
        JSON.parse(localStorage.getItem("twomice_pinned") ?? "[]");

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`);
    }

    return (
        <nav className="navbar">
            <div className="navbar-primary">
                <Link to="/" className="navbar-brand">🐭 TwoMice</Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="search nibs, boards, squeaks…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search"
                    />
                </form>

                <div className="navbar-right">
                    <button className="navbar-bell" aria-label="Notifications">🔔</button>

                    {auth.status === "guest" && (
                        <button className="navbar-signin" onClick={() => navigate("/auth")}>
                            Sign in
                        </button>
                    )}

                    {(auth.status === "user" || auth.status === "admin") && (
                        <div className="navbar-user-pill">
                            <div className="navbar-avatar"/>
                            <span className="navbar-handle">{handle}</span>
                            <span className="navbar-chevron">▾</span>
                            <div className="navbar-dropdown">
                                <Link to="/profile">Profile</Link>
                                <Link to="/settings">Settings</Link>
                                <button onClick={() => logout()}>Log out</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="navbar-secondary">
                <div className="navbar-breadcrumb">
                    <Link to="/">home</Link>
                    {board && (
                        <>
                            <span className="navbar-sep">/</span>
                            <Link to={`/b/${board}`} className="navbar-crumb-board">b/{board}</Link>
                        </>
                    )}
                    {isNib && (
                        <>
                            <span className="navbar-sep">/</span>
                            <span className="navbar-crumb-nib">nib</span>
                        </>
                    )}
                </div>

                {pinnedBoards.length > 0 && (
                    <div className="navbar-pinned">
                        {pinnedBoards.map(b => (
                            <Link
                                key={b}
                                to={`/b/${b}`}
                                className={`navbar-pin-chip${board === b ? " active" : ""}`}
                            >
                                b/{b}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
