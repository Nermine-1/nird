import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  Shield,
  Lock,
  Globe,
  Settings,
  ChevronLeft,
  Trash2,
  Search,
  BookOpen,
  Terminal,
  Users,
  Info,
  AlertCircle,
  GraduationCap,
  LogOut,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { ChatCategory } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const categoryIcons: Record<ChatCategory, React.ReactNode> = {
  'fake-news-linux': <Terminal className="w-4 h-4" />,
  'fake-news-opensource': <Globe className="w-4 h-4" />,
  'cybersecurity': <Shield className="w-4 h-4" />,
  'privacy': <Lock className="w-4 h-4" />,
  'digital-culture': <BookOpen className="w-4 h-4" />,
  'general': <MessageSquare className="w-4 h-4" />,
};

const categoryLabels: Record<ChatCategory, string> = {
  'fake-news-linux': 'Fake News Linux',
  'fake-news-opensource': 'Fake News Open Source',
  'cybersecurity': 'Cybersécurité',
  'privacy': 'Vie Privée',
  'digital-culture': 'Culture Numérique',
  'general': 'Général',
};

interface SidebarProps {
  onOpenSettings: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const navigate = useNavigate();
  const {
    chats,
    activeChat,
    sidebarOpen,
    createChat,
    setActiveChat,
    deleteChat,
    toggleSidebar,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | 'all'>('all');

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || chat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (ChatCategory | 'all')[] = [
    'all',
    'fake-news-linux',
    'fake-news-opensource',
    'cybersecurity',
    'privacy',
    'digital-culture',
    'general',
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Logo size={32} className="animate-float" />
            <div>
              <span className="font-semibold text-sidebar-foreground">NIRD FakeCheck</span>
              <div className="text-xs text-sidebar-foreground/70">
                Vérification de contenu
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={() => createChat()}
          className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white border-0 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-sidebar-accent border-sidebar-border"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Tous' : categoryLabels[cat].split(' ')[0]}
            </Button>
          ))}
        </div>
      </div >

      {/* Chat List */}
      < ScrollArea className="flex-1 px-1" >
        <div className="space-y-1 py-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 text-sm",
                activeChat === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70"
              )}
              onClick={() => setActiveChat(chat.id)}
            >
              <span className="text-sidebar-foreground/60 flex-shrink-0">
                {categoryIcons[chat.category]}
              </span>
              <span className="flex-1 truncate text-sidebar-foreground">{chat.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 hover:bg-sidebar-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="w-3 h-3 text-sidebar-foreground/60 hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea >

      {/* Footer */}
      < div className="p-4 border-t border-sidebar-border space-y-2" >
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={onOpenSettings}
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Données chiffrées et sécurisées
        </p>
      </div >
    </aside >
  );
}
