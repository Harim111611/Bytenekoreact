import { api } from "./api";

export async function checkHealth(): Promise<boolean> {
  const path = (import.meta.env.VITE_HEALTH_ENDPOINT || "/health/");
  try {
    const r = await api.get(path, { timeout: 4000 });
    // aceptar 2xx como OK
    return r.status >= 200 && r.status < 300;
  } catch {
    return false;
  }
}
