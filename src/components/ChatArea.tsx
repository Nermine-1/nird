import { useRef, useEffect } from 'react';
import { Menu, BarChart3, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/store/chatStore';
import { Attachment, AnalysisResult, Message } from '@/types/chat';

interface ChatAreaProps {
  onOpenVisualizations: () => void;
}

// Mock analysis function - in production this would call an API
const generateMockAnalysis = (): AnalysisResult => ({
  score: Math.floor(Math.random() * 40) + 60,
  verdict: Math.random() > 0.5 ? 'suspicious' : 'verified',
  factualElements: [
    {
      claim: 'Linux est un système d\'exploitation créé par Linus Torvalds',
      status: 'true',
      explanation: 'Confirmé par de nombreuses sources officielles et académiques.',
    },
    {
      claim: 'Linux est vulnérable aux virus comme Windows',
      status: 'partially-true',
      explanation: 'Linux peut être affecté par des malwares, mais sa structure le rend plus résistant.',
    },
    {
      claim: 'L\'open-source est moins sécurisé car le code est visible',
      status: 'false',
      explanation: 'Au contraire, la transparence permet une meilleure détection des failles.',
    },
  ],
  sources: [
    { title: 'Linux Foundation - Official Documentation', url: 'https://www.linuxfoundation.org/', reliability: 'high', type: 'official' },
    { title: 'Wikipedia - Linux Security', url: 'https://en.wikipedia.org/wiki/Linux_security', reliability: 'medium', type: 'community' },
    { title: 'CVE Details - Linux Vulnerabilities', url: 'https://www.cvedetails.com/', reliability: 'high', type: 'official' },
  ],
  pedagogicalExplanation: 'Cette affirmation contient des éléments partiellement vrais mélangés à des idées reçues. Il est important de distinguer les faits vérifiables des opinions ou généralisations. Linux, comme tout système, n\'est pas parfait, mais sa nature open-source lui confère des avantages en termes de sécurité et de transparence.',
  criticalThinkingSteps: [
    'Identifier la source originale de l\'information',
    'Vérifier si des experts du domaine confirment ces affirmations',
    'Rechercher des études ou statistiques officielles',
    'Comparer avec d\'autres sources indépendantes',
    'Distinguer les faits des opinions',
  ],
  exercise: {
    question: 'Comment vérifierais-tu l\'affirmation "Linux n\'a jamais eu de faille de sécurité" ?',
    hints: [
      'Consulte les bases de données de vulnérabilités',
      'Cherche des articles de sécurité informatique',
    ],
    expectedApproach: 'Rechercher dans les bases CVE et consulter les bulletins de sécurité officiels.',
  },
  suggestedQuizzes: [
    {
      id: '1',
      question: 'Quelle est la principale raison pour laquelle Linux est considéré plus sécurisé ?',
      options: [
        'Il n\'a jamais eu de virus',
        'Son code source est ouvert et peut être audité par tous',
        'Il est utilisé par moins de personnes',
        'Il bloque automatiquement tous les malwares'
      ],
      correctAnswer: 1,
      explanation: 'La transparence du code open-source permet à une communauté mondiale d\'experts de détecter et corriger rapidement les failles de sécurité.',
      difficulty: 'medium'
    },
    {
      id: '2',
      question: 'Comment peut-on vérifier la fiabilité d\'une information sur la sécurité informatique ?',
      options: [
        'Croire la première source trouvée',
        'Consulter uniquement les réseaux sociaux',
        'Croiser plusieurs sources officielles et académiques',
        'Se fier à son intuition'
      ],
      correctAnswer: 2,
      explanation: 'La vérification croisée de sources fiables (officielles, académiques, experts reconnus) est essentielle pour confirmer une information.',
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'Qu\'est-ce qu\'une base de données CVE ?',
      options: [
        'Un système d\'exploitation',
        'Une liste de vulnérabilités de sécurité connues',
        'Un antivirus pour Linux',
        'Un langage de programmation'
      ],
      correctAnswer: 1,
      explanation: 'CVE (Common Vulnerabilities and Exposures) est une base de données publique qui répertorie les vulnérabilités de sécurité connues dans les logiciels.',
      difficulty: 'hard'
    }
  ],
});

export function ChatArea({ onOpenVisualizations }: ChatAreaProps) {
  const {
    chats,
    activeChat,
    sidebarOpen,
    dualViewOpen,
    isAnalyzing,
    userSettings,
    isAuthenticated,
    toggleSidebar,
    toggleDualView,
    addMessage,
    setIsAnalyzing,
    setCurrentAnalysis,
  } = useChatStore();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find(c => c.id === activeChat);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  const handleSubmit = (content: string, attachments?: Attachment[]) => {
    if (!activeChat) return;

    // Add user message
    addMessage(activeChat, {
      role: 'user',
      content,
      attachments,
    });

    // Simulate AI response
    setTimeout(() => {
      const isTeacher = userSettings.mode === 'teacher';
      addMessage(activeChat, {
        role: 'assistant',
        content: isTeacher
          ? `🎓 **Analyse pédagogique** - Question élève : "${content.slice(0, 50)}..."

**Objectif d'apprentissage :** Développer l'esprit critique et la vérification des sources

**Approche pédagogique suggérée :**
1. **Questionnement initial** : Faire reformuler l'affirmation par les élèves
2. **Recherche documentaire** : Identifier les sources fiables
3. **Analyse comparative** : Comparer différentes perspectives
4. **Synthèse critique** : Tirer des conclusions argumentées

**Activité proposée :** Demandez aux élèves de trouver 3 sources différentes sur ce sujet et d'évaluer leur fiabilité.`
          : `🧠 **Exercice d'analyse critique** - Votre question : "${content.slice(0, 50)}..."

**Méthodologie de vérification :**
1. **Identifier la source** : Qui produit cette information ?
2. **Vérifier la date** : L'information est-elle récente et contextualisée ?
3. **Croiser les sources** : Plusieurs sources indépendantes confirment-elles ?
4. **Évaluer la logique** : L'argumentation est-elle cohérente ?

**Votre défi :** Essayez d'appliquer cette méthode à votre question. Quelles sources allez-vous consulter en premier ?`,
      });
    }, 1000);
  };

  const handleAnalyze = (content: string, attachments?: Attachment[]) => {
    if (!activeChat) return;

    // Add user message
    addMessage(activeChat, {
      role: 'user',
      content: `🔍 Analyse demandée: ${content}`,
      attachments,
    });

    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const analysis = generateMockAnalysis();
      
      addMessage(activeChat, {
        role: 'assistant',
        content: `J'ai analysé le contenu que vous avez soumis. Voici mon évaluation basée sur la méthode NIRD de vérification des faits.`,
        analysis,
      });

      if (userSettings.display.dualView) {
        setCurrentAnalysis(analysis);
      }
      
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen human-touch">
      {/* Header */}
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-accent">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="font-medium text-foreground text-base">
            {currentChat?.title || 'NIRD FakeCheck'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              variant={dualViewOpen ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleDualView}
              className="gap-2"
            >
              <Columns className="w-4 h-4" />
              Vue Double
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenVisualizations}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-4">
          {currentChat?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isAnalyzing && (
            <div className="flex gap-4 p-4 bg-card/50">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground animate-pulse">
                  Analyse en cours... Vérification des sources et des faits.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput 
        onSubmit={handleSubmit}
        onAnalyze={handleAnalyze}
        disabled={isAnalyzing}
      />
    </div>
  );
}
