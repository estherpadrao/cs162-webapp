export const BASE = process.env.REACT_APP_BASE_API_URL || '';

export function apiFetch(path, { body, ...opts } = {}) {
  const init = { credentials: 'include', ...opts };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json', ...opts.headers };
    init.body = JSON.stringify(body);
  }
  return fetch(`${BASE}${path}`, init);
}

export async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}
