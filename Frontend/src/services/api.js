const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

// EXPECTED BACKEND (example):
// POST {BASE_URL}/predict/paragraph  body: { text }
// -> { label: "fraud" | "legit", confidence: 0.92, details?: any }
//
// POST {BASE_URL}/predict/structured body: { title, company_profile, description, requirements, benefits, salary_range, remote?, has_company_website? }
// -> { label, confidence, details? }

export async function predictFromParagraph(text) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 45000);

  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: text }),
    signal: controller.signal
  });

  return handleResponse(res);
}

export async function predictFromFields(payload) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 45000);

  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
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
    probability: data.probability,
    risk_indicators: data.risk_indicators || [],
    education: data.education || null,
    note: data.note || null
  };
}
async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
