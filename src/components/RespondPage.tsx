import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';

export function RespondPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    { id: 'drink', label: '¿Cuál es tu bebida favorita?', type: 'text' },
    { id: 'satisfaction', label: 'Califica tu nivel de satisfacción (1-10)', type: 'scale' },
  ];

  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Responder Encuesta</h1>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Demo de encuesta pública
          </Badge>
        </div>

        <div className="flex items-center justify-center min-h-[600px]">
          <Card className="w-full max-w-2xl p-12 bg-card border border-border rounded-xl text-center shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
            </div>
            <h2 className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ fontSize: '32px', fontWeight: 600 }}>
              ¡Gracias por participar!
            </h2>
            <p className="text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Tus respuestas han sido registradas exitosamente.
            </p>
            <Button 
              onClick={() => { setSubmitted(false); setCurrentStep(0); setAnswers({}); }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              Responder otra encuesta
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Responder Encuesta</h1>
          <p className="text-muted-foreground mt-2">
            Vista previa de cómo los participantes responderán tus encuestas
          </p>
        </div>
        <Badge variant="outline" className="bg-info/10 text-info border-info/20">
          Demo de encuesta pública
        </Badge>
      </div>

      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-2xl p-8 bg-card border border-border rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground" style={{ fontSize: '16px', fontWeight: 700 }}>B</span>
              </div>
              <span className="text-foreground" style={{ fontSize: '20px', fontWeight: 700 }}>Encuesta: Satisfacción Q3</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              Vista pública
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Pregunta {currentStep + 1} de {questions.length}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                {Math.round(progress)}% completado
              </span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Question */}
          <div className="mb-8">
            <Label className="mb-4 block" style={{ fontSize: '18px' }}>
              {currentQuestion.label}
            </Label>

            {currentQuestion.type === 'text' && (
              <Input
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                placeholder="Tu respuesta"
                className="bg-input-background"
              />
            )}

            {currentQuestion.type === 'scale' && (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: n })}
                    className={`w-12 h-12 border rounded-lg transition-all ${
                      answers[currentQuestion.id] === n
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-secondary'
                    }`}
                    style={{ fontSize: '16px', fontWeight: 600 }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            <Button onClick={handleNext}>
              {currentStep === questions.length - 1 ? 'Enviar' : 'Siguiente'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}