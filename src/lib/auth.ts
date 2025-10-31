export type Tokens = { access: string | null; refresh: string | null };

const A = "auth.access";
const R = "auth.refresh";
const U = "auth.user";

export function setTokens({ access, refresh }: { access: string; refresh: string }) {
  localStorage.setItem(A, access);
  localStorage.setItem(R, refresh);
}

export function getTokens(): Tokens {
  return { access: localStorage.getItem(A), refresh: localStorage.getItem(R) };
}

export function clearTokens() {
  localStorage.removeItem(A);
  localStorage.removeItem(R);
  localStorage.removeItem(U);
}

export function setUser(u: any) {
  localStorage.setItem(U, JSON.stringify(u));
}

export function getUser<T=any>(): T | null {
  const raw = localStorage.getItem(U);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}
