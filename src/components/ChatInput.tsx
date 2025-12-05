import { useState, useRef, useCallback } from 'react';
import { Send, Plus, FileText, Sparkles, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';
import { Attachment } from '@/types/chat';

interface ChatInputProps {
  onSubmit: (content: string, attachments?: Attachment[]) => void;
  onAnalyze: (content: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, onAnalyze, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Unified theme colors
  const themeColors = {
    gradient: 'from-purple-500 to-pink-500',
    hover: 'hover:from-purple-600 hover:to-pink-600',
    icon: 'text-purple-500',
  };

  const handleSubmit = () => {
    if (!input.trim() && attachments.length === 0) return;
    onSubmit(input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleAnalyze = () => {
    if (!input.trim() && attachments.length === 0) return;
    onAnalyze(input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const addPDFAttachment = () => {
    document.getElementById('pdf-upload')?.click();
  };

  const addTwitterAttachment = () => {
    const url = prompt('Entrez l\'URL du tweet à analyser :');
    if (url) {
      setAttachments([...attachments, {
        type: 'link',
        content: url,
        name: '🐦 ' + url.slice(0, 40) + '...'
      }]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((att, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm group transition-all duration-200",
                "bg-gradient-to-r", themeColors.gradient,
                "text-white shadow-md hover:shadow-lg transform hover:scale-105"
              )}
            >
              {att.type === 'pdf' && <FileText className="w-4 h-4" />}
              {att.type === 'link' && <Twitter className="w-4 h-4" />}
              {att.type === 'text' && <FileText className="w-4 h-4" />}
              <span className="truncate max-w-[150px] font-medium">{att.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="ml-1 opacity-80 hover:opacity-100 transition-opacity text-white hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        {/* Analysis Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "shrink-0 rounded-full transition-all duration-300",
                "hover:scale-110 hover:rotate-90",
                "bg-gradient-to-r", themeColors.gradient, themeColors.hover,
                "text-white shadow-md hover:shadow-lg"
              )}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl"
          >
            <DropdownMenuItem
              onClick={addPDFAttachment}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 group"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                "bg-gradient-to-br", themeColors.gradient,
                "group-hover:scale-110 group-hover:rotate-3"
              )}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Analyser un PDF</div>
                <div className="text-xs text-muted-foreground">Télécharger un document</div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={addTwitterAttachment}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 group"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "group-hover:scale-110 group-hover:rotate-3"
              )}>
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Analyser Twitter</div>
                <div className="text-xs text-muted-foreground">Vérifier un tweet</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          id="pdf-upload"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setAttachments([...attachments, {
                  type: 'pdf',
                  content: reader.result as string,
                  name: '📄 ' + file.name
                }]);
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Text Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question ou utilisez le bouton + pour analyser du contenu..."
            className="min-h-[52px] max-h-[200px] resize-none pr-12 bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm transition-all duration-200"
            disabled={disabled}
            rows={1}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={disabled || (!input.trim() && attachments.length === 0)}
            className={cn(
              "gap-2 rounded-xl transition-all duration-200 hover:scale-105",
              "border-2",
              (!input.trim() && attachments.length === 0) ? "" : cn("bg-gradient-to-r", themeColors.gradient, "text-white border-transparent hover:shadow-lg")
            )}
          >
            <Sparkles className="w-4 h-4" />
            Analyser
          </Button>

          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={disabled || (!input.trim() && attachments.length === 0)}
            className="gap-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Send className="w-4 h-4" />
            Envoyer
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground mt-3 text-center flex items-center justify-center gap-2">
        <span className={cn("inline-block w-2 h-2 rounded-full animate-pulse bg-gradient-to-r", themeColors.gradient)}></span>
        Cliquez sur <span className={cn("inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r", themeColors.gradient, "text-white text-xs")}>+</span> pour analyser un PDF ou un tweet
      </p>
    </div>
  );
}
