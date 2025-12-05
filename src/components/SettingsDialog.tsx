import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useChatStore } from '@/store/chatStore';
import { Eye, Accessibility, Shield, Info } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { userSettings, updateSettings } = useChatStore();

  const handleAccessibilityChange = (key: keyof typeof userSettings.accessibility, value: boolean) => {
    updateSettings({
      accessibility: { ...userSettings.accessibility, [key]: value },
    });
  };

  const handleDisplayChange = (key: keyof typeof userSettings.display, value: boolean) => {
    updateSettings({
      display: { ...userSettings.display, [key]: value },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Paramètres NIRD FakeCheck
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Accessibility Section */}
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
              <Accessibility className="w-4 h-4 text-primary" />
              Accessibilité
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexia" className="flex flex-col gap-1">
                  <span>Police Dyslexie</span>
                  <span className="text-xs text-muted-foreground">
                    Utilise une police adaptée pour la dyslexie
                  </span>
                </Label>
                <Switch
                  id="dyslexia"
                  checked={userSettings.accessibility.dyslexiaFont}
                  onCheckedChange={(v) => handleAccessibilityChange('dyslexiaFont', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast" className="flex flex-col gap-1">
                  <span>Contraste Élevé</span>
                  <span className="text-xs text-muted-foreground">
                    Augmente le contraste des couleurs
                  </span>
                </Label>
                <Switch
                  id="contrast"
                  checked={userSettings.accessibility.highContrast}
                  onCheckedChange={(v) => handleAccessibilityChange('highContrast', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tts" className="flex flex-col gap-1">
                  <span>Synthèse Vocale</span>
                  <span className="text-xs text-muted-foreground">
                    Lit les réponses à voix haute
                  </span>
                </Label>
                <Switch
                  id="tts"
                  checked={userSettings.accessibility.textToSpeech}
                  onCheckedChange={(v) => handleAccessibilityChange('textToSpeech', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="motion" className="flex flex-col gap-1">
                  <span>Réduire les Animations</span>
                  <span className="text-xs text-muted-foreground">
                    Désactive les animations non essentielles
                  </span>
                </Label>
                <Switch
                  id="motion"
                  checked={userSettings.accessibility.reducedMotion}
                  onCheckedChange={(v) => handleAccessibilityChange('reducedMotion', v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Display Section */}
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-primary" />
              Affichage
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dualview" className="flex flex-col gap-1">
                  <span>Vue Double</span>
                  <span className="text-xs text-muted-foreground">
                    Affiche l'analyse factuelle et pédagogique côte à côte
                  </span>
                </Label>
                <Switch
                  id="dualview"
                  checked={userSettings.display.dualView}
                  onCheckedChange={(v) => handleDisplayChange('dualView', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sources" className="flex flex-col gap-1">
                  <span>Afficher les Sources</span>
                  <span className="text-xs text-muted-foreground">
                    Montre les sources utilisées pour la vérification
                  </span>
                </Label>
                <Switch
                  id="sources"
                  checked={userSettings.display.showSources}
                  onCheckedChange={(v) => handleDisplayChange('showSources', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="detailed" className="flex flex-col gap-1">
                  <span>Analyse Détaillée</span>
                  <span className="text-xs text-muted-foreground">
                    Affiche une analyse approfondie des éléments
                  </span>
                </Label>
                <Switch
                  id="detailed"
                  checked={userSettings.display.detailedAnalysis}
                  onCheckedChange={(v) => handleDisplayChange('detailedAnalysis', v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Info Section */}
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Valeurs NIRD</p>
                <ul className="space-y-1">
                  <li>🔒 Aucune donnée personnelle stockée</li>
                  <li>🌍 Engagement pour la souveraineté numérique</li>
                  <li>♿ Accessibilité pour tous</li>
                  <li>🌱 Durabilité et responsabilité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
