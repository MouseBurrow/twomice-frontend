import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { ApiError } from "../apiError";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../contexts/AuthContext";
import { useDensity } from "../contexts/DensityContext";
import RightArrow from "../icons/RightArrow";
import "./auth.scss";

export default function Auth() {
    const { density } = useDensity();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [peek, setPeek] = useState(false);
    const [confirmPeek, setConfirmPeek] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<ApiError>();
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();
    const { auth, refresh } = useAuth();

    async function handleSubmit() {
        if (mode === "signup" && password !== confirmPassword) {
            setError({ message: "Passwords don't match" } as ApiError);
            return;
        }

        try {
            setError(undefined);
            setLoading(true);

            if (mode === "login") {
                await api.login({ username, password });
            } else {
                await api.signup({ username, password });
            }

            await refresh();
            nav("/");
        } catch (e) {
            setError(e as ApiError);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (auth.status === "user" || auth.status === "admin") {
            nav("/");
        }
    }, [auth, nav]);

    useEffect(() => {
        setError(undefined);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setPeek(false);
        setConfirmPeek(false);
    }, [mode]);

    return (
        <div className="auth-page" data-density={density}>
            <div className="auth-card">
                <div className="auth-panel-left">
                    <div className="auth-brand">
                        <span className="auth-mouse">🐭🐭</span>
                        <h1 className="auth-title">TwoMice</h1>
                        <div className="auth-divider" />
                        <p className="auth-tagline">Anonymous conversations.<br />No account needed to lurk.</p>
                    </div>
                </div>

                <div className="auth-panel-right">
                    <div className="auth-form-wrap">
                        <h2 className="auth-form-heading">
                            {mode === "login" ? "Welcome back" : "Join the mischief"}
                        </h2>

                        <div className="auth-form">
                            <input
                                placeholder="Username"
                                autoFocus
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            />

                            <div className="auth-password">
                                <input
                                    type={peek ? "text" : "password"}
                                    placeholder={mode === "signup" ? "Password" : "Password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                />
                                <button
                                    type="button"
                                    className="auth-peek"
                                    onClick={() => setPeek(p => !p)}
                                    aria-label={peek ? "Hide password" : "Show password"}
                                >
                                    {peek ? "👀" : "🙈"}
                                </button>
                            </div>

                            {mode === "signup" && (
                                <div className="auth-password">
                                    <input
                                        type={confirmPeek ? "text" : "password"}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    />
                                    <button
                                        type="button"
                                        className="auth-peek"
                                        onClick={() => setConfirmPeek(p => !p)}
                                        aria-label={confirmPeek ? "Hide password" : "Show password"}
                                    >
                                        {confirmPeek ? "👀" : "🙈"}
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                className="auth-submit"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="btn-loading"><span className="spin-dot" />{mode === "login" ? "Signing in…" : "Creating…"}</span>
                                ) : (
                                    mode === "login" ? "Sign In" : "Create Account"
                                )}
                            </button>

                            <ErrorMessage error={error} />
                        </div>

                        <div className="auth-footer">
                            <div className="auth-footer-row">
                                {mode === "login" ? (
                                    <>
                                        <span>New here?</span>
                                        <button type="button" onClick={() => setMode("signup")}>
                                            Create an account <RightArrow />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>Already have an account?</span>
                                        <button type="button" onClick={() => setMode("login")}>
                                            Sign in <RightArrow />
                                        </button>
                                    </>
                                )}
                            </div>
                            <button type="button" className="auth-guest" onClick={() => nav("/")}>
                                No thanks, just browsing <RightArrow />
                            </button>
                        </div>

                        <button type="button" className="auth-guest-mobile" onClick={() => nav("/")}>
                            No thanks, just browsing <RightArrow />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
