import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../shared/Logo";
import "./NavBar.scss";

export default function NavBar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handle = localStorage.getItem("twomice_handle") ??
        (auth.status === "user" || auth.status === "admin"
            ? `anon_${auth.info.username.slice(-4)}`
            : "guest");

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`);
    }

    return (
        <nav className="navbar">
            <div className="navbar-primary">
                <Link to="/" className="navbar-brand">
                    <Logo size={38} />
                    TwoMice
                </Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="search nibs, boards…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search"
                    />
                </form>

                <div className="navbar-right">
                    {auth.status === "guest" && (
                        <button className="navbar-signin" onClick={() => navigate("/auth")}>
                            Sign in
                        </button>
                    )}

                    {(auth.status === "user" || auth.status === "admin") && (
                        <>
                            <button
                                className="navbar-compose"
                                onClick={() => navigate("/b/random/new")}
                            >
                                + New Nib
                            </button>
                            <div className="navbar-user-pill">
                                <div className="navbar-avatar" aria-hidden="true" />
                                <span className="navbar-handle">{handle}</span>
                                <span className="navbar-chevron" aria-hidden="true">▾</span>
                                <div className="navbar-dropdown">
                                    <Link to="/profile">Profile</Link>
                                    <Link to="/settings">Settings</Link>
                                    <button onClick={() => logout()}>Log out</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
