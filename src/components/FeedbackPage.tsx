import React, { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2 } from 'lucide-react';

export function FeedbackPage() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setType('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Feedback</h1>

      <Card className="max-w-2xl p-8 bg-card border border-border rounded-xl">
        <h2 className="mb-2" style={{ fontSize: '22px', fontWeight: 600 }}>
          Comparte tu opinión
        </h2>
        <p className="text-muted-foreground mb-8">
          Ayúdanos a mejorar Byteneko con tus comentarios y sugerencias
        </p>

        {submitted && (
          <Alert className="mb-6 bg-success/10 border-success/20 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              ¡Gracias por tu feedback! Lo revisaremos pronto.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de feedback</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">Sugerencia</SelectItem>
                <SelectItem value="bug">Reporte de error</SelectItem>
                <SelectItem value="feature">Nueva funcionalidad</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tu sugerencia o problema en detalle..."
              className="bg-input-background min-h-[200px]"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!type || !message}>
            Enviar feedback
          </Button>
        </form>
      </Card>
    </div>
  );
}