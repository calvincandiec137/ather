import { Agent } from '@/types/council';
import { AgentCard } from './AgentCard';
import { cn } from '@/lib/utils';

interface AgentGridProps {
  agents: Agent[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  const proAgents = agents.filter(a => a.team === 'pro');
  const conAgents = agents.filter(a => a.team === 'con');

  return (
    <div className="space-y-4">
      {/* Pro Team Row */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-team-pro" />
          <span className="status-text text-team-pro">PRO ARGUMENTS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proAgents.map((agent, index) => (
            <div 
              key={agent.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      </div>

      {/* Con Team Row */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-team-con" />
          <span className="status-text text-team-con">CON ARGUMENTS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conAgents.map((agent, index) => (
            <div 
              key={agent.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 80}ms` }}
            >
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
