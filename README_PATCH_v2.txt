PATCH v2: Evitar login cuando el backend no está disponible + rutas protegidas

NOVEDADES
- `src/lib/health.ts`: chequeo de salud a `VITE_HEALTH_ENDPOINT` (por defecto `/health/`).
- `src/components/LoginPage.tsx`: bloquea el submit si el backend no responde y muestra estado.
- `src/routes/AuthGate.tsx`: wrapper para proteger rutas. Verifica `/auth/me/` al montar.
- `src/lib/api.ts`: assert de `VITE_API_BASE_URL` + timeout.
- `.env.*`: añade `VITE_HEALTH_ENDPOINT`.

CÓMO USAR AUTHGATE (React Router)
Ejemplo en tu archivo de rutas (App.tsx o similar):
--------------------------------------------------
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGate from "@/routes/AuthGate";
import LoginPage from "@/components/LoginPage";
import Home from "@/components/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGate>
              <Home />
            </AuthGate>
          }
        />
        {/* otras rutas protegidas igual */}
      </Routes>
    </BrowserRouter>
  );
}
--------------------------------------------------

CHECKLIST RÁPIDO (si “inicia” sin backend):
1) Limpia almacenamiento local:
   - Abre la app en el navegador > DevTools > Application > Local Storage > borra claves: `auth.access`, `auth.refresh`, `auth.user`.
2) Verifica variables en `.env.development`:
   - `VITE_API_BASE_URL` apunta a tu backend (ej. http://127.0.0.1:8000/api).
   - El backend realmente corre ahí (prueba en navegador GET a /api/health/).
3) Habilita CORS en el backend para `http://localhost:5173` y `http://127.0.0.1:5173`.
4) Reinicia Vite: `npm run dev` (Vite solo carga `.env.*` en el arranque).
5) Observa la pestaña Network: la llamada a `/auth/token/` debe salir a `VITE_API_BASE_URL + endpoint`.
6) Asegura que existe un endpoint público de salud `/health/` que devuelva 200.

NOTA: Si no tienes `/health/`, crea uno simple en el backend y ajusta `VITE_HEALTH_ENDPOINT`.
