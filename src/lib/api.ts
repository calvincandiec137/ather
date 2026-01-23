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

export async function getTLDR(query: string, resp: string): Promise<string> {
  const payload = {
    query,
    resp
  };

  const res = await fetch("/tsdc/tldr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`TLDR API error: ${res.status}`);
  }

  const data = await res.json();
  // The API returns the summary in a field (assuming "response" or similar based on user example, 
  // but looking at user's curl "print the result", the curl output isn't shown, 
  // but usually it mimics the input or has a specific key. 
  // The user prompt said: "use this endpoint to pass the verdict and the query... and then print the result in the chat section"
  // I will assume it returns a JSON with a text field. 
  // Let's assume the response body IS the summary or has a 'summary' or 'response' field.
  // Wait, the user showed the REQUEST but not the RESPONSE structure.
  // Standard practice suggests it might return `{"response": "..."}` or similar.
  // I'll return the whole JSON for now if unsure, or just text if it's text.
  // Actually, I'll log it first to be safe or assume it returns an object.
  // Let's assume it returns { response: "string" } or { summary: "string" } or similar.
  // Given the previous API returns `response` or `verdict`, I'll try to return `data.response` or `data.summary` or `data` if it's a string.
  return data.response || data.summary || data.tldr || (typeof data === 'string' ? data : JSON.stringify(data));
}
