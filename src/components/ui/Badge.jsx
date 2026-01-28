export default function Badge({ children, icon: Icon, className = "" }) {
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 ${className}`}>
            {Icon && <Icon className="w-4 h-4 text-indigo-300" />}
            {children}
        </span>
    );
}
