import React, { useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Moon, Sun, Upload, Save } from "lucide-react";
import { api } from "@/lib/api";

interface SettingsPageProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  // Datos del usuario desde localStorage (guardado en el login con api.me())
  const baseUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const { displayName, email, initials, storedAvatar } = useMemo(() => {
    const u = baseUser || {};
    const full =
      u.full_name ||
      (u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : null);
    const displayName = String(full || u.username || u.email || "Usuario");
    const email = u.email ? String(u.email) : undefined;
    const parts = displayName.trim().split(/\s+/);
    const initials =
      ((parts[0]?.[0] || "") + (parts.at(-1)?.[0] || "")).toUpperCase() || "US";
    const storedAvatar: string | undefined =
      u.avatar_url || u.avatar || u.photo || undefined;
    return { displayName, email, initials, storedAvatar };
  }, [baseUser]);

  // Foto: preview + archivo seleccionado
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(storedAvatar);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const AVATAR_ENDPOINT =
    (import.meta as any).env.VITE_AVATAR_ENDPOINT || "/api/users/me/avatar/";

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setFile(f);
    // Preview local
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setMsg(null);
    setErr(null);
  }

  async function onUpload() {
    if (!file) {
      setErr("Primero selecciona una imagen");
      return;
    }
    setUploading(true);
    setMsg(null);
    setErr(null);
    try {
      const form = new FormData();
      form.append("avatar", file); // <- nombre del campo esperado por el backend

      const { data } = await api.upload<any>(AVATAR_ENDPOINT, form);

      // Aceptamos dos respuestas:
      // 1) { avatar_url: "..." }
      // 2) usuario completo { ..., avatar_url: "..."} o { avatar: "..." }
      const newUrl =
        data?.avatar_url || data?.avatar || data?.photo || previewUrl || null;

      // Actualizar authUser en localStorage
      try {
        const raw = localStorage.getItem("authUser");
        const current = raw ? JSON.parse(raw) : {};
        const updated = {
          ...current,
          avatar_url: newUrl || current.avatar_url,
          avatar: newUrl || current.avatar, // por compatibilidad
        };
        localStorage.setItem("authUser", JSON.stringify(updated));
      } catch {}

      if (newUrl) setPreviewUrl(String(newUrl));
      setMsg("Foto actualizada correctamente.");
    } catch (e: any) {
      setErr(e?.message || "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-8 space-y-8">
      <h1 style={{ fontSize: "32px", fontWeight: 600 }}>Configuración</h1>

      {/* === Bloque: Foto de perfil === */}
      <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
        <h2 className="mb-6" style={{ fontSize: "22px", fontWeight: 600 }}>
          Foto de perfil
        </h2>

        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20 bg-accent text-accent-foreground">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="avatar" />
            ) : (
              <AvatarFallback style={{ fontSize: "24px", fontWeight: 600 }}>
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate" style={{ fontSize: "18px", fontWeight: 600 }}>
                {displayName}
              </h3>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Activo
              </Badge>
            </div>
            {email && (
              <p className="text-muted-foreground truncate" style={{ fontSize: "14px" }}>
                {email}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <input
                id="avatarFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("avatarFile")?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Procesando..." : "Cambiar foto"}
              </Button>
              <Button
                type="button"
                className="gap-2 bg-gradient-to-r from-accent to-primary"
                onClick={onUpload}
                disabled={uploading || !file}
              >
                <Save className="w-4 h-4" />
                {uploading ? "Subiendo..." : "Guardar"}
              </Button>
            </div>

            {/* Mensajes */}
            {msg && (
              <p className="text-green-600 mt-3 text-sm">
                {msg}
              </p>
            )}
            {err && (
              <p className="text-red-600 mt-3 text-sm">
                {err}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* === Bloque: Preferencias === */}
      <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
        <h2 className="mb-6" style={{ fontSize: "22px", fontWeight: 600 }}>
          Preferencias de la aplicación
        </h2>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-accent" />
              ) : (
                <Sun className="w-5 h-5 text-accent" />
              )}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Modo oscuro</h3>
                <p className="text-muted-foreground text-sm">
                  Cambia entre tema claro y oscuro
                </p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => onThemeChange(checked ? "dark" : "light")}
            />
          </div>

          {/* Idioma */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Idioma</h3>
              <p className="text-muted-foreground text-sm">Español (predeterminado)</p>
            </div>
            <Badge variant="secondary">ES</Badge>
          </div>

          {/* Notificaciones por email */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Notificaciones por email</h3>
              <p className="text-muted-foreground text-sm">
                Recibe alertas sobre nuevas respuestas
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Auto-guardado */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Auto-guardado</h3>
              <p className="text-muted-foreground text-sm">
                Guarda automáticamente tus cambios
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}
