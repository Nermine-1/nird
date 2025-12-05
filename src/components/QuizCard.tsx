import { useState } from 'react';
import { Quiz } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lightbulb, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  onComplete?: (correct: boolean) => void;
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    onComplete?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-secondary';
    }
  };

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
            Quiz de Compréhension
          </CardTitle>
          <Badge className={getDifficultyColor(quiz.difficulty)}>
            {quiz.difficulty === 'easy' ? 'Facile' : quiz.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-foreground">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                selectedAnswer === index
                  ? showResult
                    ? index === quiz.correctAnswer
                      ? "border-success bg-success/10"
                      : "border-destructive bg-destructive/10"
                    : "border-primary bg-primary/10"
                  : showResult && index === quiz.correctAnswer
                  ? "border-success bg-success/10"
                  : "border-border bg-card hover:border-primary/50",
                showResult && "cursor-default"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && index === quiz.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                {showResult && selectedAnswer === index && index !== quiz.correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg",
            isCorrect ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
          )}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <Trophy className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn("font-semibold mb-2", isCorrect ? "text-success" : "text-destructive")}>
                  {isCorrect ? "Bravo ! Bonne réponse !" : "Pas tout à fait..."}
                </p>
                <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Valider ma réponse
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Réessayer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}