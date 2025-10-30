import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Trash2, Eye, FileDown, Lightbulb, Sparkles, Copy, CheckCircle2, ArrowRight, ArrowLeft, Info, BarChart3, Package, Megaphone, Target, Type, Hash, Gauge, Circle, CheckSquare, ThumbsUp, Calendar, MessageSquare, HelpCircle, TrendingUp, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Question {
  id: string;
  title: string;
  type: string;
  required?: boolean;
  options?: string[];
}

// Plantillas de preguntas por categoría
const questionTemplates = {
  satisfaction: [
    '¿Qué tan satisfecho estás con nuestro producto/servicio?',
    'En una escala del 1 al 10, ¿cómo calificarías tu experiencia?',
    '¿Recomendarías nuestro producto/servicio a otras personas?',
    '¿Qué aspectos te gustan más de nuestro producto/servicio?',
    '¿Qué podríamos mejorar?',
  ],
  product: [
    '¿Con qué frecuencia utilizas este producto?',
    '¿Qué características valoras más del producto?',
    '¿El producto cumple con tus expectativas?',
    '¿Qué precio estarías dispuesto a pagar?',
    '¿Qué alternativas has considerado?',
  ],
  awareness: [
    '¿Has escuchado sobre nuestra marca anteriormente?',
    '¿Dónde nos conociste?',
    '¿Qué palabras asocias con nuestra marca?',
    '¿Conoces nuestros productos/servicios?',
    '¿Cómo describirías nuestra marca a un amigo?',
  ],
  concept: [
    '¿Qué te parece este concepto?',
    '¿Es clara la propuesta de valor?',
    '¿Te interesaría adquirir este producto/servicio?',
    '¿Qué cambiarías del concepto?',
    '¿Para quién crees que es este producto/servicio?',
  ],
};

// Opciones predefinidas por tipo de pregunta
const optionTemplates = {
  satisfaction: ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy insatisfecho'],
  frequency: ['Diariamente', 'Semanalmente', 'Mensualmente', 'Ocasionalmente', 'Nunca'],
  agreement: ['Totalmente de acuerdo', 'De acuerdo', 'Neutral', 'En desacuerdo', 'Totalmente en desacuerdo'],
  yesNo: ['Sí', 'No'],
  yesNoMaybe: ['Sí', 'No', 'Tal vez'],
  likelihood: ['Muy probable', 'Probable', 'Neutral', 'Poco probable', 'Nada probable'],
};

const STEPS = [
  { id: 1, title: 'Información básica', description: 'Nombre y categoría' },
  { id: 2, title: 'Agregar preguntas', description: 'Construye tu encuesta' },
  { id: 3, title: 'Revisar y publicar', description: 'Vista previa final' },
];

export function SurveysPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyName, setSurveyName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('Texto');
  const [editOptions, setEditOptions] = useState<string[]>([]);
  const [editRequired, setEditRequired] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Validaciones por paso
  const canProceedToStep2 = surveyName.trim() !== '' && category !== '';
  const canProceedToStep3 = questions.length > 0;

  // Progreso total
  const progressPercentage = (currentStep / STEPS.length) * 100;

  // Generar sugerencias
  const generateSuggestions = (text: string) => {
    let allSuggestions: string[] = [];
    
    if (category && questionTemplates[category as keyof typeof questionTemplates]) {
      allSuggestions = [...questionTemplates[category as keyof typeof questionTemplates]];
    }
    
    if (text.length > 2) {
      return allSuggestions.filter(s => 
        s.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);
    }
    
    return allSuggestions.slice(0, 5);
  };

  const handleTitleChange = (value: string) => {
    setEditTitle(value);
    if (value.length > 0) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setEditTitle(suggestion);
    setShowSuggestions(false);
  };

  const quickAddQuestion = (template: string, type: string = 'Texto') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: template,
      type: type,
      required: false,
      options: (type === 'Opción (single)' || type === 'Opción (multi)') 
        ? ['Opción 1', 'Opción 2', 'Opción 3'] 
        : undefined,
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const startNewQuestion = () => {
    const newId = Date.now().toString();
    const newQuestion: Question = {
      id: newId,
      title: '',
      type: 'Texto',
      required: false,
    };
    
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newId);
    setEditTitle('');
    setEditType('Texto');
    setEditOptions([]);
    setEditRequired(false);
  };

  const startEditQuestion = (question: Question) => {
    setEditingQuestion(question.id);
    setEditTitle(question.title);
    setEditType(question.type);
    setEditOptions(question.options || []);
    setEditRequired(question.required || false);
  };

  const saveEditQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id 
        ? { ...q, title: editTitle, type: editType, options: editOptions.length > 0 ? editOptions : undefined, required: editRequired }
        : q
    ));
    setEditingQuestion(null);
    setShowSuggestions(false);
  };

  const cancelEdit = () => {
    // Si la pregunta está vacía, la eliminamos
    if (editTitle.trim() === '') {
      setQuestions(questions.filter(q => q.id !== editingQuestion));
    }
    setEditingQuestion(null);
    setShowSuggestions(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingQuestion === id) {
      setEditingQuestion(null);
    }
  };

  const duplicateQuestion = (question: Question) => {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      title: question.title,
    };
    setQuestions([...questions, newQuestion]);
  };

  const addOption = () => {
    setEditOptions([...editOptions, `Opción ${editOptions.length + 1}`]);
  };

  const removeOption = (index: number) => {
    setEditOptions(editOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editOptions];
    newOptions[index] = value;
    setEditOptions(newOptions);
  };

  const useOptionTemplate = (templateKey: string) => {
    const template = optionTemplates[templateKey as keyof typeof optionTemplates];
    if (template) {
      setEditOptions([...template]);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 600 }}>Crear Encuesta</h1>
        <p className="text-muted-foreground mt-2">
          Sigue los pasos para crear tu encuesta profesional
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Paso {currentStep} de {STEPS.length}</span>
          <span>{Math.round(progressPercentage)}% completado</span>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((step) => (
          <Card
            key={step.id}
            className={`p-4 cursor-pointer transition-all ${
              currentStep === step.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : currentStep > step.id
                ? 'border-success bg-success/5'
                : 'border-border opacity-50'
            }`}
            onClick={() => {
              if (step.id === 1) setCurrentStep(1);
              if (step.id === 2 && canProceedToStep2) setCurrentStep(2);
              if (step.id === 3 && canProceedToStep3) setCurrentStep(3);
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step.id
                    ? 'bg-success text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{step.id}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="p-8 bg-card border border-border rounded-xl">
        {/* STEP 1: Información Básica */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
              <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 style={{ fontSize: '14px', fontWeight: 600 }} className="text-info mb-1">
                  Paso 1: Información básica
                </h3>
                <p className="text-sm text-foreground/80">
                  Define el nombre, categoría y objetivo de tu encuesta. Esto te ayudará a organizar mejor tus estudios.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="surveyName" className="flex items-center gap-2">
                  Nombre de la encuesta
                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                    Requerido
                  </Badge>
                </Label>
                <Input
                  id="surveyName"
                  value={surveyName}
                  onChange={(e) => setSurveyName(e.target.value)}
                  placeholder="ej. Satisfacción de clientes Q1 2024"
                  className="bg-input-background"
                />
                <p className="text-xs text-muted-foreground">
                  Usa un nombre descriptivo y fácil de identificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  Categoría
                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                    Requerido
                  </Badge>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Selecciona el tipo de estudio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satisfaction">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Satisfacción del cliente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="product">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Investigación de producto</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="awareness">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4" />
                        <span>Brand awareness</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="concept">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Test de concepto</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Esto activará sugerencias específicas para tu estudio
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el objetivo de esta encuesta y qué información esperas obtener..."
                className="bg-input-background min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Esta descripción te ayudará a recordar el propósito del estudio
              </p>
            </div>

            {surveyName && category && (
              <Alert className="bg-success/10 border-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  ¡Perfecto! Ya puedes continuar al siguiente paso.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                onClick={nextStep}
                disabled={!canProceedToStep2}
                className="gap-2"
              >
                Continuar a preguntas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Agregar Preguntas */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
              <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 style={{ fontSize: '14px', fontWeight: 600 }} className="text-info mb-1">
                  Paso 2: Construye tu encuesta
                </h3>
                <p className="text-sm text-foreground/80">
                  Usa las plantillas sugeridas o crea preguntas personalizadas. Necesitas al menos 1 pregunta para continuar.
                </p>
              </div>
            </div>

            {/* Quick Templates */}
            {category && questionTemplates[category as keyof typeof questionTemplates] && (
              <Card className="p-5 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Plantillas recomendadas para {category === 'satisfaction' ? 'Satisfacción' : category === 'product' ? 'Producto' : category === 'awareness' ? 'Awareness' : 'Concepto'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {questionTemplates[category as keyof typeof questionTemplates].map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => quickAddQuestion(template, template.includes('escala') || template.includes('calificarías') ? 'Escala (1-10)' : template.includes('Recomendarías') ? 'Opción (single)' : 'Texto')}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
                    >
                      <Plus className="w-4 h-4 shrink-0 text-primary" />
                      <span className="text-sm flex-1">{template}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        Agregar
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Custom Question Button */}
            <div className="flex justify-center">
              <Button
                onClick={startNewQuestion}
                variant="outline"
                className="gap-2"
                disabled={editingQuestion !== null}
              >
                <Plus className="w-4 h-4" />
                Crear pregunta personalizada
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questions.length === 0 && !editingQuestion && (
                <Card className="p-12 text-center bg-secondary/20 border-dashed">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2" style={{ fontSize: '15px', fontWeight: 500 }}>
                    No hay preguntas todavía
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Usa las plantillas de arriba o crea una pregunta personalizada
                  </p>
                </Card>
              )}

              {questions.map((question, index) => (
                <Card key={question.id} className="border border-border rounded-lg bg-card overflow-hidden">
                  {editingQuestion === question.id ? (
                    // Edit Mode
                    <div className="p-6 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Editando pregunta {index + 1}
                          </Badge>
                        </div>
                        <Select value={editType} onValueChange={setEditType}>
                          <SelectTrigger className="w-[200px] bg-input-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Texto">
                              <div className="flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                <span>Texto libre</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Número">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                <span>Número</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Escala (1-10)">
                              <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4" />
                                <span>Escala 1-10</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Opción (single)">
                              <div className="flex items-center gap-2">
                                <Circle className="w-4 h-4" />
                                <span>Opción única</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Opción (multi)">
                              <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" />
                                <span>Opción múltiple</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Question Title with Autocomplete */}
                      <div className="space-y-2 relative">
                        <Label className="text-foreground">Pregunta</Label>
                        <div className="relative">
                          <Textarea
                            value={editTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onFocus={() => {
                              const newSuggestions = generateSuggestions(editTitle);
                              setSuggestions(newSuggestions);
                              setShowSuggestions(newSuggestions.length > 0);
                            }}
                            placeholder="Escribe tu pregunta aquí..."
                            className="bg-input-background text-foreground min-h-[80px]"
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <Card className="absolute z-50 w-full mt-1 p-2 bg-popover border border-border shadow-lg max-h-[240px] overflow-y-auto">
                              <div className="text-xs text-muted-foreground mb-2 px-2 py-1 flex items-center gap-1.5 bg-secondary/50 rounded">
                                <Sparkles className="w-3.5 h-3.5" />
                                Sugerencias basadas en tu categoría
                              </div>
                              <div className="space-y-0.5">
                                {suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => selectSuggestion(suggestion)}
                                    className="w-full text-left px-3 py-2.5 rounded hover:bg-secondary transition-colors text-sm text-foreground"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </Card>
                          )}
                        </div>
                      </div>

                      {/* Required Toggle */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={editRequired}
                          onChange={(e) => setEditRequired(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`required-${question.id}`} className="cursor-pointer">
                          Respuesta obligatoria
                        </Label>
                      </div>

                      {/* Options Editor for Multiple Choice */}
                      {(editType.includes('Opción')) && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground">Opciones de respuesta</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Usar plantilla
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[220px] p-2">
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground px-2 py-1 mb-1">
                                    Plantillas predefinidas
                                  </div>
                                  {Object.keys(optionTemplates).map((key) => (
                                    <button
                                      key={key}
                                      onClick={() => useOptionTemplate(key)}
                                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-secondary transition-colors text-foreground flex items-center gap-2"
                                    >
                                      {key === 'satisfaction' && <><ThumbsUp className="w-3.5 h-3.5" /> Satisfacción</>}
                                      {key === 'frequency' && <><Calendar className="w-3.5 h-3.5" /> Frecuencia</>}
                                      {key === 'agreement' && <><CheckCircle2 className="w-3.5 h-3.5" /> Acuerdo</>}
                                      {key === 'yesNo' && <><CheckCircle2 className="w-3.5 h-3.5" /> Sí/No</>}
                                      {key === 'yesNoMaybe' && <><HelpCircle className="w-3.5 h-3.5" /> Sí/No/Tal vez</>}
                                      {key === 'likelihood' && <><TrendingUp className="w-3.5 h-3.5" /> Probabilidad</>}
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            {editOptions.map((option, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <div className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-muted-foreground text-xs shrink-0">
                                  {idx + 1}
                                </div>
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(idx, e.target.value)}
                                  className="bg-input-background text-foreground flex-1"
                                  placeholder={`Opción ${idx + 1}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(idx)}
                                  disabled={editOptions.length <= 2}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={addOption}
                              className="gap-2 w-full mt-2"
                            >
                              <Plus className="w-4 h-4" />
                              Agregar opción
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={() => saveEditQuestion(question.id)}
                          disabled={!editTitle.trim()}
                        >
                          Guardar pregunta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start gap-4 p-5 hover:bg-secondary/20 transition-colors group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>{index + 1}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs bg-secondary">
                            {question.type}
                          </Badge>
                          {question.required && (
                            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                              Obligatoria
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground mb-3" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}>
                          {question.title}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {question.options.map((opt, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-secondary/80 text-foreground">
                                {opt}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => duplicateQuestion(question)}
                          className="h-9 w-9 p-0"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEditQuestion(question)}
                          className="h-9 w-9 p-0"
                          title="Editar"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {questions.length > 0 && (
              <Alert className="bg-success/10 border-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Has agregado {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}. Ya puedes continuar a la vista previa.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedToStep3 || editingQuestion !== null}
                className="gap-2"
              >
                Revisar encuesta
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview and Publish */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
              <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 style={{ fontSize: '14px', fontWeight: 600 }} className="text-info mb-1">
                  Paso 3: Revisa y publica
                </h3>
                <p className="text-sm text-foreground/80">
                  Verifica que todo esté correcto antes de publicar tu encuesta.
                </p>
              </div>
            </div>

            {/* Survey Info Summary */}
            <Card className="p-6 bg-secondary/30">
              <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-4">
                Información de la encuesta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Nombre</Label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{surveyName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Categoría</Label>
                  <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {category === 'satisfaction' && <><BarChart3 className="w-4 h-4" /> Satisfacción del cliente</>}
                    {category === 'product' && <><Package className="w-4 h-4" /> Investigación de producto</>}
                    {category === 'awareness' && <><Megaphone className="w-4 h-4" /> Brand awareness</>}
                    {category === 'concept' && <><Target className="w-4 h-4" /> Test de concepto</>}
                  </div>
                </div>
                {description && (
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground text-xs">Descripción</Label>
                    <p className="text-sm">{description}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground text-xs">Total de preguntas</Label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{questions.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Preguntas obligatorias</Label>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>
                    {questions.filter(q => q.required).length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-8 bg-secondary/30 border-dashed">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Vista previa</h3>
              </div>
              
              <div className="space-y-6 bg-card p-6 rounded-lg">
                <div className="pb-6 border-b border-border">
                  <h2 style={{ fontSize: '24px', fontWeight: 600 }} className="mb-2">{surveyName}</h2>
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>

                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <Label className="flex items-baseline gap-2">
                      <span className="text-muted-foreground text-sm">{index + 1}.</span>
                      <span>{question.title}</span>
                      {question.required && <span className="text-destructive">*</span>}
                    </Label>
                    
                    {question.type.includes('Texto') && (
                      <Input placeholder="Tu respuesta" className="bg-input-background" disabled />
                    )}
                    {question.type.includes('Número') && (
                      <Input type="number" placeholder="Ingresa un número" className="bg-input-background" disabled />
                    )}
                    {question.type.includes('Escala') && (
                      <div className="flex gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <button 
                            key={n}
                            disabled
                            className="w-10 h-10 border border-border rounded-lg bg-secondary/50"
                            style={{ fontSize: '14px' }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                    {question.type.includes('Opción') && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type={question.type.includes('single') ? 'radio' : 'checkbox'}
                              name={`preview-question-${question.id}`}
                              id={`preview-q${question.id}-opt${idx}`}
                              className="w-4 h-4"
                              disabled
                            />
                            <label htmlFor={`preview-q${question.id}-opt${idx}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-border">
                  <Button className="w-full" disabled>
                    Enviar respuestas
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a editar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <FileDown className="w-4 h-4" />
                  Exportar JSON
                </Button>
                <Button className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Publicar encuesta
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}