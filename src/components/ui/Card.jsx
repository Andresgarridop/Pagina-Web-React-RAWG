export default function Card({ children, className = "" }) {
    return (
        <div className={`rounded-3xl border border-slate-800 bg-slate-900/30 p-8 ${className}`}>
            {children}
        </div>
    );
}
