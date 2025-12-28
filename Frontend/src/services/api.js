const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// EXPECTED BACKEND (example):
// POST {BASE_URL}/predict/paragraph  body: { text }
// -> { label: "fraud" | "legit", confidence: 0.92, details?: any }
//
// POST {BASE_URL}/predict/structured body: { title, company_profile, description, requirements, benefits, salary_range, remote?, has_company_website? }
// -> { label, confidence, details? }

export async function predictFromParagraph(text) {
  const res = await fetch(`${BASE_URL}/predict/paragraph`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function predictFromFields(payload) {
  const res = await fetch(`${BASE_URL}/predict/structured`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
