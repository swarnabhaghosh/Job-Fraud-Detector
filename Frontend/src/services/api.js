const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

// EXPECTED BACKEND (example):
// POST {BASE_URL}/predict/paragraph  body: { text }
// -> { label: "fraud" | "legit", confidence: 0.92, details?: any }
//
// POST {BASE_URL}/predict/structured body: { title, company_profile, description, requirements, benefits, salary_range, remote?, has_company_website? }
// -> { label, confidence, details? }

export async function predictFromParagraph(text) {
  // We send the text inside a 'description' key to match your backend logic
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: text }) 
  });
  return handleResponse(res);
}

export async function predictFromFields(payload) {
  // Your backend already knows how to handle a full object at /predict
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// Helper to clean up the code
async function handleResponse(res) {
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  const data = await res.json();
  
  // MAP BACKEND KEYS TO FRONTEND KEYS
  // Your backend sends { result, score }, frontend wants { label, confidence }
  return {
    label: data.result,
    confidence: data.score
  };
}
async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
