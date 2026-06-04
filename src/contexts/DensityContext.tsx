import { createContext, useContext, useState, type ReactNode } from "react";

export type Density = "compact" | "comfortable" | "spacious";

type DensityContextValue = {
    density: Density;
    setDensity: (d: Density) => void;
};

const DensityContext = createContext<DensityContextValue | null>(null);

export function DensityProvider({ children }: { children: ReactNode }) {
    const [density, setDensityState] = useState<Density>(
        () => (localStorage.getItem("twomice_density") as Density) ?? "comfortable"
    );

    function setDensity(d: Density) {
        setDensityState(d);
        localStorage.setItem("twomice_density", d);
    }

    return (
        <DensityContext.Provider value={{ density, setDensity }}>
            {children}
        </DensityContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDensity() {
    const ctx = useContext(DensityContext);
    if (!ctx) throw new Error("useDensity must be used inside DensityProvider");
    return ctx;
}


