import { AnimatePresence, motion, useAnimationControls, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.ts";
import type { ApiError } from "../apiError.ts";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import "../assets/Auth.scss";

export default function Auth() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [peek, setPeek] = useState(false);
    const [confirmPeek, setConfirmPeek] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [direction, setDirection] = useState<1 | -1>(1);
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

    function switchMode(next: "login" | "signup") {
        setDirection(next === "signup" ? 1 : -1);
        setMode(next);
    }

    useEffect(() => {
        setError(undefined);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setPeek(false);
        setConfirmPeek(false);
    }, [mode]);

    const mascotShake = useAnimationControls();

    useEffect(() => {
        if (!error) return;
        mascotShake.start({
            x: [0, -6, 6, -4, 4, 0],
            transition: { duration: 0.4, ease: "easeOut" },
        });
    }, [error, mascotShake]);

    const mouseVariants: Variants = {
        idle: (custom: { right?: boolean }) => ({
            y: [3, -3],
            rotate: custom.right ? 40 : -40,
            transition: {
                y: { duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: custom.right ? 0.5 : 0 },
                rotate: { duration: 0.35 },
            },
        }),
    };

    const formVariants: Variants = {
        initial: (dir: number) => ({ x: 60 * dir, opacity: 0 }),
        animate: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: -60 * dir, opacity: 0 }),
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Left panel — brand + reasons + guest */}
                <div className="auth-panel-left">
                    <motion.div className="tm-mascot" animate={mascotShake}>
                        <motion.span
                            className="tm-mouse"
                            variants={mouseVariants}
                            custom={{ right: false }}
                            animate="idle"
                        >
                            🐭
                        </motion.span>
                        <motion.span
                            className="tm-mouse"
                            variants={mouseVariants}
                            custom={{ right: true }}
                            animate="idle"
                        >
                            🐭
                        </motion.span>
                    </motion.div>

                    <h1 className="tm-brand">TwoMice</h1>

                    <div className="tm-divider" />

                    <ul className="tm-reasons">
                        <li>Post nibs &amp; start conversations</li>
                        <li>Squeak on anything that moves you</li>
                        <li>Build your burrow over time</li>
                    </ul>

                    <div className="tm-divider" />

                    <button type="button" className="tm-guest" onClick={() => nav("/")}>
                        Not ready? Browse as guest →
                    </button>
                </div>

                {/* Right panel — form */}
                <div className="auth-panel-right">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={mode}
                            className="tm-form-wrap"
                            custom={direction}
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <h2 className="tm-form-heading">
                                {mode === "login" ? "Welcome back" : "Join the mischief"}
                            </h2>

                            <div className="tm-form">
                                <input
                                    placeholder="Mouse name"
                                    autoFocus
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                />

                                <div className="tm-password">
                                    <input
                                        type={peek ? "text" : "password"}
                                        placeholder="Secret stash"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    />
                                    <button
                                        type="button"
                                        className="tm-peek"
                                        onClick={() => { setPeek(p => !p); setLookingAway(false); }}
                                        aria-label={peek ? "Hide password" : "Show password"}
                                    >
                                        {peek ? "👀" : "🙈"}
                                    </button>
                                </div>

                                {mode === "signup" && (
                                    <div className="tm-password">
                                        <input
                                            type={confirmPeek ? "text" : "password"}
                                            placeholder="Confirm secret stash"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                        />
                                        <button
                                            type="button"
                                            className="tm-peek"
                                            onClick={() => setConfirmPeek(p => !p)}
                                            aria-label={confirmPeek ? "Hide password" : "Show password"}
                                        >
                                            {confirmPeek ? "👀" : "🙈"}
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="tm-submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    <span className="tm-submit-text">
                                        {mode === "login" ? "Scurry In →" : "Build your burrow →"}
                                    </span>
                                    {loading && <span className="tm-spinner" aria-hidden />}
                                </button>

                                <ErrorMessage error={error} />
                            </div>

                            <div className="tm-footer">
                                {mode === "login" ? (
                                    <>
                                        New mouse?{" "}
                                        <button type="button" onClick={() => switchMode("signup")}>
                                            Build a burrow →
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already in the mischief?{" "}
                                        <button type="button" onClick={() => switchMode("login")}>
                                            Scurry in →
                                        </button>
                                    </>
                                )}
                            </div>

                            <button type="button" className="tm-guest tm-guest-mobile" onClick={() => nav("/")}>
                                Not ready? Browse as guest →
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
