import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PageSpinner from "../shared/PageSpinner";

interface Props {
    children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
    const { auth } = useAuth();

    if (auth.status === "unknown") return <PageSpinner />;
    if (auth.status !== "admin") return <Navigate to="/" replace />;
    return <>{children}</>;
}
