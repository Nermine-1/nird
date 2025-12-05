import { create } from 'zustand';
import { Chat, Message, UserSettings, ChatCategory, UserMode, AnalysisResult } from '@/types/chat';

interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  name: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  userSettings: UserSettings;
  sidebarOpen: boolean;
  dualViewOpen: boolean;
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  createChat: (category?: ChatCategory) => string;
  deleteChat: (id: string) => void;
  setActiveChat: (id: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleSidebar: () => void;
  toggleDualView: () => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setUserMode: (mode: UserMode) => void;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<boolean>;
  logout: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultSettings: UserSettings = {
  mode: 'student',
  accessibility: {
    dyslexiaFont: false,
    highContrast: false,
    textToSpeech: false,
    reducedMotion: false,
  },
  display: {
    dualView: true,
    showSources: true,
    detailedAnalysis: true,
  },
};

const initialChats: Chat[] = [
  {
    id: generateId(),
    title: 'Nouvelle conversation',
    category: 'general',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultUser: User = {
  id: 'default-user',
  email: 'student@nird.com',
  role: 'student',
  name: 'Élève',
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: initialChats,
  activeChat: initialChats[0].id,
  userSettings: defaultSettings,
  sidebarOpen: true,
  dualViewOpen: false,
  currentAnalysis: null,
  isAnalyzing: false,
  user: defaultUser,
  isAuthenticated: true,

  createChat: (category: ChatCategory = 'general') => {
    const state = get();

    // Check if there's already an empty conversation (no user messages)
    const emptyChat = state.chats.find(chat =>
      chat.messages.length === 0 ||
      !chat.messages.some(msg => msg.role === 'user')
    );

    if (emptyChat) {
      // Switch to existing empty chat instead of creating new one
      set({ activeChat: emptyChat.id });
      return emptyChat.id;
    }

    // Create new chat only if no empty conversation exists
    const id = generateId();
    const newChat: Chat = {
      id,
      title: 'Nouvelle conversation',
      category,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChat: id,
    }));
    return id;
  },

  deleteChat: (id) => {
    set((state) => {
      const newChats = state.chats.filter((c) => c.id !== id);
      const newActive = state.activeChat === id
        ? (newChats[0]?.id || null)
        : state.activeChat;
      return { chats: newChats, activeChat: newActive };
    });
  },

  setActiveChat: (id) => set({ activeChat: id }),

  addMessage: (chatId, message) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date(),
            title: chat.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '')
              : chat.title,
          }
          : chat
      ),
    }));
  },

  updateSettings: (settings) => {
    set((state) => ({
      userSettings: { ...state.userSettings, ...settings },
    }));
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleDualView: () => set((state) => ({ dualViewOpen: !state.dualViewOpen })),

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis, dualViewOpen: analysis !== null }),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  setUserMode: (mode) => {
    set((state) => ({
      userSettings: { ...state.userSettings, mode },
    }));
  },

  login: async (email: string, password: string, role: 'teacher' | 'student') => {
    // Mock authentication - always returns true for now as we are in public mode
    const user: User = {
      id: generateId(),
      email,
      role,
      name: role === 'teacher' ? 'Enseignant' : 'Élève',
    };
    set({
      user,
      isAuthenticated: true,
      userSettings: { ...defaultSettings, mode: role },
    });
    return true;
  },

  logout: () => {
    // Reset to default user instead of null
    set({
      user: defaultUser,
      isAuthenticated: true,
      userSettings: defaultSettings,
      chats: initialChats,
      activeChat: initialChats[0].id,
    });
  },
}));
