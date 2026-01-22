// src/lib/api.ts
import { ProcessRequest, ProcessResponse } from "../types/api";

const API_URL = "/tsdc/classify"; // Proxied using Vite config

export async function processQuery(
  query: string,
  document_text?: string,
  session_id?: string
): Promise<ProcessResponse> {
  // New API requires "query" and "history".
  // We append document_text to query if present, similar to before, or just pass it.
  const fullQuery = query + (document_text ? `\n\nContext:\n${document_text}` : "");
  
  const payload = { 
    query: fullQuery,
    history: "" // Default to empty history as per current requirement
  };
  
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
