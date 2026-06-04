import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { ToastProvider } from "./contexts/ToastContext.tsx";
import { DensityProvider } from "./contexts/DensityContext.tsx";

// Apply saved font on first paint (before React hydrates)
const savedFont = localStorage.getItem("twomice_font") ?? "Inter";
const fontValue = `'${savedFont}', sans-serif`;
document.body.style.fontFamily = fontValue;
document.documentElement.style.setProperty("--font-body", fontValue);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ToastProvider>
            <AuthProvider>
                <ThemeProvider>
                    <DensityProvider>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </DensityProvider>
                </ThemeProvider>
            </AuthProvider>
        </ToastProvider>
    </React.StrictMode>
);
