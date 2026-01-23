import { useState, useCallback, useRef } from 'react';
import { Agent, AgentId, Session, SessionPhase, Message, Factor, DebateMessage, AgentTeam, DebateRun, AgentResponse, UploadedDocument, PeerReview } from '@/types/council';
import { processQuery, getTLDR } from '@/lib/api';

const initialAgents: Agent[] = [
  { id: 'alpha', name: 'Alpha', icon: '✦', status: 'idle', reasoning: '', team: 'pro' },
  { id: 'beta', name: 'Beta', icon: '⬡', status: 'idle', reasoning: '', team: 'pro' },
  { id: 'gamma', name: 'Gamma', icon: '◎', status: 'idle', reasoning: '', team: 'con' },
  { id: 'delta', name: 'Delta', icon: '⚡', status: 'idle', reasoning: '', team: 'con' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const extractPlainText = (content: string, maxChars = 10000): string => {
  // Basic text extraction - remove extra whitespace
  const text = content
    .replace(/\s+/g, ' ')
    .trim();
  return text.substring(0, maxChars);
};

export function useCouncil() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [currentTab, setCurrentTab] = useState<'chat' | 'agents' | 'debate' | 'peer-review' | 'verdict'>('chat');
  const debateContainerRef = useRef<HTMLDivElement>(null);

  const createSession = useCallback((title: string = 'New Council Session') => {
    const newSession: Session = {
      id: generateId(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      documents: [],
      debateRuns: [],
      currentRunId: null,
      phase: 'idle',
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setPhase('idle');
    setAgents(initialAgents);
    setCurrentTab('chat');
    return newSession;
  }, []);

  const addDocument = useCallback((file: File) => {
    if (!currentSession) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = (e.target?.result as string) || '';
      const plainText = extractPlainText(content);
      
      const newDoc: UploadedDocument = {
        id: generateId(),
        name: file.name,
        content: plainText,
      };

      setCurrentSession(prev => 
        prev ? {
          ...prev,
          documents: [...prev.documents, newDoc],
          updatedAt: new Date(),
        } : null
      );
    };
    reader.readAsText(file);
  }, [currentSession]);

  const submitQuery = useCallback(async (input: string) => {
    let session = currentSession;
    if (!session) {
      session = createSession(input.slice(0, 30) + (input.length > 30 ? '...' : ''));
    }

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setCurrentSession(prev => 
      prev ? {
        ...prev,
        messages: [...prev.messages, userMessage],
        updatedAt: new Date(),
      } : null
    );

    // Create new debate run
    const runId = generateId();
    const newRun: DebateRun = {
      id: runId,
      query: input,
      agents: [],
      debate: [],
      peerReview: null,
      verdict: '',
      sources: [],
      timestamp: new Date(),
      status: 'pending',
    };

    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        debateRuns: [...prev.debateRuns, newRun],
        currentRunId: runId,
        phase: 'analyzing',
        updatedAt: new Date(),
      };
    });

    setPhase('analyzing');
    setAgents(prev => prev.map(a => ({ ...a, status: 'thinking', reasoning: '' })));

    try {
      // Get document text if available
      const documentText = currentSession?.documents[currentSession.documents.length - 1]?.content;

      // Call backend API
      const response = await processQuery(input, documentText, session.id);

      // Handle TYPE 1: Simple QA Response
      if (response.response) {
          const councilMessage: Message = {
            id: generateId(),
            role: 'council',
            content: response.response,
            timestamp: new Date(),
          };

          setCurrentSession(prev => {
            if (!prev) return null;
            return {
              ...prev,
              messages: [...prev.messages, councilMessage],
              phase: 'idle', // Reset to idle since no debate happened
              updatedAt: new Date(),
            };
          });
          
          setPhase('idle');
          setAgents(initialAgents); // Reset agents
          return;
      }

      // Handle TYPE 2: Complex Debate Response
      
      // Map peer review data
      let peerReview: PeerReview | null = null;
      if (response.peer_reviews) {
        // Direct mapping since the structures now match
        peerReview = response.peer_reviews as unknown as PeerReview;
      }

      // Parse transcript into messages
      const debate: DebateMessage[] = [];
      const agents: AgentResponse[] = [];
      
      if (response.debate_transcript) {
         const lines = response.debate_transcript.split('\n');
         let currentAgentId: AgentId = 'alpha';
         let currentAgentName = 'Agent';
         let currentTeam: AgentTeam = 'pro';
         let currentContent = '';
         
         const flushMessage = () => {
           if (currentContent.trim()) {
             debate.push({
               id: generateId(),
               agentId: currentAgentId,
               agentName: currentAgentName,
               team: currentTeam,
               content: currentContent.trim(),
               timestamp: new Date(),
             });
             
             // Update agents list with their last response
             const existingAgentIndex = agents.findIndex(a => a.agentName === currentAgentName);
             if (existingAgentIndex >= 0) {
               agents[existingAgentIndex].response = currentContent.trim();
             } else {
               agents.push({
                 agentId: currentAgentId,
                 agentName: currentAgentName,
                 team: currentTeam,
                 response: currentContent.trim()
               });
             }
             currentContent = '';
           }
         };

         for (const line of lines) {
           // Regex to match headers like "[Pro-A] (PRO):" or "[Con-A] (CON):"
           // Adjust regex based on strict output format from the new API
           const match = line.match(/^\[(.*?)\] \((PRO|CON)\):/i);
           
           if (match) {
             flushMessage();
             currentAgentName = match[1];
             const teamRaw = match[2].toUpperCase();
             currentTeam = teamRaw === 'PRO' ? 'pro' : 'con';
             
             // Assign crude IDs based on name or round robin? 
             // Assign IDs based on name
             if (currentAgentName.includes('Pro-A')) currentAgentId = 'alpha';
             else if (currentAgentName.includes('Pro-B')) currentAgentId = 'beta';
             else if (currentAgentName.includes('Con-A')) currentAgentId = 'gamma';
             else if (currentAgentName.includes('Con-B')) currentAgentId = 'delta';
             else {
                 // Fallback: generate deterministic-ish ID or just use random if really unknown, 
                 // but better to keep safe strings.
                 currentAgentId = currentAgentName.toLowerCase().replace(/[^a-z0-9]/g, '-') as AgentId;
             }
             
           } else if (line.trim().startsWith('--- ROUND') || line.trim().startsWith('DEBATE:') || line.trim().startsWith('====') || line.trim().startsWith('Started:') || line.trim().startsWith('Ended:')) {
             // Skip metadata lines
             continue;
           } else {
             currentContent += line + '\n';
           }
         }
         flushMessage(); // Flush the last one
      } else if (response.debate) {
        // Fallback or legacy path
        response.debate.forEach(d => {
             debate.push({
                id: generateId(),
                agentId: (d.agentId || 'alpha') as AgentId,
                agentName: d.agentName || 'Agent',
                team: (d.team as AgentTeam) || 'pro',
                content: d.content || '',
                timestamp: new Date(),
              });
        });
      }

      const updatedRun: DebateRun = {
        ...newRun,
        document_text: documentText,
        agents,
        debate,
        peerReview,
        verdict: response.verdict || '',
        sources: response.sources || [],
        status: 'complete',
      };

      setAgents(prev => prev.map(a => ({ ...a, status: 'complete' })));

      // Call TLDR API
      let tldrContent = '';
      try {
        const tldrRaw = await getTLDR(input, response.verdict || response.response || "No verdict available.");
        // Robust Regex to remove "TL;DR", "**TL;DR:**", etc.
        // Matches start of string, optional markdown bold/italic, "tl;dr" or "tldr", optional markdown, then separators
        tldrContent = tldrRaw.replace(/^[\s\W]*tl[;:]?dr[\s\W]*/im, '').trim();
      } catch (tldrError) {
          console.error("Failed to fetch TLDR:", tldrError);
          tldrContent = "Summary unavailable.";
      }

      // Update session with completed run AND TLDR message (no intermediate verdict message)
      setCurrentSession(prev => {
        if (!prev) return null;
        const updatedRuns = prev.debateRuns.map(r => r.id === runId ? updatedRun : r);
        
        const tldrMessage: Message = {
            id: generateId(),
            role: 'council',
            content: tldrContent,
            timestamp: new Date(),
        };

        return {
          ...prev,
          debateRuns: updatedRuns,
          messages: [...prev.messages, tldrMessage],
          phase: 'complete',
          updatedAt: new Date(),
        };
      });

      setPhase('complete');

      
    } catch (error) {
      console.error('Error calling backend API:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to process query';
      
      // Update run with error status
      setCurrentSession(prev => {
        if (!prev) return null;
        const updatedRuns = prev.debateRuns.map(r => 
          r.id === runId 
            ? { ...r, status: 'error' as const, error: errorMessage }
            : r
        );
        
        // Add error message to chat
        const errorChatMessage: Message = {
          id: generateId(),
          role: 'council',
          content: `Error during analysis: ${errorMessage}`,
          timestamp: new Date(),
        };

        return {
          ...prev,
          debateRuns: updatedRuns,
          messages: [...prev.messages, errorChatMessage],
          phase: 'complete',
          updatedAt: new Date(),
        };
      });

      setPhase('complete');
    }
  }, [currentSession, createSession]);

  const selectSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setPhase(session.phase);
      setAgents(initialAgents);
      setCurrentTab('chat');
    }
  }, [sessions]);

  const selectDebateRun = useCallback((runId: string) => {
    setCurrentSession(prev => 
      prev ? { ...prev, currentRunId: runId, updatedAt: new Date() } : null
    );
  }, []);

  const switchTab = useCallback((tab: 'chat' | 'agents' | 'debate' | 'peer-review' | 'verdict') => {
    setCurrentTab(tab);
  }, []);

  return {
    sessions,
    currentSession,
    currentRun: currentSession?.debateRuns.length ? currentSession.debateRuns[currentSession.debateRuns.length - 1] : null,
    agents,
    phase,
    currentTab,
    debateContainerRef,
    createSession,
    submitQuery,
    selectSession,
    selectDebateRun,
    switchTab,
    addDocument,
  };
}
