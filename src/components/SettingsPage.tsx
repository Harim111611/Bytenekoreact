import React, { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Moon, Sun } from 'lucide-react';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  const [name, setName] = useState('María González');
  const [email, setEmail] = useState('maria.gonzalez@example.com');

  return (
    <div className="p-8 space-y-8">
      <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Configuración</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
            <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
              Información del perfil
            </h2>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <Avatar className="w-20 h-20 bg-accent text-accent-foreground">
                <AvatarFallback style={{ fontSize: '24px', fontWeight: 600 }}>
                  MG
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{name}</h3>
                <p className="text-muted-foreground">{email}</p>
              </div>
              <Button variant="outline">Cambiar foto</Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <Button>Guardar cambios</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
            <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
              Preferencias de la aplicación
            </h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-accent" />
                  ) : (
                    <Sun className="w-5 h-5 text-accent" />
                  )}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Modo oscuro</h3>
                    <p className="text-muted-foreground text-sm">
                      Cambia entre tema claro y oscuro
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                />
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Idioma</h3>
                  <p className="text-muted-foreground text-sm">
                    Español (predeterminado)
                  </p>
                </div>
                <Badge variant="secondary">ES</Badge>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Notificaciones por email</h3>
                  <p className="text-muted-foreground text-sm">
                    Recibe alertas sobre nuevas respuestas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Auto-save */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Auto-guardado</h3>
                  <p className="text-muted-foreground text-sm">
                    Guarda automáticamente tus cambios
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces">
          <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '22px', fontWeight: 600 }}>Workspaces</h2>
              <Button>Crear workspace</Button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'General', role: 'Owner', active: true },
                { name: 'Cliente A', role: 'Admin', active: false },
                { name: 'Cliente B', role: 'Member', active: false },
              ].map((workspace, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{workspace.name}</h3>
                      {workspace.active && (
                        <Badge className="bg-success hover:bg-success/90">Activo</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      Rol: {workspace.role}
                    </p>
                  </div>
                  <Button variant="outline">Administrar</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
