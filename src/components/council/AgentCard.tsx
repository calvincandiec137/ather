import { Agent } from '@/types/council';
import { AgentIcon } from './AgentIcon';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const isThinking = agent.status === 'thinking';
  const isComplete = agent.status === 'complete';
  const isPro = agent.team === 'pro';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "agent-card min-h-[160px] flex flex-col transition-all duration-400",
        `agent-card-${agent.id}`,
        isThinking && 'agent-active'
      )}
    >
      {/* Subtle sheen effect */}
      <div className="water-highlight" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <AgentIcon agentId={agent.id} status={agent.status} />
          <div>
            <span className={cn(
              "font-semibold text-sm",
              agent.id === 'alpha' && 'text-agent-alpha',
              agent.id === 'beta' && 'text-agent-beta',
              agent.id === 'gamma' && 'text-agent-gamma',
              agent.id === 'delta' && 'text-agent-delta',
            )}>
              {agent.name}
            </span>
            <span className={cn(
              "ml-2 status-text",
              isPro ? "text-team-pro/60" : "text-team-con/60"
            )}>
              {isPro ? 'PRO' : 'CON'}
            </span>
          </div>
        </div>
        
        {isComplete && agent.confidence && (
          <span className="text-xs text-muted-foreground font-mono">
            {agent.confidence.toFixed(0)}%
          </span>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="mb-3 relative z-10">
        {isThinking ? (
          <span className="status-text text-primary animate-pulse">
            ANALYZING
          </span>
        ) : isComplete ? (
          <span className="status-text text-agent-gamma">
            COMPLETE
          </span>
        ) : (
          <span className="status-text text-muted-foreground">
            STANDBY
          </span>
        )}
      </div>
      
      {/* Reasoning content */}
      <div className="flex-1 relative z-10">
        {agent.reasoning ? (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {agent.reasoning}
            {isThinking && <span className="typing-cursor" />}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/50 italic">
            Awaiting input...
          </p>
        )}
      </div>
    </motion.div>
  );
}
