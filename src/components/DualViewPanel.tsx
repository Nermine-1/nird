import { X, CheckCircle, XCircle, AlertTriangle, ExternalLink, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';

export function DualViewPanel() {
  const { currentAnalysis, dualViewOpen, setCurrentAnalysis } = useChatStore();

  if (!dualViewOpen || !currentAnalysis) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'true':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'false':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'partially-true':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high':
        return 'bg-success/20 text-success border-success/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  return (
    <div className="w-[480px] border-l border-border bg-card/50 backdrop-blur-xl flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Analyse Détaillée</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentAnalysis(null)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="factual" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-2">
          <TabsTrigger value="factual">Analyse Factuelle</TabsTrigger>
          <TabsTrigger value="pedagogical">Pédagogie</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Factual Analysis Tab */}
          <TabsContent value="factual" className="p-4 space-y-6 mt-0">
            {/* Score Overview */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Score de fiabilité</span>
                <span className={cn(
                  "text-3xl font-bold",
                  currentAnalysis.score >= 80 ? "text-success" :
                  currentAnalysis.score >= 50 ? "text-warning" : "text-destructive"
                )}>
                  {currentAnalysis.score}%
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    currentAnalysis.score >= 80 ? "bg-success" :
                    currentAnalysis.score >= 50 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${currentAnalysis.score}%` }}
                />
              </div>
            </div>

            {/* Fact Elements */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Éléments vérifiés
              </h3>
              <div className="space-y-3">
                {currentAnalysis.factualElements.map((element, i) => (
                  <div key={i} className="glass-card p-3">
                    <div className="flex items-start gap-2">
                      {getStatusIcon(element.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{element.claim}</p>
                        <p className="text-xs text-muted-foreground mt-1">{element.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Sources consultées
              </h3>
              <div className="space-y-2">
                {currentAnalysis.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full border",
                      getReliabilityColor(source.reliability)
                    )}>
                      {source.reliability === 'high' ? 'Fiable' :
                       source.reliability === 'medium' ? 'Moyen' : 'Faible'}
                    </span>
                    <span className="flex-1 text-sm truncate">{source.title}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pedagogical Tab */}
          <TabsContent value="pedagogical" className="p-4 space-y-6 mt-0">
            {/* Explanation */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-foreground">Explication pédagogique</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentAnalysis.pedagogicalExplanation}
              </p>
            </div>

            {/* Critical Thinking Steps */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Méthode NIRD - Comment vérifier
              </h3>
              <div className="space-y-2">
                {currentAnalysis.criticalThinkingSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Exercise */}
            {currentAnalysis.exercise && (
              <div className="glass-card p-4 border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-medium text-foreground">À toi de jouer !</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {currentAnalysis.exercise.question}
                </p>
                <div className="space-y-2">
                  {currentAnalysis.exercise.hints.map((hint, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lightbulb className="w-3 h-3 text-warning" />
                      <span>Indice : {hint}</span>
                    </div>
                  ))}
                </div>
                <Button variant="accent" className="w-full mt-4" size="sm">
                  Soumettre ma réponse
                </Button>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
