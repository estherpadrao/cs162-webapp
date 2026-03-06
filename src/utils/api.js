export const BASE = process.env.REACT_APP_BASE_API_URL || 'http://localhost:5000';

export function apiFetch(path, { body, ...opts } = {}) {
  const headers = { ...opts.headers };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  return fetch(`${BASE}${path}`, {
    ...opts,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
