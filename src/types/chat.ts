export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysis?: AnalysisResult;
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'image' | 'link' | 'text';
  content: string;
  name?: string;
}

export interface AnalysisResult {
  score: number;
  verdict: 'verified' | 'suspicious' | 'false' | 'unverified';
  factualElements: FactElement[];
  sources: Source[];
  pedagogicalExplanation: string;
  criticalThinkingSteps: string[];
  exercise?: Exercise;
  suggestedQuizzes?: Quiz[];
}

export interface FactElement {
  claim: string;
  status: 'true' | 'false' | 'partially-true' | 'unverifiable';
  explanation: string;
}

export interface Source {
  title: string;
  url: string;
  reliability: 'high' | 'medium' | 'low';
  type: 'official' | 'academic' | 'media' | 'community';
}

export interface Exercise {
  question: string;
  hints: string[];
  expectedApproach: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Chat {
  id: string;
  title: string;
  category: ChatCategory;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChatCategory = 
  | 'fake-news-linux'
  | 'fake-news-opensource'
  | 'cybersecurity'
  | 'privacy'
  | 'digital-culture'
  | 'general';

export type UserMode = 'student' | 'teacher';

export interface UserSettings {
  mode: UserMode;
  accessibility: {
    dyslexiaFont: boolean;
    highContrast: boolean;
    textToSpeech: boolean;
    reducedMotion: boolean;
  };
  display: {
    dualView: boolean;
    showSources: boolean;
    detailedAnalysis: boolean;
  };
}
