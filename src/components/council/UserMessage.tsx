import { Message } from '@/types/council';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="chat-message chat-message-user"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {message.content}
          </p>
          
          {/* Extracted factors */}
          {message.factors && message.factors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.factors.map((factor) => (
                <span
                  key={factor.id}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs border border-primary/20"
                >
                  {factor.text}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
