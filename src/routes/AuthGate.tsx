import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { clearTokens, getTokens, setUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function AuthGate(props: { children: React.ReactNode }) {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function boot() {
      const { access } = getTokens();
      if (!access) {
        nav("/login");
        return;
      }
      try {
        const meUrl = (import.meta.env.VITE_AUTH_USER_ENDPOINT || "/auth/me/");
        const me = await api.get(meUrl);
        setUser(me.data);
        setReady(true);
      } catch (e: any) {
        clearTokens();
        setError("Sesión inválida o backend no disponible.");
        nav("/login");
      }
    }
    boot();
  }, [nav]);

  if (!ready) {
    return (
      <div className="p-6 text-center">
        <p className="animate-pulse">Verificando sesión…</p>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }
  return <>{props.children}</>;
}
