import { Session, SessionPhase } from '@/types/council';
import { 
  MessageSquare,
  Plus,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface SessionSidebarProps {
  sessions: Session[];
  currentSession: Session | null;
  phase: SessionPhase;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function SessionSidebar({ 
  sessions, 
  currentSession, 
  phase, 
  onSelectSession,
  onNewSession 
}: SessionSidebarProps) {
  return (
    <div className="w-full h-[calc(100vh-2rem)] flex flex-col">
      
      {/* Header */}
      <div className="relative z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm tracking-wide uppercase opacity-80">Recent Sessions</h2>
          <button
            onClick={onNewSession}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            )}
          >
            <Plus className="w-4 h-4 text-primary-foreground/80" />
          </button>
        </div>
      </div>
      
      {/* Session list */}
      <div className="relative z-10 flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No sessions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start a new conversation</p>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                currentSession?.id === session.id 
                  ? "sidebar-item-active" 
                  : "sidebar-item-hover text-muted-foreground"
              )}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className={cn(
                    "w-4 h-4 mt-0.5 flex-shrink-0 transition-colors",
                    currentSession?.id === session.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                      "text-sm truncate transition-colors",
                       currentSession?.id === session.id ? "text-foreground font-medium" : "group-hover:text-foreground"
                  )}>
                    {session.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 opacity-50" />
                    <span className="text-xs opacity-50">
                      {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            Aether Council v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
