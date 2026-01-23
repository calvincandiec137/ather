import { RefObject } from 'react';
import { Message, DebateMessage, SessionPhase } from '@/types/council';
import { UserMessage } from './UserMessage';
import { DebateMessageItem } from './DebateMessageItem';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface ChatHistoryProps {
  messages: Message[];
  debateMessages: DebateMessage[];
  phase: SessionPhase;
  containerRef: RefObject<HTMLDivElement>;
}

export function ChatHistory({ messages, debateMessages, phase, containerRef }: ChatHistoryProps) {
  const isActive = phase !== 'idle';
  
  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-2 py-4 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {/* Render user messages */}
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message.role === 'user' && <UserMessage message={message} />}
            {message.role === 'council' && (
              <div className="flex gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xs font-bold">AC</span>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                   <h4 className="font-semibold text-sm text-foreground">Council Verdict</h4>
                   <MarkdownRenderer content={message.content} className="text-sm prose-p:leading-normal bg-transparent" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Debate section header */}
        {isActive && debateMessages.length > 0 && (
          <motion.div
            key="debate-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 py-3"
          >
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="status-text text-muted-foreground">COUNCIL DEBATE</span>
            </div>
            <div className="h-px flex-1 bg-border" />
          </motion.div>
        )}
        
        {/* Debate messages in thread format */}
        {debateMessages.map((message) => (
          <DebateMessageItem key={message.id} message={message} />
        ))}
      </AnimatePresence>
      
      {/* Empty state */}
      {messages.length === 0 && debateMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Start a Council Session</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Submit a query to begin. The AI Council will analyze your input through 
            a structured Pro vs Con debate before synthesizing a verdict.
          </p>
        </div>
      )}
    </div>
  );
}
