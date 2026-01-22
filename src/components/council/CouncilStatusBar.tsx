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
    <div className="glass-surface p-4">
      <div className="water-highlight" />
      
      <div className="relative z-10 flex items-center justify-between">
        {/* Phase indicator */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "status-dot",
            phase === 'idle' && 'bg-muted-foreground',
            phase === 'analyzing' && 'bg-primary',
            phase === 'debating' && 'bg-primary',
            phase === 'synthesizing' && 'bg-agent-delta',
            phase === 'complete' && 'bg-agent-gamma',
          )} />
          <span className="status-text text-foreground">
            {phaseLabels[phase]}
          </span>
        </div>
        
        {/* Agent status with Pro/Con grouping */}
        <div className="flex items-center gap-6">
          {/* Pro Team */}
          <div className="flex items-center gap-3">
            <span className="status-text text-team-pro/70 hidden sm:inline">PRO</span>
            <div className="flex items-center gap-2">
              {proAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-1.5">
                  <AgentIcon 
                    agentId={agent.id} 
                    status={agent.status} 
                    size="sm"
                    showPulse={false}
                  />
                  <span className={cn(
                    "text-xs font-medium hidden lg:inline",
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

          <div className="w-px h-6 bg-border" />

          {/* Con Team */}
          <div className="flex items-center gap-3">
            <span className="status-text text-team-con/70 hidden sm:inline">CON</span>
            <div className="flex items-center gap-2">
              {conAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-1.5">
                  <AgentIcon 
                    agentId={agent.id} 
                    status={agent.status} 
                    size="sm"
                    showPulse={false}
                  />
                  <span className={cn(
                    "text-xs font-medium hidden lg:inline",
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
