import { DebateMessage } from '@/types/council';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface DebateMessageItemProps {
  message: DebateMessage;
}

export function DebateMessageItem({ message }: DebateMessageItemProps) {
  const isPro = message.team === 'pro';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "chat-message",
        isPro ? "chat-message-pro" : "chat-message-con"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Agent indicator */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
          isPro 
            ? "bg-team-pro/10 text-team-pro border border-team-pro/20" 
            : "bg-team-con/10 text-team-con border border-team-con/20"
        )}>
          {message.agentName.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn(
              "font-medium text-sm",
              isPro ? "text-team-pro" : "text-team-con"
            )}>
              {message.agentName}
            </span>
            <span className={cn(
              "status-text text-muted-foreground",
              isPro ? "text-team-pro/60" : "text-team-con/60"
            )}>
              {isPro ? 'PRO' : 'CON'}
            </span>
          </div>
          
          {/* Content */}
          {message.isTyping ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-sm status-text">ANALYZING</span>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
