PATCH: Conectar Frontend (Vite React) con Backend (Django/FastAPI)

Archivos incluidos en este parche:
- .env.development            -> URL local del backend (http://127.0.0.1:8000/api)
- .env.production             -> URL de producción (https://pes.tmsa.mx/api) (ajústala si es necesario)
- src/lib/api.ts              -> Cliente Axios con baseURL, tokens e interceptores (refresh automático)
- src/lib/auth.ts             -> Utilidades para almacenar tokens/usuario en localStorage
- src/components/LoginPage.tsx-> Página de login usando el cliente `api` y endpoints configurables

Cómo aplicar:
1) Copia el contenido de esta carpeta dentro de la raíz de tu proyecto (Bytenekoreact).
   - Si te pregunta sobre reemplazar archivos, acepta (o respalda los tuyos primero).
2) Verifica/ajusta las variables en:
   - .env.development  (desarrollo local)
   - .env.production   (producción)
   Variables:
     VITE_API_BASE_URL           -> Prefijo de la API (termina en /api si tu backend lo expone así)
     VITE_AUTH_TOKEN_ENDPOINT    -> Endpoint para obtener tokens (por defecto /auth/token/)
     VITE_AUTH_REFRESH_ENDPOINT  -> Endpoint para refrescar tokens (por defecto /auth/token/refresh/)
     VITE_AUTH_USER_ENDPOINT     -> Endpoint para datos del usuario autenticado (por defecto /auth/me/)

3) Reinicia el servidor de desarrollo para que Vite tome las variables (.env.*).
   npm run dev

4) Backend (Django Rest con JWT) – Asegúrate de tener CORS correcto (ejemplo):
   INSTALLED_APPS += ["corsheaders"]
   MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", *MIDDLEWARE]
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
   ]
   CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

   # SimpleJWT endpoints típicos:
   /api/auth/token/
   /api/auth/token/refresh/
   /api/auth/me/  (crea una vista protegida para devolver datos del usuario)

5) Uso en componentes:
   import { api } from "@/lib/api";
   const r = await api.get("/tu-endpoint/"); // Usa rutas relativas a VITE_API_BASE_URL

Notas:
- Si ya tenías un archivo src/lib/api.ts, compara e integra.
- Si tu proyecto no usa alias "@/...", ajusta los imports relativos (por ejemplo, "../lib/api").
- Si tu backend usa FastAPI, crea rutas equivalentes: /auth/token, /auth/refresh, /auth/me.
