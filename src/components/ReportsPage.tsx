import React, { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { FileDown, FileText } from 'lucide-react';

export function ReportsPage() {
  const [survey, setSurvey] = useState('');
  const [period, setPeriod] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTable, setIncludeTable] = useState(true);
  const [includeKPIs, setIncludeKPIs] = useState(true);

  return (
    <div className="p-8 space-y-8">
      <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Reportes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <Card className="p-6 bg-card border border-border rounded-xl h-fit">
          <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
            Configuración del reporte
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Selecciona encuesta</Label>
              <Select value={survey} onValueChange={setSurvey}>
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Selecciona una encuesta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satisfaction">Satisfacción Q3</SelectItem>
                  <SelectItem value="beverage">Concepto Bebidas</SelectItem>
                  <SelectItem value="awareness">Awareness Marca X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Selecciona un periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                  <SelectItem value="90">Últimos 90 días</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <Label>Incluir en el reporte</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="kpis" 
                  checked={includeKPIs}
                  onCheckedChange={(checked) => setIncludeKPIs(checked as boolean)}
                />
                <label
                  htmlFor="kpis"
                  className="cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  KPIs y métricas clave
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <label
                  htmlFor="charts"
                  className="cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  Gráficas y visualizaciones
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="table" 
                  checked={includeTable}
                  onCheckedChange={(checked) => setIncludeTable(checked as boolean)}
                />
                <label
                  htmlFor="table"
                  className="cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  Tabla de datos completa
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 bg-secondary border border-border rounded-xl">
          <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
            Vista previa
          </h2>

          <div className="bg-card border border-border rounded-lg p-8 mb-6 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground" style={{ fontSize: '14px', fontWeight: 700 }}>B</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>Reporte de Encuesta</span>
            </div>

            <div className="space-y-4">
              <div className="h-2 bg-secondary rounded w-3/4"></div>
              <div className="h-2 bg-secondary rounded w-full"></div>
              <div className="h-2 bg-secondary rounded w-5/6"></div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="h-20 bg-secondary rounded"></div>
                <div className="h-20 bg-secondary rounded"></div>
              </div>

              <div className="h-40 bg-secondary rounded"></div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full gap-2">
              <FileDown className="w-4 h-4" />
              Generar PDF
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <FileText className="w-4 h-4" />
              Generar PowerPoint
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}