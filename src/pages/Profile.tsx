import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/Profile.scss";

type Tab = "nibs" | "squeaks" | "saved";

const TAB_LABELS: Record<Tab, string> = {
    nibs: "My Nibs",
    squeaks: "My Squeaks",
    saved: "Saved",
};

const TAB_EMPTY: Record<Tab, string> = {
    nibs: "Your nibs will appear here. (Requires backend support)",
    squeaks: "Your squeaks will appear here. (Requires backend support)",
    saved: "Saved items stored in localStorage will appear here.",
};

export default function Profile() {
    const { auth } = useAuth();
    const [tab, setTab] = useState<Tab>("nibs");

    if (auth.status === "unknown") return null;

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

    // auth is narrowed to user | admin here
    const handle = localStorage.getItem("twomice_handle") ??
        `anon_${auth.info.username.slice(-4)}`;
    const since = new Date(auth.info.created_at).toLocaleDateString();

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
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>

                <div className="profile-empty">
                    {TAB_EMPTY[tab]}
                </div>
            </div>
        </div>
    );
}
