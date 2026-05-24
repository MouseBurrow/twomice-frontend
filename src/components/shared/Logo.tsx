import LogoSvg from "../../assets/logo.svg?react";

interface LogoProps {
    size?: number;
    className?: string;
}

// Renders src/assets/logo.svg inline as a React component.
// Edit that file to change colors or shapes — changes apply everywhere.
export default function Logo({ size = 32, className }: LogoProps) {
    return <LogoSvg width={size} height={size} className={className} />;
}
