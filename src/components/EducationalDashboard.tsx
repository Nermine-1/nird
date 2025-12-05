import { useState } from 'react';
import {
  BookOpen,
  Target,
  TrendingUp,
  Award,
  PlayCircle,
  CheckCircle,
  Clock,
  Star,
  Lightbulb,
  Shield,
  Search,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatStore } from '@/store/chatStore';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  completed: boolean;
  progress: number;
}

export function EducationalDashboard() {
  const { isAuthenticated, userSettings } = useChatStore();
  const [activeTab, setActiveTab] = useState('modules');

  const learningModules: LearningModule[] = [
    {
      id: 'basics',
      title: 'Les Bases de la Vérification',
      description: 'Apprendre à identifier les sources fiables et les signes de désinformation',
      icon: <Shield className="w-5 h-5" />,
      difficulty: 'beginner',
      duration: '15 min',
      completed: true,
      progress: 100
    },
    {
      id: 'sources',
      title: 'Analyse des Sources',
      description: 'Comment évaluer la crédibilité d\'une source d\'information',
      icon: <Search className="w-5 h-5" />,
      difficulty: 'intermediate',
      duration: '20 min',
      completed: false,
      progress: 75
    },
    {
      id: 'fact-checking',
      title: 'Vérification des Faits',
      description: 'Techniques avancées de vérification et de contre-vérification',
      icon: <CheckCircle className="w-5 h-5" />,
      difficulty: 'advanced',
      duration: '25 min',
      completed: false,
      progress: 30
    }
  ];

  const quickActions = [
    {
      title: 'Nouvelle Analyse',
      description: 'Analyser un contenu suspect',
      icon: <Target className="w-5 h-5" />,
      action: 'analyze',
      color: 'bg-primary'
    },
    {
      title: 'Exercice Pratique',
      description: 'S\'entraîner avec des cas réels',
      icon: <PlayCircle className="w-5 h-5" />,
      action: 'exercise',
      color: 'bg-accent'
    },
    {
      title: 'Voir Statistiques',
      description: 'Suivre sa progression',
      icon: <TrendingUp className="w-5 h-5" />,
      action: 'stats',
      color: 'bg-success'
    }
  ];

  const recentActivities = [
    { type: 'analysis', title: 'Analyse d\'un article sur l\'IA', time: '2h ago', score: 85 },
    { type: 'exercise', title: 'Exercice: Fake News Detection', time: '1j ago', score: 92 },
    { type: 'module', title: 'Module: Les Bases terminé', time: '2j ago', score: 100 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bienvenue sur NIRD FakeCheck</h3>
            <p className="text-muted-foreground mb-6">
              Connectez-vous pour accéder à tous les modules d'apprentissage et suivre votre progression pédagogique.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Se connecter pour apprendre
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-success/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {userSettings.mode === 'teacher' ? '👨‍🏫 Espace Enseignant' : '👨‍🎓 Espace Élève'}
              </h2>
              <p className="text-muted-foreground">
                Continue ton parcours d'apprentissage de l'esprit critique
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Niveau 3</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                <Award className="w-3 h-3 mr-1" />
                245 points
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button size="sm" className="w-full">
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Modules de Cours</TabsTrigger>
          <TabsTrigger value="activities">Activités Récentes</TabsTrigger>
          <TabsTrigger value="achievements">Réalisations</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          {learningModules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{module.title}</h3>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty === 'beginner' ? 'Débutant' :
                           module.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </Badge>
                        {module.completed && (
                          <Badge className="bg-success/10 text-success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terminé
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{module.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <Button variant={module.completed ? "secondary" : "default"}>
                    {module.completed ? 'Revoir' : 'Continuer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === 'analysis' && <Target className="w-4 h-4 text-primary" />}
                        {activity.type === 'exercise' && <PlayCircle className="w-4 h-4 text-accent" />}
                        {activity.type === 'module' && <BookOpen className="w-4 h-4 text-success" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {activity.score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Premier Pas', description: 'Première analyse réalisée', icon: '🎯', unlocked: true },
              { name: 'Détective', description: '5 analyses complétées', icon: '🔍', unlocked: true },
              { name: 'Expert', description: 'Score moyen ≥ 80%', icon: '⭐', unlocked: true },
              { name: 'Maître', description: 'Niveau 5 atteint', icon: '🏆', unlocked: false },
              { name: 'Mentor', description: 'Aider 10 autres apprenants', icon: '🤝', unlocked: false },
              { name: 'Visionnaire', description: 'Analyser 100 contenus', icon: '👁️', unlocked: false }
            ].map((achievement, index) => (
              <Card key={index} className={`transition-all ${achievement.unlocked ? 'bg-success/5 border-success/20' : 'opacity-60'}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-2 bg-success/10 text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Débloqué
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}