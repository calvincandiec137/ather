import { SessionPhase } from '@/types/council';
import { Scale, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FinalVerdictProps {
  phase: SessionPhase;
  verdict: string | null;
}

export function FinalVerdict({ phase, verdict }: FinalVerdictProps) {
  const isWaiting = phase === 'idle' || phase === 'analyzing' || phase === 'debating';
  const isSynthesizing = phase === 'synthesizing';
  const isComplete = phase === 'complete';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="verdict-panel p-5"
    >
      <div className="water-highlight" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Scale className={cn(
            "w-5 h-5",
            isComplete ? 'text-agent-gamma' : 'text-muted-foreground'
          )} />
          <h3 className="font-semibold text-foreground status-text">FINAL VERDICT</h3>
        </div>
        
        {/* Content */}
        <div className="min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isWaiting && (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <Scale className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Awaiting council deliberation...</p>
              </motion.div>
            )}
            
            {isSynthesizing && (
              <motion.div 
                key="synthesizing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
                </div>
                <p className="text-primary status-text">SYNTHESIZING VERDICT</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Consolidating council insights...
                </p>
              </motion.div>
            )}
            
            {isComplete && verdict && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="prose prose-sm max-w-none">
                  {verdict.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h4 key={i} className="text-primary font-semibold mt-4 mb-2 text-sm">
                          {line.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="text-muted-foreground text-sm ml-4 list-disc">
                          {line.substring(2)}
                        </li>
                      );
                    }
                    if (line.trim()) {
                      return (
                        <p key={i} className="text-foreground/80 text-sm mb-2">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
