import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import { autoResize } from "../utils/autoResize";
import type { BoardData, ModLogEntry, ReportData } from "../types";
import MiniBtn from "../components/shared/MiniBtn";
import "../assets/Admin.scss";

type Tab = "reports" | "log" | "boards";

export default function Admin() {
    const { auth } = useAuth();
    const { density } = useDensity();
    const navigate = useNavigate();

    const [tab, setTab] = useState<Tab>("reports");
    const [reports, setReports] = useState<ReportData[]>([]);
    const [modLog, setModLog] = useState<ModLogEntry[]>([]);
    const [boardList, setBoardList] = useState<BoardData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ name?: string; description?: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        api.account()
            .then(info => { if (!cancelled && !info.is_admin) navigate("/"); })
            .catch(() => { if (!cancelled) navigate("/"); });
        return () => { cancelled = true; };
    }, [navigate]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        if (tab === "reports") {
            api.getReports()
                .then(d => { if (!cancelled) { setReports(d); setLoading(false); } })
                .catch(() => { if (!cancelled) setLoading(false); });
        } else if (tab === "log") {
            api.getModLog()
                .then(d => { if (!cancelled) { setModLog(d); setLoading(false); } })
                .catch(() => { if (!cancelled) setLoading(false); });
        } else {
            api.getAllBoards()
                .then(d => { if (!cancelled) { setBoardList(d.filter(b => !b.deleted)); setLoading(false); } })
                .catch(() => { if (!cancelled) setLoading(false); });
        }
        return () => { cancelled = true; };
    }, [tab]);

    function resolve(id: string) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" as const } : r));
    }

    function dismiss(id: string) {
        setReports(prev => prev.filter(r => r.id !== id));
    }

    function startEdit(b: BoardData) {
        setEditingId(b.name);
        setEditForm({ name: b.name, description: b.description });
    }

    function saveEdit() {
        if (!editingId) return;
        api.updateBoard(editingId, editForm)
            .then(() => setBoardList(prev => prev.map(b => b.name === editingId ? { ...b, name: editForm.name ?? b.name, description: editForm.description ?? b.description } : b)))
            .catch(() => {})
            .finally(() => setEditingId(null));
    }

    const username = auth.status === "admin" ? auth.info.username : "";
    const pending = reports.filter(r => r.status === "pending");
    const resolved = reports.filter(r => r.status === "resolved");

    return (
        <div className="admin-page" data-density={density}>
            <div className="admin-hero">
                <div className="admin-hero-stripe" />
                <div className="admin-hero-body">
                    <div className="admin-hero-heading">
                        <span className="admin-hero-title">Mod Panel</span>
                        <span className="admin-hero-badge">ADMIN</span>
                    </div>
                    <div className="admin-hero-sub">
                        Signed in as <strong>{username}</strong>
                    </div>
                    <div className="admin-hero-stats">
                        <div className="admin-stat">
                            <div className="admin-stat-value">{pending.length}</div>
                            <div className="admin-stat-label">Pending</div>
                        </div>
                        <div className="admin-stat">
                            <div className="admin-stat-value">{resolved.length}</div>
                            <div className="admin-stat-label">Resolved</div>
                        </div>
                        <div className="admin-stat">
                            <div className="admin-stat-value">{boardList.length}</div>
                            <div className="admin-stat-label">Boards</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-tabs">
                <MiniBtn active={tab === "reports"} onClick={() => setTab("reports")}>Reports</MiniBtn>
                <MiniBtn active={tab === "log"} onClick={() => setTab("log")}>Mod Log</MiniBtn>
                <MiniBtn active={tab === "boards"} onClick={() => setTab("boards")}>Boards</MiniBtn>
            </div>

            {loading && <div className="admin-loading">Loading…</div>}

            {tab === "reports" && !loading && (
                <div className="admin-list">
                    {reports.length === 0 && <div className="admin-empty">No reports.</div>}
                    {reports.map(r => (
                        <div key={r.id} className={`admin-report-card${r.status === "resolved" ? " admin-report-card--resolved" : ""}`}>
                            <div className="admin-report-meta">
                                <span className="admin-report-board">b/{r.board_id}</span>
                                <span className={`admin-report-status admin-report-status--${r.status}`}>{r.status}</span>
                                <span className="admin-report-count">{r.count} report{r.count > 1 ? "s" : ""}</span>
                            </div>
                            <div className="admin-report-preview">"{r.preview}"</div>
                            <div className="admin-report-reason">Reason: {r.reason}</div>
                            {r.status === "pending" && (
                                <div className="admin-report-actions">
                                    <button className="btn-pill" style={{ fontSize: "0.75rem", padding: "0.3125rem 0.875rem", background: "#2ecc71" }} onClick={() => resolve(r.id)}>Resolve</button>
                                    <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3125rem 0.875rem" }} onClick={() => navigate(`/b/${r.board_id}/nib/${r.post_slug}`)}>View post</button>
                                    <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3125rem 0.875rem", color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => dismiss(r.id)}>Dismiss</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === "log" && !loading && (
                <div className="admin-log">
                    {modLog.length === 0 && <div className="admin-empty">No log entries.</div>}
                    {modLog.map((entry, i) => (
                        <div key={i} className="admin-log-entry">
                            <div className="admin-log-action">{entry.action}</div>
                            <div className="admin-log-board">on {entry.board}</div>
                            <div className="admin-log-reason">{entry.reason}</div>
                            <div className="admin-log-time">{entry.time}</div>
                        </div>
                    ))}
                </div>
            )}

            {tab === "boards" && !loading && (
                <div className="admin-list">
                    {boardList.length === 0 && <div className="admin-empty">No boards.</div>}
                    {boardList.map(b => (
                        <div key={b.name} className={`admin-board-card${editingId === b.name ? " admin-board-card--editing" : ""}`}>
                            {editingId === b.name ? (
                                <div className="admin-board-edit">
                                    <div className="admin-board-edit-grid">
                                        <div className="field">
                                            <label className="field-label">Display name</label>
                                            <input className="field-input" value={editForm.name ?? ""} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="field-label">Description</label>
                                        <textarea className="field-textarea" style={{ minHeight: "3.5rem" }} onInput={autoResize} value={editForm.description ?? ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>
                                    <div className="admin-board-edit-actions">
                                        <button className="btn-pill" style={{ fontSize: "0.75rem", padding: "0.3125rem 1rem" }} onClick={saveEdit}>Save changes</button>
                                        <button className="btn-ghost" style={{ fontSize: "0.75rem" }} onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="admin-board-info">
                                    <div className="admin-board-main">
                                        <div className="admin-board-name">b/{b.name}</div>
                                        <div className="admin-board-desc">{b.description}</div>
                                        <div className="admin-board-meta">{b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}</div>
                                    </div>
                                    <div className="admin-board-actions">
                                        <button className="btn-ghost" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.75rem" }} onClick={() => startEdit(b)}>Edit</button>
                                        <button className="btn-ghost" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.75rem" }} onClick={() => navigate(`/b/${b.name}`)}>View</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
