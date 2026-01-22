import { cn } from '@/lib/utils';
import { AgentId, AgentStatus } from '@/types/council';

interface AgentIconProps {
  agentId: AgentId;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

const agentConfig: Record<AgentId, { icon: string }> = {
  alpha: { icon: '✦' },
  beta: { icon: '⬡' },
  gamma: { icon: '◎' },
  delta: { icon: '⚡' },
};

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function AgentIcon({ agentId, status, size = 'md', showPulse = true }: AgentIconProps) {
  const config = agentConfig[agentId];
  const isThinking = status === 'thinking';
  const isComplete = status === 'complete';
  
  return (
    <div className="relative">
      {/* Pulsing rings when thinking */}
      {isThinking && showPulse && (
        <>
          <div 
            className={cn(
              "pulse-ring inset-0",
              agentId === 'alpha' && 'bg-agent-alpha/30',
              agentId === 'beta' && 'bg-agent-beta/30',
              agentId === 'gamma' && 'bg-agent-gamma/30',
              agentId === 'delta' && 'bg-agent-delta/30',
              sizeClasses[size]
            )}
            style={{ animationDelay: '0s' }}
          />
          <div 
            className={cn(
              "pulse-ring inset-0",
              agentId === 'alpha' && 'bg-agent-alpha/20',
              agentId === 'beta' && 'bg-agent-beta/20',
              agentId === 'gamma' && 'bg-agent-gamma/20',
              agentId === 'delta' && 'bg-agent-delta/20',
              sizeClasses[size]
            )}
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}
      
      {/* Icon container */}
      <div 
        className={cn(
          "relative rounded-lg flex items-center justify-center transition-all duration-300 border",
          sizeClasses[size],
          agentId === 'alpha' && 'bg-agent-alpha/10 border-agent-alpha/20 text-agent-alpha',
          agentId === 'beta' && 'bg-agent-beta/10 border-agent-beta/20 text-agent-beta',
          agentId === 'gamma' && 'bg-agent-gamma/10 border-agent-gamma/20 text-agent-gamma',
          agentId === 'delta' && 'bg-agent-delta/10 border-agent-delta/20 text-agent-delta',
          isThinking && 'shadow-lg',
          isComplete && 'opacity-100',
          status === 'idle' && 'opacity-50',
        )}
      >
        <span className="relative z-10">{config.icon}</span>
      </div>
    </div>
  );
}
