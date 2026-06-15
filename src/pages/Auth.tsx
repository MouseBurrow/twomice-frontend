import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../icons/Logo";
import MouseIcon from "../icons/MouseIcon";
import "./auth.scss";

type Tab = "signin" | "register";
type View = "main" | "forgot" | "si-success" | "rg-success" | "guest-success" | "fg-success";

export default function Auth() {
    const [tab, setTab] = useState<Tab>("signin");
    const [view, setView] = useState<View>("main");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [backupCode, setBackupCode] = useState("");
    const [peek, setPeek] = useState(false);
    const [confirmPeek, setConfirmPeek] = useState(false);
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();
    const { auth, refresh } = useAuth();

    useEffect(() => {
        if (auth.status === "user" || auth.status === "admin") {
            nav("/");
        }
    }, [auth, nav]);

    function switchTab(t: Tab) {
        setTab(t);
        setError(undefined);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setPeek(false);
        setConfirmPeek(false);
    }

    function showView(v: View) {
        setView(v);
        setError(undefined);
    }

    function togglePw(field: "password" | "confirm") {
        if (field === "password") setPeek(p => !p);
        else setConfirmPeek(p => !p);
    }

    async function submitMain() {
        if (tab === "register" && password !== confirmPassword) {
            setError({ message: "Passwords don't match" } as ApiError);
            return;
        }

        try {
            setError(undefined);
            setLoading(true);

            if (tab === "signin") {
                await api.login({ username, password });
            } else {
                await api.signup({ username, password });
            }

            await refresh();

            const successView = tab === "signin" ? "si-success" : "rg-success";
            setView(successView);
            setTimeout(() => nav("/"), 1500);
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    function submitGuest() {
        setView("guest-success");
        setTimeout(() => nav("/"), 1500);
    }

    async function submitForgot() {
        try {
            setError(undefined);
            setLoading(true);
            await api.forgotPassword({ username, backupCode });
            setView("fg-success");
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent, action: () => void) {
        if (e.key === "Enter") action();
    }

    const isSignin = tab === "signin";
    const isRegister = tab === "register";

    return (
        <div className="auth-page">
            <div className="stage">
                <div className="auth-card">
                    <div className="badge">
                        <Logo size={46} />
                    </div>

                    {/* ── MAIN VIEW ── */}
                    {view === "main" && (
                        <div className="view-auth">
                            <div className="head">
                                <div className="wordmark">Two<b>Mice</b></div>
                                <div className="title">
                                    {isSignin ? "Welcome back" : "Create your account"}
                                </div>
                                <div className="subtitle">
                                    {isSignin
                                        ? "Sign in to pick up where you left off."
                                        : "It takes about a minute — no real name required."}
                                </div>
                            </div>

                            <div className="tabs">
                                <button
                                    className={`tab${isSignin ? " active" : ""}`}
                                    onClick={() => switchTab("signin")}
                                >
                                    Sign in
                                </button>
                                <button
                                    className={`tab${isRegister ? " active" : ""}`}
                                    onClick={() => switchTab("register")}
                                >
                                    Create account
                                </button>
                            </div>

                            {/* sign-in fields */}
                            {isSignin && (
                                <div id="fields-signin">
                                    <div className="group">
                                        <span className="label">Handle</span>
                                        <div className="input-wrap">
                                            <input
                                                className="input"
                                                type="text"
                                                placeholder="your handle"
                                                autoFocus
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, submitMain)}
                                                autoComplete="username"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <span className="label">Password</span>
                                        <div className="input-wrap">
                                            <input
                                                className="input has-btn"
                                                type={peek ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, submitMain)}
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className={`pw-toggle${peek ? " on" : ""}`}
                                                onClick={() => togglePw("password")}
                                                aria-label={peek ? "Hide password" : "Show password"}
                                            >
                                                {peek ? "👀" : "🙈"}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="forgot"
                                        onClick={() => showView("forgot")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* register fields */}
                            {isRegister && (
                                <div id="fields-register">
                                    <div className="privacy">
                                        <span className="pm"><MouseIcon color="pink" size={32} /></span>
                                        <p>Your handle is private — pick anything. No personal information required.</p>
                                    </div>
                                    <div className="group">
                                        <span className="label">Handle <span className="note">private</span></span>
                                        <div className="input-wrap">
                                            <input
                                                className="input"
                                                type="text"
                                                placeholder="quiet_mouse"
                                                autoFocus
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, submitMain)}
                                                autoComplete="username"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <span className="label">Password</span>
                                        <div className="input-wrap">
                                            <input
                                                className="input has-btn"
                                                type={peek ? "text" : "password"}
                                                placeholder="at least 8 characters"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, submitMain)}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className={`pw-toggle${peek ? " on" : ""}`}
                                                onClick={() => togglePw("password")}
                                                aria-label={peek ? "Hide password" : "Show password"}
                                            >
                                                {peek ? "👀" : "🙈"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <span className="label">Confirm password</span>
                                        <div className="input-wrap">
                                            <input
                                                className="input has-btn"
                                                type={confirmPeek ? "text" : "password"}
                                                placeholder="repeat password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, submitMain)}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className={`pw-toggle${confirmPeek ? " on" : ""}`}
                                                onClick={() => togglePw("confirm")}
                                                aria-label={confirmPeek ? "Hide password" : "Show password"}
                                            >
                                                {confirmPeek ? "👀" : "🙈"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={submitMain}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner" />
                                ) : null}
                                <span>{isSignin ? "Sign in" : "Create account"}</span>
                            </button>

                            <ErrorMessage error={error} />

                            <div className="divider">or</div>

                            <button
                                type="button"
                                className="btn btn-guest"
                                onClick={submitGuest}
                            >
                                <MouseIcon color="pink" size={24} />
                                <span>Continue as guest</span>
                            </button>
                            <div className="guest-note">
                                Browse anonymously — no account needed.
                            </div>

                            <div className="foot">
                                {isSignin ? (
                                    <>
                                        New to TwoMice?{" "}
                                        <button type="button" onClick={() => switchTab("register")}>
                                            Create an account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button type="button" onClick={() => switchTab("signin")}>
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── FORGOT VIEW ── */}
                    {view === "forgot" && (
                        <div className="view-auth">
                            <button type="button" className="back" onClick={() => showView("main")}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>
                            <div className="head head-left">
                                <div className="title">Reset your password</div>
                                <div className="subtitle">
                                    Enter your username and backup code to reset your password.
                                </div>
                            </div>
                            <div className="group group-first">
                                <span className="label">Username</span>
                                <div className="input-wrap">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="your username"
                                        autoFocus
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        onKeyDown={e => handleKeyDown(e, submitForgot)}
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <span className="label">Backup code</span>
                                <div className="input-wrap">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="0000-0000-0000-0000"
                                        value={backupCode}
                                        onChange={e => setBackupCode(e.target.value)}
                                        onKeyDown={e => handleKeyDown(e, submitForgot)}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={submitForgot}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner" />
                                ) : null}
                                <span>Reset password</span>
                            </button>

                            <ErrorMessage error={error} />
                        </div>
                    )}

                    {/* ── SUCCESS VIEWS ── */}
                    {view === "si-success" && (
                        <div className="view-auth">
                            <div className="success">
                                <MouseIcon color="green" size={64} />
                                <div className="success-title">You're in</div>
                                <div className="success-text">
                                    Welcome back. Taking you to your boards&hellip;
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "rg-success" && (
                        <div className="view-auth">
                            <div className="success">
                                <Logo size={64} />
                                <div className="success-title">Account created</div>
                                <div className="success-text">
                                    Your anonymous identity is ready. Two mice are better than one.
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "guest-success" && (
                        <div className="view-auth">
                            <div className="success">
                                <MouseIcon color="pink" size={64} />
                                <div className="success-title">Exploring as a guest</div>
                                <div className="success-text">
                                    Browsing anonymously. Create an account anytime to save your boards.
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "fg-success" && (
                        <div className="view-auth">
                            <button type="button" className="back" onClick={() => showView("main")}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>
                            <div className="success">
                                <MouseIcon color="green" size={64} />
                                <div className="success-title">Reset link sent</div>
                                <div className="success-text">
                                    If that account exists and the backup code is correct, a reset link has been sent.
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
