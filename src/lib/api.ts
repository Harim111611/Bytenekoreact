// src/lib/api.ts
export type Tokens = { access: string; refresh: string };

const API_URL = import.meta.env.VITE_API_URL;

// ===== Tipos opcionales para requests =====
type ApiRequestOpts = {
  timeout?: number;        // ms para abortar la request
  init?: RequestInit;      // por si quieres pasar headers extra, etc.
};

// ---------- Storage helpers ----------
export function setTokens(t: Tokens | null) {
  if (!t) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return;
  }
  localStorage.setItem("access", t.access);
  localStorage.setItem("refresh", t.refresh);
}

export function getTokens(): Tokens | null {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  if (!access || !refresh) return null;
  return { access, refresh };
}

// Alias de compatibilidad con código legado:
export function getToken(): string | null {
  return getTokens()?.access ?? null;
}
export function clearToken(): void {
  setTokens(null);
  localStorage.removeItem("authUser");
}

// ---------- Core fetch with auto-refresh ----------
async function refreshToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;

  const r = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });

  if (!r.ok) {
    setTokens(null);
    return null;
  }

  const data = (await r.json()) as { access: string };
  const newTokens = { access: data.access, refresh: tokens.refresh };
  setTokens(newTokens);
  return newTokens.access;
}

async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const tokens = getTokens();
  const headers = new Headers(init.headers || {});

  if (tokens?.access) {
    headers.set("Authorization", `Bearer ${tokens.access}`);
  }

  let res = await fetch(input, { ...init, headers });

  // Si el access expiró, intenta refresh y reintenta una vez
  if (res.status === 401) {
    const newAccess = await refreshToken();
    if (newAccess) {
      headers.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(input, { ...init, headers });
    }
  }

  return res;
}

// Helper para timeout
async function withTimeout<T>(fn: (signal?: AbortSignal) => Promise<T>, ms?: number): Promise<T> {
  if (!ms) return fn(undefined);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), ms);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Public API ----------
export const api = {
  async login(username: string, password: string) {
    const r = await fetch(`${API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!r.ok) {
      let msg = "Credenciales inválidas";
      try {
        const j = await r.json();
        msg = (j as any)?.detail || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = (await r.json()) as Tokens; // { access, refresh }
    setTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  async me<T = unknown>() {
    const r = await authFetch(`${API_URL}/api/auth/me/`);
    if (!r.ok) throw new Error("No autorizado");
    return (await r.json()) as T;
  },

  // Devuelve objeto tipo Axios: { data, status, ok }
  async get<T = unknown>(url: string, opts: ApiRequestOpts = {}) {
    const { timeout, init } = opts;
    const fullUrl = `${API_URL}${url}`;
    const r = await withTimeout(
      (signal) => authFetch(fullUrl, { ...(init || {}), signal }),
      timeout
    );
    if (!r.ok) throw new Error(`GET ${url} ${r.status}`);
    const data = (await r.json()) as T;
    return { data, status: r.status, ok: r.ok };
  },

  async post<T = unknown>(url: string, body: unknown, opts: ApiRequestOpts = {}) {
    const { timeout, init } = opts;
    const fullUrl = `${API_URL}${url}`;
    const r = await withTimeout(
      (signal) =>
        authFetch(fullUrl, {
      ...(init || {}),
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: JSON.stringify(body),
      signal,
    }),
      timeout
    );
    if (!r.ok) throw new Error(`POST ${url} ${r.status}`);
    const data = (await r.json()) as T;
    return { data, status: r.status, ok: r.ok };
  },

  logout() {
    setTokens(null);
    localStorage.removeItem("authUser");
  },
     async upload<T = unknown>(url: string, formData: FormData) {
    const r = await authFetch(`${API_URL}${url}`, {
      method: "POST",
      body: formData,
    });
    if (!r.ok) throw new Error(`UPLOAD ${url} ${r.status}`);
    const data = (await r.json()) as T;
    return { data, status: r.status, ok: r.ok };
  },
};
