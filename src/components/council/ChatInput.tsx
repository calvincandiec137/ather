import { useState, useRef, useEffect } from 'react';
import { Send,  Paperclip } from 'lucide-react'; // Removing FileText as it is unused
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface ChatInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onDocumentAdd: (text: string) => void;
}

export function ChatInput({ onSubmit, disabled, placeholder, onDocumentAdd }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    
    onSubmit(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Mock document upload
  const handleFileUpload = () => {
      const mockText = "This is context from an uploaded document that the council should consider.";
      onDocumentAdd(mockText);
      // In a real app, this would open a file picker
      alert("Simulated document upload: Context added to session.");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className={cn(
          "relative flex items-end gap-2 p-2 rounded-3xl transition-all duration-300",
          "glass-surface border border-white/20 bg-white/40 shadow-lg", // Updated for Muted Ocean Haze
          "focus-within:ring-2 focus-within:ring-primary/20",
          disabled && "opacity-50 pointer-events-none"
      )}>
        
        {/* Attachment Button */}
        <button
          type="button"
          onClick={handleFileUpload}
          className="p-3 text-muted-foreground/70 hover:text-primary hover:bg-white/50 rounded-full transition-colors shrink-0"
          title="Add Context/Document"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask the council..."}
          rows={1}
          className={cn(
            "flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 max-h-[200px]",
            "text-foreground placeholder:text-muted-foreground/60 text-sm font-medium leading-relaxed",
            "scrollbar-hide" // Assuming you have a utility for hiding scrollbars or it's fine
          )}
          style={{ outline: 'none' }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "p-3 rounded-2xl transition-all duration-300 shrink-0 mb-0.5",
            input.trim() && !disabled
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
              : "bg-muted/10 text-muted-foreground/40 cursor-not-allowed"
          )}
        >
          <Send className={cn("w-5 h-5", input.trim() && "ml-0.5")} />
        </button>
      </div>
      
      {/* Helper text or branding could go here */}
    </form>
  );
}
