import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-400">Página no encontrada.</p>
      <Link to="/" className="inline-block mt-6 text-indigo-300 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
