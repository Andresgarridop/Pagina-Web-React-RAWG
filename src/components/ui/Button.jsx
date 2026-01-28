import { Link } from "react-router-dom";

export default function Button({
    children,
    variant = "secondary",
    to,
    href,
    onClick,
    disabled,
    className = "",
    ...props
}) {
    const baseStyles = "inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition";

    const variantStyles = {
        primary: "bg-indigo-500 hover:bg-indigo-400 text-slate-950",
        secondary: "border border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-100",
    };

    const disabledStyles = disabled ? "opacity-40 pointer-events-none" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`;

    // External link
    if (href) {
        return (
            <a
                href={href}
                className={combinedClassName}
                {...props}
            >
                {children}
            </a>
        );
    }

    // Internal link
    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    // Button
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
}
