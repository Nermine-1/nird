import { useState, useMemo } from 'react';
import { BarChart3, Cloud, Clock, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';

interface VisualizationsPanelProps {
  open: boolean;
  onClose: () => void;
}

// Function to calculate real statistics from chat data
function calculateStatistics(chats: any[]) {
  const wordCount: Record<string, { count: number; problematic: boolean }> = {};
  const monthlyScores: Record<string, number[]> = {};
  const sourceStats: Record<string, { reliable: number; unreliable: number }> = {
    'Sources officielles': { reliable: 0, unreliable: 0 },
    'Médias': { reliable: 0, unreliable: 0 },
    'Forums': { reliable: 0, unreliable: 0 },
    'Réseaux sociaux': { reliable: 0, unreliable: 0 },
  };

  // Problematic words (could be expanded with AI analysis)
  const problematicWords = ['virus', 'dangereux', 'piratage', 'hacker', 'fake', 'arnaque', 'danger', 'menace'];

  chats.forEach(chat => {
    chat.messages.forEach((message: any) => {
      if (message.analysis) {
        const analysis = message.analysis;
        const month = message.timestamp.toISOString().slice(0, 7); // YYYY-MM

        // Timeline data
        if (!monthlyScores[month]) monthlyScores[month] = [];
        monthlyScores[month].push(analysis.score);

        // Source comparison
        analysis.sources.forEach((source: any) => {
          let category = 'Médias';
          if (source.type === 'official') category = 'Sources officielles';
          else if (source.type === 'community') category = 'Forums';
          else if (source.reliability === 'low') category = 'Réseaux sociaux';

          if (source.reliability === 'high') {
            sourceStats[category].reliable++;
          } else {
            sourceStats[category].unreliable++;
          }
        });
      }

      // Word cloud from message content
      const words = message.content.toLowerCase().split(/\s+/);
      words.forEach((word: string) => {
        word = word.replace(/[^\w]/g, '');
        if (word.length > 3) {
          if (!wordCount[word]) {
            wordCount[word] = { count: 0, problematic: problematicWords.includes(word) };
          }
          wordCount[word].count++;
        }
      });
    });
  });

  // Convert to display format
  const wordCloudData = Object.entries(wordCount)
    .sort(([, a], [, b]) => (b as any).count - (a as any).count)
    .slice(0, 20)
    .map(([word, data]) => ({
      word,
      weight: Math.min(100, (data as any).count * 5),
      problematic: (data as any).problematic
    }));

  const timelineData = Object.entries(monthlyScores)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }));

  const sourceComparison = Object.entries(sourceStats).map(([name, stats]) => ({
    name,
    reliable: stats.reliable,
    unreliable: stats.unreliable
  }));

  return { wordCloudData, timelineData, sourceComparison };
}

export function VisualizationsPanel({ open, onClose }: VisualizationsPanelProps) {
  const { chats } = useChatStore();

  const { wordCloudData, timelineData, sourceComparison } = useMemo(() =>
    calculateStatistics(chats), [chats]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-elevated animate-slide-up human-touch">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Visualisations & Statistiques
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <Tabs defaultValue="wordcloud" className="p-4">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="wordcloud" className="gap-2">
              <Cloud className="w-4 h-4" />
              Nuage de mots
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="w-4 h-4" />
              Évolution
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Sources
            </TabsTrigger>
          </TabsList>

          {/* Word Cloud */}
          <TabsContent value="wordcloud" className="mt-0">
            <div className="glass-card p-6 min-h-[300px]">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {wordCloudData.map((item, i) => (
                  <span
                    key={i}
                    className={cn(
                      "transition-all hover:scale-110 cursor-default",
                      item.problematic ? "text-destructive" : "text-primary"
                    )}
                    style={{
                      fontSize: `${Math.max(14, item.weight / 4)}px`,
                      opacity: 0.5 + (item.weight / 200),
                    }}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Termes neutres</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Termes problématiques</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-0">
            <div className="glass-card p-6">
              <h4 className="text-sm text-muted-foreground mb-4">Score de fiabilité dans le temps</h4>
              <div className="h-[250px] flex items-end gap-4">
                {timelineData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all hover:opacity-80",
                        item.score >= 80 ? "bg-success" :
                        item.score >= 60 ? "bg-warning" : "bg-destructive"
                      )}
                      style={{ height: `${item.score * 2}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                    <span className="text-sm font-medium">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sources Comparison */}
          <TabsContent value="sources" className="mt-0">
            <div className="glass-card p-6">
              <h4 className="text-sm text-muted-foreground mb-4">Comparaison des sources</h4>
              <div className="space-y-4">
                {sourceComparison.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">
                        {item.reliable} fiables / {item.unreliable} douteuses
                      </span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="bg-success h-full transition-all"
                        style={{ width: `${(item.reliable / (item.reliable + item.unreliable)) * 100}%` }}
                      />
                      <div
                        className="bg-destructive h-full transition-all"
                        style={{ width: `${(item.unreliable / (item.reliable + item.unreliable)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-muted-foreground">Sources fiables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Sources douteuses</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
