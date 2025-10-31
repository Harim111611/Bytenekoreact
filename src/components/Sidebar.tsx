import React, { useMemo } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  MessageSquare,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { UserCard } from "./UserCard";
import { Button } from "./ui/button";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "surveys", label: "Encuestas", icon: ClipboardList },
  { id: "results", label: "Resultados", icon: BarChart3 },
  { id: "respond", label: "Responder", icon: MessageSquare },
  { id: "reports", label: "Reportes", icon: FileText },
  { id: "feedback", label: "Feedback", icon: MessageCircle },
  { id: "settings", label: "Configuración", icon: Settings },
];

// Helpers para nombre e iniciales
function computeDisplayName(u: any): string {
  if (!u) return "Usuario";
  const full =
    u.full_name ||
    (u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : null);
  return (full || u.username || u.email || "Usuario").toString();
}

function computeInitials(name: string): string {
  try {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "US";
    const first = parts[0][0] || "";
    const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") || "";
    const init = (first + last).toUpperCase();
    return init || "US";
  } catch {
    return "US";
  }
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const { displayName, initials, email } = useMemo(() => {
    let authUser: any = null;
    try {
      const raw = localStorage.getItem("authUser");
      authUser = raw ? JSON.parse(raw) : null;
    } catch {}
    const displayName = computeDisplayName(authUser);
    const initials = computeInitials(displayName);
    const email = authUser?.email ? String(authUser.email) : undefined;
    return { displayName, initials, email };
  }, []);

  return (
    <div className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>
              B
            </span>
          </div>
          <span className="text-sidebar-foreground" style={{ fontSize: "20px", fontWeight: 700 }}>
            Byteneko
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"></div>
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
              <span style={{ fontSize: "15px", fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <UserCard username={displayName} initials={initials} subtitle={email} />
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border hover:bg-secondary transition-all duration-200"
          type="button"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
