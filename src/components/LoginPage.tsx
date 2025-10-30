import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, BarChart3, TrendingUp, Users } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Mock login - accept any credentials for demo
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl flex gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white" style={{ fontSize: '22px', fontWeight: 700 }}>B</span>
            </div>
            <span className="text-foreground" style={{ fontSize: '28px', fontWeight: 700 }}>Byteneko</span>
          </div>

          <div>
            <h1 className="mb-4" style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1.2 }}>
              Estudios de mercado<br />
              <span className="text-accent">más inteligentes</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Crea cuestionarios, analiza resultados y genera reportes profesionales en minutos.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/10 rounded-lg transition-all duration-300 group-hover:bg-accent/20">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Análisis visual avanzado</h3>
                <p className="text-muted-foreground text-sm">Visualiza tus datos con gráficos interactivos y reportes detallados</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/10 rounded-lg transition-all duration-300 group-hover:bg-accent/20">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Insights automáticos</h3>
                <p className="text-muted-foreground text-sm">Descubre patrones y tendencias con inteligencia artificial</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/10 rounded-lg transition-all duration-300 group-hover:bg-accent/20">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Colaboración en equipo</h3>
                <p className="text-muted-foreground text-sm">Trabaja con tu equipo en tiempo real y comparte resultados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 w-full">
          <Card className="w-full max-w-md mx-auto p-8 bg-card border border-border rounded-2xl shadow-xl backdrop-blur-sm">
            {/* Logo for mobile */}
            <div className="flex justify-center mb-8 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>B</span>
                </div>
                <span className="text-foreground" style={{ fontSize: '24px', fontWeight: 700 }}>Byteneko</span>
              </div>
            </div>

            <h1 className="text-center mb-2" style={{ fontSize: '28px', fontWeight: 600 }}>Bienvenido</h1>
            <p className="text-center text-muted-foreground mb-8">Inicia sesión para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="bg-input-background border-input h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="bg-input-background border-input h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Iniciar sesión
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                ¿No tienes cuenta?{' '}
                <button type="button" className="text-accent hover:underline transition-all duration-200">
                  Solicitar acceso
                </button>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}