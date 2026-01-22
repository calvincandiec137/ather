// src/types/api.ts

export interface ProcessRequest {
  query: string;
  document_text?: string;
  session_id?: string;
}

export interface AgentResponseData {
  agentId?: string;
  agentName?: string;
  team?: string;
  response?: string;
}

export interface PeerReviewData {
  [modelName: string]: {
    [agentName: string]: {
      reasoning: number;
      bias: number;
      insight: number;
      evidence: number;
      debate_skill: number;
      critique: string;
    }
  }
}

export interface ProcessResponse {
  verdict?: string;
  debate_transcript?: string;
  peer_reviews?: PeerReviewData;
  sources?: string[];
  metadata?: {
    duration_seconds: number;
    llm_count: number;
    model: string;
    transcript_file: string;
  };
  error?: string;
  
  // Type 1 Response Fields
  response?: string;
  model?: string;
  created_at?: string;
  done?: boolean;
  done_reason?: string;
  history?: string;

  // Legacy fields
  agents?: AgentResponseData[];
  debate?: Array<{
    agentId?: string;
    agentName?: string;
    team?: string;
    content?: string;
  }>;
}
