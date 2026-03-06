const BASE = process.env.REACT_APP_BASE_API_URL || 'http://localhost:5000';

export default class TodoApiClient {
  constructor() {
    this.accessToken = localStorage.getItem('token');
  }

  async request(method, path, body) {
    const headers = {};
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const r = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return r;
  }

  get(path) { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  put(path, body) { return this.request('PUT', path, body); }
  delete(path) { return this.request('DELETE', path); }

  isAuthenticated() { return this.accessToken !== null; }

  async login(email, password) {
    const r = await this.post('/api/login', { email, password });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'Login failed');
    this.accessToken = data.token;
    localStorage.setItem('token', data.token);
    return data.user;
  }

  async register(email, name, password) {
    const r = await this.post('/api/register', { email, name, password });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'Registration failed');
    this.accessToken = data.token;
    localStorage.setItem('token', data.token);
    return data.user;
  }

  async logout() {
    await this.post('/api/logout');
    this.accessToken = null;
    localStorage.removeItem('token');
  }
}
