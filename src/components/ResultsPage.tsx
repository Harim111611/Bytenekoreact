import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { KPICard } from './KPICard';
import { Upload, FileSpreadsheet, Download, Filter, TrendingUp, Users, Target, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mock data
const categoryData = [
  { category: 'Café', value: 380, percentage: 26.2, color: '#D97706', gradient: 'from-amber-500 to-amber-700' },
  { category: 'Agua', value: 450, percentage: 31.0, color: '#3B82F6', gradient: 'from-blue-400 to-blue-500' },
  { category: 'Té', value: 180, percentage: 12.4, color: '#10B981', gradient: 'from-emerald-400 to-emerald-500' },
  { category: 'Refresco', value: 320, percentage: 22.1, color: '#EF4444', gradient: 'from-red-400 to-red-500' },
  { category: 'Jugo', value: 120, percentage: 8.3, color: '#F59E0B', gradient: 'from-orange-400 to-orange-500' },
];

const timeSeriesData = [
  { date: '15 Oct', responses: 145, completed: 120 },
  { date: '16 Oct', responses: 220, completed: 185 },
  { date: '17 Oct', responses: 180, completed: 148 },
  { date: '18 Oct', responses: 290, completed: 245 },
  { date: '19 Oct', responses: 250, completed: 208 },
  { date: '20 Oct', responses: 320, completed: 268 },
  { date: '21 Oct', responses: 280, completed: 234 },
];

const satisfactionDistribution = [
  { score: '1-2', count: 45, color: '#DC2626' },
  { score: '3-4', count: 120, color: '#F59E0B' },
  { score: '5-6', count: 380, color: '#F59E0B' },
  { score: '7-8', count: 620, color: '#10B981' },
  { score: '9-10', count: 285, color: '#10B981' },
];

const pieData = [
  { name: 'Completadas', value: 1408, color: '#10B981' },
  { name: 'Parciales', value: 208, color: '#F59E0B' },
  { name: 'Abandonadas', value: 134, color: '#DC2626' },
];

const tableData = [
  { id: 'R-001', date: '21/10/2025', drink: 'Café', satisfaction: 8, age: 28, complete: true },
  { id: 'R-002', date: '21/10/2025', drink: 'Agua', satisfaction: 9, age: 35, complete: true },
  { id: 'R-003', date: '21/10/2025', drink: 'Té', satisfaction: 7, age: 42, complete: true },
  { id: 'R-004', date: '20/10/2025', drink: 'Refresco', satisfaction: 6, age: 22, complete: false },
  { id: 'R-005', date: '20/10/2025', drink: 'Café', satisfaction: 9, age: 31, complete: true },
  { id: 'R-006', date: '20/10/2025', drink: 'Agua', satisfaction: 8, age: 29, complete: true },
  { id: 'R-007', date: '19/10/2025', drink: 'Jugo', satisfaction: 7, age: 25, complete: true },
  { id: 'R-008', date: '19/10/2025', drink: 'Té', satisfaction: 9, age: 38, complete: true },
];

const insights = [
  { 
    title: 'Preferencia dominante',
    description: 'El Agua es la bebida favorita con 31% de las respuestas, seguida por Café (26.2%)',
    icon: Award,
    color: 'text-accent'
  },
  {
    title: 'Alta satisfacción',
    description: 'El 62.4% de los encuestados calificó entre 7-10, indicando satisfacción positiva',
    icon: TrendingUp,
    color: 'text-success'
  },
  {
    title: 'Tasa de finalización',
    description: '80.4% de las respuestas fueron completadas, superando el promedio de la industria (75%)',
    icon: Target,
    color: 'text-info'
  },
  {
    title: 'Tendencia creciente',
    description: 'Las respuestas han aumentado 93% desde el inicio del periodo, con pico el 20 de octubre',
    icon: Users,
    color: 'text-accent'
  },
];

export function ResultsPage() {
  const [hasData, setHasData] = useState(false);
  const [survey, setSurvey] = useState('satisfaction');
  const [period, setPeriod] = useState('7days');

  if (!hasData) {
    return (
      <div className="p-8 space-y-8">
        <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Análisis de Resultados</h1>
        
        <Card className="p-12 bg-card border border-border rounded-xl">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="mb-3" style={{ fontSize: '24px', fontWeight: 600 }}>
              No hay datos para analizar
            </h2>
            <p className="text-muted-foreground mb-8">
              Importa respuestas desde CSV o Google Forms para comenzar a visualizar insights y análisis detallados
            </p>
            <Button onClick={() => setHasData(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Importar respuestas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Análisis de Resultados</h1>
          <p className="text-muted-foreground mt-2">
            Análisis completo de respuestas y patrones identificados
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={survey} onValueChange={setSurvey}>
            <SelectTrigger className="w-[200px] bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="satisfaction">Satisfacción Q3</SelectItem>
              <SelectItem value="beverage">Concepto Bebidas</SelectItem>
              <SelectItem value="awareness">Awareness Marca X</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="all">Todo el periodo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar análisis
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          label="Total respuestas" 
          value="1,750" 
          delta="+93% vs periodo anterior"
          deltaPositive
          icon={Users}
        />
        <KPICard 
          label="Satisfacción promedio" 
          value="7.8/10" 
          delta="+0.5 puntos"
          deltaPositive
          icon={Award}
        />
        <KPICard 
          label="Tasa de finalización" 
          value="80.4%" 
          delta="+5.4%"
          deltaPositive
          icon={Target}
        />
        <KPICard 
          label="Respuestas/día" 
          value="250" 
          delta="+47%"
          deltaPositive
          icon={TrendingUp}
        />
      </div>

      {/* Insights automáticos */}
      <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg">
        <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
          Insights clave
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex gap-4 p-4 bg-secondary rounded-lg transition-all duration-300 hover:bg-secondary/70 hover:shadow-md group">
                <div className={`p-3 bg-card rounded-lg h-fit ${insight.color} transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }} className="mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Análisis de distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bebidas favoritas - MEJORADO */}
        <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                Distribución de preferencias
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Por categoría de bebida</p>
            </div>
            <Badge variant="secondary" className="shadow-sm">1,450 respuestas</Badge>
          </div>
          
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-125" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{item.value} respuestas</span>
                    <span className="font-semibold text-foreground min-w-[48px] text-right">{item.percentage}%</span>
                  </div>
                </div>
                
                <div className="relative h-10 bg-secondary rounded-lg overflow-hidden group-hover:shadow-md transition-all duration-300">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.gradient} rounded-lg transition-all duration-700 ease-out relative overflow-hidden`}
                    style={{ 
                      width: `${item.percentage}%`,
                      animation: `slideIn 0.8s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                    {item.percentage > 15 && (
                      <div className="absolute inset-0 flex items-center px-4">
                        <span className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ganador destacado */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Preferencia más popular</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-accent">Agua</span> lidera con 450 respuestas (31.0%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Estado de respuestas - DONUT MEJORADO */}
        <Card className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                Estado de respuestas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Composición del total</p>
            </div>
            <Badge variant="secondary" className="shadow-sm">1,750 total</Badge>
          </div>
          
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--card))"
                  label={false}
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro del donut - Stat principal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-bold text-foreground">80.4%</p>
              <p className="text-xs text-muted-foreground mt-1">Tasa de éxito</p>
            </div>
          </div>

          {/* Leyenda mejorada con stats */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            {pieData.map((item, index) => {
              const percentage = ((item.value / 1750) * 100).toFixed(1);
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg transition-all duration-300 hover:bg-secondary hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-125" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-foreground">{item.value}</span>
                    <span className="text-sm text-muted-foreground min-w-[48px] text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Análisis temporal y satisfacción */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendencia temporal - ocupa 2 columnas */}
        <Card className="lg:col-span-2 p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                Tendencia de respuestas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Evolución diaria de respuestas totales y completadas
              </p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Tendencia positiva
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
              <XAxis 
                dataKey="date" 
                className="stroke-muted-foreground" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                className="stroke-muted-foreground" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="responses" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Total"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="Completadas"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribución de satisfacción */}
        <Card className="p-6 bg-card border border-border rounded-xl">
          <h2 className="mb-6" style={{ fontSize: '20px', fontWeight: 600 }}>
            Distribución de satisfacción
          </h2>
          <div className="space-y-4">
            {satisfactionDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.score}</span>
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${(item.count / 1450 * 100)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">7.8</p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Mediana</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Datos detallados */}
      <Card className="p-6 bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
              Datos detallados
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Últimas 8 respuestas registradas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Bebida favorita</TableHead>
              <TableHead>Satisfacción</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ fontWeight: 500 }}>{row.id}</TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
                <TableCell>{row.drink}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[80px]">
                      <Progress value={row.satisfaction * 10} />
                    </div>
                    <span className="text-sm font-medium">{row.satisfaction}/10</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.age} años</TableCell>
                <TableCell>
                  <Badge variant={row.complete ? 'default' : 'secondary'} className={row.complete ? 'bg-success hover:bg-success/90' : ''}>
                    {row.complete ? 'Completa' : 'Parcial'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}