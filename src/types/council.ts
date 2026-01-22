export type AgentId = 'alpha' | 'beta' | 'gamma' | 'delta';

export type AgentStatus = 'idle' | 'thinking' | 'complete' | 'error';

export type SessionPhase = 'idle' | 'analyzing' | 'debating' | 'synthesizing' | 'complete';

export type AgentTeam = 'pro' | 'con';

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  status: AgentStatus;
  reasoning: string;
  confidence?: number;
  team: AgentTeam;
}

export interface Factor {
  id: string;
  text: string;
  extracted: boolean;
}

export interface DebateMessage {
  id: string;
  agentId: AgentId;
  agentName: string;
  team: AgentTeam;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'council';
  content: string;
  timestamp: Date;
  factors?: Factor[];
  debateMessages?: DebateMessage[];
  verdict?: string;
}

export interface AgentResponse {
  agentId: AgentId;
  agentName: string;
  team: AgentTeam;
  response: string;
}

export interface AgentReview {
  reasoning: number;
  bias: number;
  insight: number;
  evidence: number;
  debate_skill: number;
  critique: string;
}

export interface PeerReview {
  [modelName: string]: {
    [agentName: string]: AgentReview;
  };
}

export interface DebateRun {
  id: string;
  query: string;
  document_text?: string;
  agents: AgentResponse[];
  debate: DebateMessage[];
  peerReview: PeerReview | null;
  verdict: string;
  sources: string[]; // Added sources
  timestamp: Date;
  status: 'pending' | 'complete' | 'error';
  error?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  content: string;
}

export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  messages: Message[];
  documents: UploadedDocument[];
  debateRuns: DebateRun[];
  currentRunId: string | null;
  phase: SessionPhase;
}

export interface CouncilState {
  currentSession: Session | null;
  sessions: Session[];
  agents: Agent[];
  phase: SessionPhase;
  finalVerdict: string | null;
}
