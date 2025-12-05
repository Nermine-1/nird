import { useState } from 'react';
import { Message } from '@/types/chat';
import { Shield, User, CheckCircle, AlertTriangle, XCircle, HelpCircle, ExternalLink, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';
import { QuizCard } from './QuizCard';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { setCurrentAnalysis } = useChatStore();
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const isAssistant = message.role === 'assistant';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getVerdictInfo = (verdict: string) => {
    switch (verdict) {
      case 'verified':
        return { icon: CheckCircle, color: 'text-success', label: 'Vérifié' };
      case 'suspicious':
        return { icon: AlertTriangle, color: 'text-warning', label: 'Suspect' };
      case 'false':
        return { icon: XCircle, color: 'text-destructive', label: 'Faux' };
      default:
        return { icon: HelpCircle, color: 'text-muted-foreground', label: 'Non vérifié' };
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 animate-slide-up",
        isAssistant ? "bg-card/50" : "bg-transparent"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isAssistant 
            ? "bg-primary/20 text-primary" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isAssistant ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Message Text */}
        <div className="prose prose-invert prose-sm max-w-none">
          {message.content.split('\n').map((line, i) => {
            // Handle bold text
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="mb-2 last:mb-0">
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={j}>{part}</span>;
                })}
              </p>
            );
          })}
        </div>

        {/* Analysis Result */}
        {message.analysis && (
          <div className="glass-card p-4 space-y-4">
            {/* Score Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const { icon: Icon, color, label } = getVerdictInfo(message.analysis.verdict);
                  return (
                    <>
                      <Icon className={cn("w-6 h-6", color)} />
                      <span className={cn("font-semibold", color)}>{label}</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Score de fiabilité:</span>
                <span className={cn("text-2xl font-bold", getScoreColor(message.analysis.score))}>
                  {message.analysis.score}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  message.analysis.score >= 80 ? "bg-success" :
                  message.analysis.score >= 50 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${message.analysis.score}%` }}
              />
            </div>

            {/* View Details Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setCurrentAnalysis(message.analysis!)}
            >
              Voir l'analyse détaillée
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            {/* Quiz Suggestion */}
            {message.analysis.suggestedQuizzes && message.analysis.suggestedQuizzes.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3 mb-3">
                  <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Testez votre compréhension !
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pour mieux comprendre cette analyse, nous vous proposons {message.analysis.suggestedQuizzes.length} quiz interactifs basés sur l'explication ci-dessus.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowQuizzes(!showQuizzes)}
                  variant={showQuizzes ? "secondary" : "default"}
                  size="sm"
                  className="w-full"
                >
                  {showQuizzes ? "Masquer les quiz" : "Commencer les quiz"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Quizzes Section */}
        {message.analysis?.suggestedQuizzes && showQuizzes && (
          <div className="space-y-4 mt-4">
            {message.analysis.suggestedQuizzes.map((quiz, index) => (
              <div key={quiz.id}>
                <div className="text-sm text-muted-foreground mb-2">
                  Quiz {index + 1} sur {message.analysis.suggestedQuizzes!.length}
                </div>
                <QuizCard
                  quiz={quiz}
                  onComplete={(correct) => {
                    setQuizResults(prev => ({ ...prev, [quiz.id]: correct }));
                  }}
                />
              </div>
            ))}
            {Object.keys(quizResults).length === message.analysis.suggestedQuizzes.length && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="font-semibold text-success mb-2">
                  🎉 Félicitations ! Vous avez terminé tous les quiz !
                </p>
                <p className="text-sm text-muted-foreground">
                  Score: {Object.values(quizResults).filter(Boolean).length} / {message.analysis.suggestedQuizzes.length} bonnes réponses
                </p>
              </div>
            )}
          </div>
        )}

        {/* Attachments Preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, i) => (
              <div
                key={i}
                className="px-3 py-1.5 bg-secondary rounded-lg text-sm flex items-center gap-2"
              >
                {att.type === 'image' && '🖼️'}
                {att.type === 'link' && '🔗'}
                {att.type === 'text' && '📄'}
                <span className="truncate max-w-[200px]">{att.name || att.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
