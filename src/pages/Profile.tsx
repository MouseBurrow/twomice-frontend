import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/Profile.scss";

type Tab = "nibs" | "squeaks" | "saved";

export default function Profile() {
    const { auth } = useAuth();
    const [tab, setTab] = useState<Tab>("nibs");

    const handle = localStorage.getItem("twomice_handle") ??
        (auth.status === "user" || auth.status === "admin"
            ? `anon_${auth.info.username.slice(-4)}`
            : "guest");

    if (auth.status === "guest") {
        return (
            <div className="profile-page">
                <div className="profile-board">
                    <div className="profile-guest">
                        <p>Sign in to view your profile.</p>
                        <Link to="/auth">Sign in</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (auth.status === "unknown") return null;

    const since = auth.status === "user" || auth.status === "admin"
        ? new Date(auth.info.created_at).toLocaleDateString()
        : "";

    return (
        <div className="profile-page">
            <div className="profile-board">
                <div className="profile-header">
                    <div className="profile-avatar-lg"/>
                    <div>
                        <p className="profile-handle">{handle}</p>
                        <span className="profile-since">member since {since}</span>
                    </div>
                </div>

                <div className="profile-tabs">
                    {(["nibs", "squeaks", "saved"] as Tab[]).map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`profile-tab${tab === t ? " active" : ""}`}
                            onClick={() => setTab(t)}
                            aria-pressed={tab === t}
                        >
                            {t === "nibs" ? "My Nibs" : t === "squeaks" ? "My Squeaks" : "Saved"}
                        </button>
                    ))}
                </div>

                <div className="profile-empty">
                    {tab === "nibs" && "Your nibs will appear here. (Requires backend support)"}
                    {tab === "squeaks" && "Your squeaks will appear here. (Requires backend support)"}
                    {tab === "saved" && "Saved items stored in localStorage will appear here."}
                </div>
            </div>
        </div>
    );
}
