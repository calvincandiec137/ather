import { Agent, SessionPhase } from '@/types/council';
import { AgentIcon } from './AgentIcon';
import { cn } from '@/lib/utils';

interface CouncilStatusBarProps {
  agents: Agent[];
  phase: SessionPhase;
}

export function CouncilStatusBar({ agents, phase }: CouncilStatusBarProps) {
  const phaseLabels: Record<SessionPhase, string> = {
    idle: 'READY',
    analyzing: 'ANALYZING',
    debating: 'DEBATING',
    synthesizing: 'SYNTHESIZING',
    complete: 'COMPLETE',
  };

  const proAgents = agents.filter(a => a.team === 'pro');
  const conAgents = agents.filter(a => a.team === 'con');

  return (
    <div className="glass-surface p-6">
      <div className="water-highlight" />
      
      <div className="relative z-10 flex items-center justify-between">
        {/* Phase indicator */}
        <div className="flex items-center gap-4">
          {/* 
             Logic for status dot:
             - Processing (analyzing/debating/synthesizing): Yellow + Blink + Glow
             - Complete: Green + Permanent Glow
             - Idle: Muted
          */}
          <div className={cn(
            "w-4 h-4 rounded-full transition-all duration-500", // Increased size from w-2.5 h-2.5
            phase === 'idle' && 'bg-muted-foreground',
            (phase === 'analyzing' || phase === 'debating' || phase === 'synthesizing') && 'bg-yellow-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.8)]', // Increased glow
            phase === 'complete' && 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]', // Increased glow
          )} />
          <span className="status-text text-foreground text-lg"> {/* Increased text size */}
            {phaseLabels[phase]}
          </span>
        </div>
        
        {/* Agent status with Pro/Con grouping */}
        <div className="flex items-center gap-8"> {/* Increased gap */}
          {/* Pro Team */}
          <div className="flex items-center gap-4">
            <span className="status-text text-team-pro/70 hidden sm:inline text-sm">PRO</span>
            <div className="flex items-center gap-3">
              {proAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2">
                  <AgentIcon 
                    agentId={agent.id} 
                    status={agent.status} 
                    size="lg" // Increased from sm to lg
                    showPulse={false}
                    className={cn(
                        "transition-all duration-500",
                        // Models icon top bar glow logic:
                        // Processing: Blink + Glow (using drop-shadow or box-shadow if container, or text-shadow if svg currentColor? text-shadow doesn't work on svg paths usually. Using filter: drop-shadow)
                        (agent.status === 'thinking') && "animate-pulse drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.9)] text-primary",
                        (agent.status === 'complete') && "drop-shadow-[0_0_10px_rgba(34,197,94,0.7)] text-agent-gamma", // Greenish glow
                        agent.status === 'idle' && "text-muted-foreground"
                    )}
                  />
                  <span className={cn(
                    "font-medium hidden lg:inline text-sm", // Adjusted text size
                    agent.status === 'thinking' && 'text-primary',
                    agent.status === 'complete' && 'text-agent-gamma',
                    agent.status === 'idle' && 'text-muted-foreground',
                  )}>
                    {agent.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-border" /> {/* Increased height */}

          {/* Con Team */}
          <div className="flex items-center gap-4">
            <span className="status-text text-team-con/70 hidden sm:inline text-sm">CON</span>
            <div className="flex items-center gap-3">
              {conAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2">
                  <AgentIcon 
                    agentId={agent.id} 
                    status={agent.status} 
                    size="lg" // Increased from sm to lg
                    showPulse={false}
                    className={cn(
                        "transition-all duration-500",
                        (agent.status === 'thinking') && "animate-pulse drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.9)] text-primary",
                        (agent.status === 'complete') && "drop-shadow-[0_0_10px_rgba(34,197,94,0.7)] text-agent-gamma",
                        agent.status === 'idle' && "text-muted-foreground"
                    )}
                  />
                  <span className={cn(
                    "font-medium hidden lg:inline text-sm",
                    agent.status === 'thinking' && 'text-primary',
                    agent.status === 'complete' && 'text-agent-gamma',
                    agent.status === 'idle' && 'text-muted-foreground',
                  )}>
                    {agent.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
