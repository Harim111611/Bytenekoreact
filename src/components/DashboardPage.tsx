import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Plus, FileDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Lun', responses: 145 },
  { day: 'Mar', responses: 220 },
  { day: 'Mié', responses: 180 },
  { day: 'Jue', responses: 290 },
  { day: 'Vie', responses: 250 },
  { day: 'Sáb', responses: 120 },
  { day: 'Dom', responses: 90 },
];

const recentActivity = [
  { id: 1, name: 'Satisfacción Q3', status: 'Activa', sample: 500, progress: 83 },
  { id: 2, name: 'Concepto Bebidas', status: 'Activa', sample: 300, progress: 62 },
  { id: 3, name: 'Awareness Marca X', status: 'Finalizada', sample: 1000, progress: 100 },
  { id: 4, name: 'Test Producto A', status: 'Activa', sample: 200, progress: 45 },
];

export function DashboardPage() {
  const [period, setPeriod] = useState('30');
  const [workspace, setWorkspace] = useState('general');

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen general de tu actividad</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="365">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Select value={workspace} onValueChange={setWorkspace}>
            <SelectTrigger className="w-[160px] bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="clienteA">Cliente A</SelectItem>
              <SelectItem value="clienteB">Cliente B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          label="Encuestas activas" 
          value={12} 
          delta="+3 vs mes anterior"
          deltaPositive
        />
        <KPICard 
          label="Respuestas hoy" 
          value={147} 
          delta="+12%"
          deltaPositive
        />
        <KPICard 
          label="Total respuestas" 
          value="3,200" 
        />
        <KPICard 
          label="Tasa de finalización" 
          value="83%" 
          delta="+5%"
          deltaPositive
        />
      </div>

      {/* Chart */}
      <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg">
        <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>Respuestas por día</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis 
              dataKey="day" 
              className="stroke-muted-foreground"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              className="stroke-muted-foreground"
              style={{ fontSize: '14px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="responses" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity Table */}
      <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 600 }}>Actividad reciente</h2>
            <p className="text-muted-foreground text-sm mt-1">Seguimiento de tus encuestas activas</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 transition-all duration-200 hover:shadow-md">
              <FileDown className="w-4 h-4" />
              Generar reporte PDF
            </Button>
            <Button className="gap-2 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-accent to-primary">
              <Plus className="w-4 h-4" />
              Nueva encuesta
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Encuesta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Muestra</TableHead>
              <TableHead>Avance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item) => (
              <TableRow key={item.id} className="transition-colors hover:bg-secondary/50">
                <TableCell style={{ fontWeight: 500 }}>{item.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'Activa' ? 'default' : 'secondary'}
                    className={item.status === 'Activa' ? 'bg-success hover:bg-success/90' : ''}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.sample.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={item.progress} className="flex-1 max-w-[200px]" />
                    <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      {item.progress}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}