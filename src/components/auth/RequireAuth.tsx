import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, getTokens, setTokens } from "@/lib/api";

type Props = { children: ReactNode };

export default function RequireAuth({ children }: Props) {
  const nav = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    let alive = true;

    async function check() {
      const tokens = getTokens();
      const rawUser = localStorage.getItem("authUser");

      // Sin tokens o sin cache de usuario -> login
      if (!tokens || !rawUser) {
        if (alive) setStatus("fail");
        return;
      }

      try {
        // Valida sesión (esto hace refresh si el access expiró)
        await api.me();
        if (!alive) return;
        setStatus("ok");
      } catch {
        if (!alive) return;
        // Limpia sesión y redirige
        setTokens(null);
        localStorage.removeItem("authUser");
        setStatus("fail");
      }
    }

    check();
    return () => { alive = false; };
  }, []);

  if (status === "checking") {
    // Mantengo tu UI libre de cambios de estilo. Pon aquí un loader si deseas.
    return null;
  }

  if (status === "fail") {
    // preserva la ruta origen para volver después de login
    nav("/login", { replace: true, state: { from: location } });
    return null;
  }

  return <>{children}</>;
}
