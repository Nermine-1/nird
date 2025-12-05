import { useMemo } from 'react';
import { Trophy, Target, BookOpen, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';

export function LearningProgress() {
  const { chats, isAuthenticated } = useChatStore();

  const progressData = useMemo(() => {
    if (!isAuthenticated) return null;

    const userMessages = chats.flatMap(chat =>
      chat.messages.filter(msg => msg.role === 'user')
    );

    const analyses = chats.flatMap(chat =>
      chat.messages.filter(msg => msg.analysis)
    );

    const totalAnalyses = analyses.length;
    const averageScore = analyses.length > 0
      ? analyses.reduce((sum, msg) => sum + (msg.analysis?.score || 0), 0) / analyses.length
      : 0;

    // Calculate learning level based on activities
    const totalActivities = userMessages.length + totalAnalyses;
    const level = Math.min(Math.floor(totalActivities / 5) + 1, 10);

    // Achievements
    const achievements: Array<{ name: string; icon: string; description: string }> = [];
    if (totalAnalyses >= 1) achievements.push({ name: 'Premier pas', icon: '🎯', description: 'Première analyse réalisée' });
    if (totalAnalyses >= 5) achievements.push({ name: 'Détective', icon: '🔍', description: '5 analyses complétées' });
    if (averageScore >= 80) achievements.push({ name: 'Expert', icon: '⭐', description: 'Score moyen ≥ 80%' });
    if (level >= 5) achievements.push({ name: 'Maître', icon: '🏆', description: 'Niveau 5 atteint' });

    return {
      level,
      totalActivities,
      totalAnalyses,
      averageScore: Math.round(averageScore),
      achievements,
      nextLevelProgress: ((totalActivities % 5) / 5) * 100
    };
  }, [chats, isAuthenticated]);

  if (!progressData) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-primary" />
          Progression pédagogique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level and XP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">{progressData.level}</span>
            </div>
            <div>
              <p className="font-medium">Niveau {progressData.level}</p>
              <p className="text-sm text-muted-foreground">
                {progressData.totalActivities} activités complétées
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/20">
            <Star className="w-3 h-3 mr-1" />
            {progressData.averageScore}% précision
          </Badge>
        </div>

        {/* Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progrès vers niveau {progressData.level + 1}</span>
            <span>{Math.round(progressData.nextLevelProgress)}%</span>
          </div>
          <Progress value={progressData.nextLevelProgress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold text-primary">{progressData.totalAnalyses}</p>
            <p className="text-xs text-muted-foreground">Analyses</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Target className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-2xl font-bold text-accent">{progressData.totalActivities}</p>
            <p className="text-xs text-muted-foreground">Activités</p>
          </div>
        </div>

        {/* Achievements */}
        {progressData.achievements.length > 0 && (
          <div className="pt-2">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              Réalisations
            </h4>
            <div className="space-y-2">
              {progressData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-success/10 rounded-lg">
                  <span className="text-lg">{achievement.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning tips */}
        <div className="pt-2 border-t">
          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Conseil d'apprentissage</p>
              <p className="text-xs text-muted-foreground mt-1">
                Continuez à analyser différents types de contenu pour améliorer votre score de précision !
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}