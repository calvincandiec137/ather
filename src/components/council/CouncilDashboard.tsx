import { useState } from 'react';
import { useCouncil } from '@/hooks/useCouncil';
import { SessionSidebar } from './SessionSidebar';
import { CouncilStatusBar } from './CouncilStatusBar';
import { AgentGrid } from './AgentGrid';
import { FinalVerdict } from './FinalVerdict';
import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { cn } from '@/lib/utils';
import { AgentIcon } from '@/components/icons/AgentIcon';
import { ChatIcon, DebateIcon, VerdictIcon, ReviewIcon } from '@/components/icons/NavIcons';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

export function CouncilDashboard() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  const {
    sessions,
    currentSession,
    agents,
    phase,
    currentTab,
    currentRun,
    debateContainerRef,
    createSession,
    submitQuery,
    selectSession,
    switchTab,
    addDocument,
  } = useCouncil();

  // Helper for toggle
  const toggleSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);

  const isProcessing = phase === 'analyzing' || phase === 'debating' || phase === 'synthesizing';

  // Navigation Items for Right Rail
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <ChatIcon className="w-8 h-8" /> },
    { id: 'agents', label: 'Agents', icon: <AgentIcon className="w-8 h-8" /> },
    { id: 'debate', label: 'Debate', icon: <DebateIcon className="w-8 h-8" /> },
    { id: 'peer-review', label: 'Review', icon: <ReviewIcon className="w-8 h-8" /> },
    { id: 'verdict', label: 'Verdict', icon: <VerdictIcon className="w-8 h-8" /> },
  ] as const;

  // Check for mobile view (simple effect or just media queries in CSS classes)
  
  return (
    <div className="h-[100dvh] bg-background flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* MOBILE: Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 glass-surface z-30 shrink-0">
          <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">AC</span>
               </div>
               <span className="font-bold text-foreground">Aether Council</span>
          </div>
          <button 
             onClick={toggleSidebar}
             className="p-2 -mr-2 text-muted-foreground"
          >
             {leftSidebarOpen ? '✖' : '☰'}
          </button>
      </div>

      {/* LEFT COLUMN: Sidebar (Desktop: Collapsible, Mobile: Overlay) */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out md:relative sidebar-container",
          leftSidebarOpen ? "translate-x-0 w-[85vw] md:w-80" : "-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:opacity-0"
        )}
        style={{
             // Local override for variables to ensure child components use the sidebar theme
             // @ts-ignore
             '--foreground': 'var(--sidebar-fg)',
             '--background': 'var(--sidebar-bg)',
             '--muted-foreground': '208 30% 70%'
        }}
      >
        <div className="p-4 h-full flex flex-col pt-20 md:pt-4">
             <SessionSidebar
              sessions={sessions}
              currentSession={currentSession}
              phase={phase}
              onSelectSession={(id) => {
                  selectSession(id);
                  if (window.innerWidth < 768) setLeftSidebarOpen(false); // Close on mobile selection
              }}
              onNewSession={() => {
                  createSession();
                 if (window.innerWidth < 768) setLeftSidebarOpen(false);
              }}
            />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {leftSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setLeftSidebarOpen(false)}
          />
      )}
      
      {/* MIDDLE COLUMN: Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full bg-main-bg">
        {/* Desktop Header / Status Bar */}
        <div className="hidden md:flex items-center p-4 pb-2 gap-4">
           <button 
             onClick={toggleSidebar}
             className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground transition-colors"
             title={leftSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
           >
             {leftSidebarOpen ? '◀' : '▶'}
           </button>
           <div className="flex-1">
             <CouncilStatusBar agents={agents} phase={phase} />
           </div>
        </div>
        
        {/* Mobile Status Bar (Simplified) */}
        <div className="md:hidden px-4 py-2">
            <CouncilStatusBar agents={agents} phase={phase} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden p-2 md:p-4 relative flex flex-col pb-20 md:pb-4">
            
            {/* Thinking / Loading Overlays can go here if needed, or inside tabs */}

            {/* CHAT TAB */}
            <div className={cn("absolute inset-0 p-2 md:p-4 transition-opacity duration-300 pb-20 md:pb-4", currentTab === 'chat' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
               <div className="h-full glass-surface flex flex-col overflow-hidden shadow-sm">
                  <ChatHistory
                    messages={currentSession?.messages || []}
                    debateMessages={[]}
                    phase={phase}
                    containerRef={debateContainerRef}
                  />
               </div>
            </div>

            {/* AGENTS TAB - Tabular/Grid Structure */}
            <div className={cn("absolute inset-0 p-2 md:p-4 transition-opacity duration-300 pb-20 md:pb-4", currentTab === 'agents' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
              <div className="h-full glass-surface flex flex-col overflow-hidden p-4 md:p-6 shadow-sm">
                  {isProcessing && (!currentRun?.agents || currentRun.agents.length === 0) ? (
                     <div className="flex flex-col items-center justify-center h-full gap-4">
                         <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                         <p className="text-muted-foreground animate-pulse">Summoning Council Members...</p>
                     </div>
                  ) : currentRun?.agents && currentRun.agents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full overflow-y-auto pr-2">
                        {currentRun.agents.map((agent) => (
                        <div key={agent.agentId} className={cn(
                            "flex flex-col p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:shadow-md",
                            "bg-white/50 backdrop-blur-sm",
                            agent.team === 'pro' ? "border-teal-500/20" : "border-rose-500/20"
                        )}>
                            <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm font-bold",
                                    agent.team === 'pro' ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700"
                                )}>
                                    {agent.agentId.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-lg leading-tight">{agent.agentName}</h3>
                                    <span className={cn(
                                        "text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full",
                                         agent.team === 'pro' ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"
                                    )}>{agent.team}</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1">
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {agent.response}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-50">
                        <p>No agents active.</p>
                    </div>
                  )}
              </div>
            </div>

            {/* DEBATE TAB */}
            <div className={cn("absolute inset-0 p-2 md:p-4 transition-opacity duration-300 pb-20 md:pb-4", currentTab === 'debate' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
               <div className="h-full glass-surface flex flex-col overflow-hidden p-4 shadow-sm">
                   {isProcessing && (!currentRun?.debate || currentRun.debate.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce delay-0"/>
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce delay-150"/>
                                <span className="w-3 h-3 rounded-full bg-primary animate-bounce delay-300"/>
                             </div>
                            <p className="text-muted-foreground">The Council is deliberating...</p>
                        </div>
                   ) : (
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2" ref={debateContainerRef}>
                        {currentRun?.debate.map((msg) => (
                          <div key={msg.id} className={cn(
                              "p-4 rounded-2xl max-w-[90%] shadow-sm",
                              msg.team === 'pro' 
                                ? "bg-teal-50/80 border border-teal-100 ml-auto rounded-tr-sm"
                                : "bg-rose-50/80 border border-rose-100 mr-auto rounded-tl-sm"
                          )}>
                              <div className="flex items-center gap-2 mb-2 opacity-75">
                                  <span className={cn("text-xs font-bold uppercase tracking-wider", msg.team === 'pro' ? "text-teal-700" : "text-rose-700")}>
                                      {msg.agentName} ({msg.team})
                                  </span>
                              </div>
                              <p className="text-sm text-slate-800 leading-relaxed">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                   )}
               </div>
            </div>

            {/* REVIEW & VERDICT TABS (Combined logic similarly) */}
            <div className={cn("absolute inset-0 p-2 md:p-4 transition-opacity duration-300 pb-20 md:pb-4", currentTab === 'peer-review' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
                 <div className="h-full glass-surface flex flex-col overflow-hidden p-6 shadow-sm overflow-y-auto">
                    {/* Reuse existing Review logic but styled */}
                    {currentRun?.peerReview ? (
                         <div className="space-y-8">
                            {Object.entries(currentRun.peerReview).map(([modelName, agents]) => (
                                <div key={modelName} className="space-y-4">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] border-b border-border pb-2 opacity-50">{modelName}</h3>
                                    <div className="grid gap-4">
                                        {Object.entries(agents).map(([agentName, review]) => (
                                            <div key={agentName} className="bg-white/40 p-5 rounded-xl border border-white/50 shadow-sm">
                                                 <div className="flex justify-between items-center mb-4">
                                                     <span className="font-bold text-lg">{agentName}</span>
                                                     <div className="flex gap-1">
                                                         {['reasoning', 'bias', 'insight', 'evidence'].map(metric => {
                                                             const score = review[metric as keyof typeof review];
                                                             if(typeof score !== 'number') return null;
                                                             return (
                                                                 <div key={metric} className="px-2 py-1 bg-white/60 rounded text-center min-w-[3rem]">
                                                                     <div className="text-[9px] uppercase opacity-50 mb-0.5">{metric.slice(0,3)}</div>
                                                                     <div className={cn("font-bold text-sm", score > 7 ? "text-green-600" : "text-amber-600")}>{score}</div>
                                                                 </div>
                                                             )
                                                         })}
                                                     </div>
                                                 </div>
                                                 <p className="text-sm italic text-muted-foreground border-l-2 border-primary/20 pl-4">"{review.critique}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    ) : ( <div className="m-auto text-muted-foreground">Pending Peer Reviews...</div> )}
                 </div>
            </div>

             <div className={cn("absolute inset-0 p-2 md:p-4 transition-opacity duration-300 pb-20 md:pb-4", currentTab === 'verdict' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
                 <div className="h-full glass-surface flex flex-col overflow-hidden p-8 shadow-sm overflow-y-auto">
                     {currentRun?.verdict ? (
                         <div className="max-w-3xl mx-auto space-y-8">
                             <div className="bg-transparent">
                                 <MarkdownRenderer content={currentRun.verdict} />
                             </div>
                             {currentRun.sources && currentRun.sources.length > 0 && (
                                 <div className="bg-muted/30 p-6 rounded-xl border border-border">
                                     <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">References</h3>
                                     <ul className="grid gap-2">
                                         {currentRun.sources.map((src, i) => (
                                             <li key={i}>
                                                 <a href={src} target="_blank" className="text-xs text-primary hover:underline truncate block flex items-center gap-2">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                     {src}
                                                 </a>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}
                         </div>
                     ) : ( <div className="m-auto text-muted-foreground">Verification in progress...</div> )}
                 </div>
            </div>


        </div>

        {/* Input Footer (Hidden on all tabs except Chat? Or always visible? 
           Usually input is only for Chat. But prompt implies "Ask the council..." so it starts a session.
           Let's keep it visible but maybe hide when not in 'chat' tab on mobile to save space?
           Actually, the ChatInput is used to START the flow. It should be visible or accessible.
           Let's float it or keep it fixed bottom.
           We previously had it in a sticky footer.
           
           For mobile: Fixed bottom, above the nav bar.
        */}
        <div className={cn(
            "p-4 pt-0 transition-transform duration-300 md:pb-0 pb-20", // Added pb-20 for mobile nav clearance
            // On mobile, if we are NOT in chat tab, maybe hide input to give more reading space?
            // "md:block", currentTab !== 'chat' ? "hidden md:block" : ""
        )}>
          <ChatInput 
            onSubmit={submitQuery}
            disabled={isProcessing}
            placeholder="Ask the council..."
            onDocumentAdd={addDocument}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Floating Navigation Rail (Desktop) */}
      <div className="hidden md:flex w-20 m-4 ml-0 flex-col gap-3 z-20">
         <div className="glass-surface py-6 px-2 flex flex-col items-center gap-4 h-full shadow-lg border-l border-white/20">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => switchTab(item.id)}
                    className={cn(
                        "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative",
                        currentTab === item.id 
                            ? "bg-primary text-primary-foreground shadow-glow scale-105" 
                            : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    disabled={
                        (item.id === 'agents' && currentRun?.agents.length === 0 && !isProcessing) ||
                        (item.id === 'debate' && currentRun?.debate.length === 0 && !isProcessing) ||
                        (item.id === 'peer-review' && !currentRun?.peerReview && !isProcessing) ||
                        (item.id === 'verdict' && !currentRun?.verdict && !isProcessing)
                    }
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">{item.label}</span>
                    {currentTab === item.id && (
                        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-foreground/20 rounded-l-full" />
                    )}
                </button>
            ))}
         </div>
      </div>

      {/* MOBILE: Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-surface border-t border-white/20 z-50 flex items-center justify-around px-2 pb-safe">
         {navItems.map(item => (
            <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={cn(
                    "flex flex-col items-center justify-center h-full w-full gap-0.5 transition-colors active:scale-95",
                    currentTab === item.id 
                        ? "text-primary" 
                        : "text-muted-foreground"
                )}
                disabled={
                        (item.id === 'agents' && currentRun?.agents.length === 0 && !isProcessing) ||
                        (item.id === 'debate' && currentRun?.debate.length === 0 && !isProcessing) ||
                        (item.id === 'peer-review' && !currentRun?.peerReview && !isProcessing) ||
                        (item.id === 'verdict' && !currentRun?.verdict && !isProcessing)
                }
            >
                <span className={cn("text-xl transition-transform", currentTab === item.id ? "-translate-y-1" : "")}>{item.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-tight opacity-90">{item.label}</span>
                {currentTab === item.id && (
                    <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full mb-0.5" />
                )}
            </button>
         ))}
      </div>
      
    </div>
  );
}
