import { GraduationCap, BookOpen, Target, Award, Users, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';

export function EducationalHeader() {
  const { isAuthenticated, user } = useChatStore();

  const currentTime = new Date();
  const hour = currentTime.getHours();
  let greeting = "Bonjour";
  let motivationalMessage = "Prêt à développer ton esprit critique ?";

  if (hour >= 18) {
    greeting = "Bonsoir";
    motivationalMessage = "Continue ton apprentissage !";
  } else if (hour >= 12) {
    greeting = "Bon après-midi";
    motivationalMessage = "Bonne continuation dans tes apprentissages !";
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-success/10 border-b border-primary/20 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - Educational branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NIRD FakeCheck
                </h1>
                <p className="text-sm text-muted-foreground">
                  Plateforme d'apprentissage de la vérification des faits
                </p>
              </div>
            </div>

            {/* Educational badges */}
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Esprit Critique
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <Target className="w-3 h-3 mr-1" />
                Vérification
              </Badge>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Award className="w-3 h-3 mr-1" />
                Certification
              </Badge>
            </div>
          </div>

          {/* Right side - User info and greeting */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {greeting}, {user.name} !
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'teacher' ? '👨‍🏫 Enseignant' : '👨‍🎓 Élève'} • {motivationalMessage}
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm font-medium">{greeting} !</p>
                <p className="text-xs text-muted-foreground">
                  {motivationalMessage}
                </p>
              </div>
            )}

            {/* Educational quick actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Lightbulb className="w-4 h-4 mr-2" />
                Aide
              </Button>
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Users className="w-4 h-4 mr-2" />
                  Communauté
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Educational progress bar */}
        {isAuthenticated && (
          <div className="mt-4 pt-4 border-t border-primary/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression quotidienne</span>
              <span className="font-medium text-primary">3/5 objectifs atteints</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}