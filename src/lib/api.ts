import { Issue, Comment, Notification, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth token
const getToken = () => localStorage.getItem('civic_token');

// Helper for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async register(email: string, password: string, fullName: string) {
    const data = await apiCall<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    localStorage.setItem('civic_token', data.token);
    return data.user;
  },

  async login(email: string, password: string) {
    const data = await apiCall<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('civic_token', data.token);
    return data.user;
  },

  async adminLogin(username: string, password: string) {
    const data = await apiCall<{ token: string; user: User }>('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('civic_token', data.token);
    return data.user;
  },

  async getCurrentUser() {
    return apiCall<User>('/api/auth/me');
  },

  logout() {
    localStorage.removeItem('civic_token');
  },
};

// Issues API
export const issuesAPI = {
  async getAll(filters?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return apiCall<Issue[]>(`/api/issues${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return apiCall<Issue>(`/api/issues/${id}`);
  },

  async create(issue: Omit<Issue, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return apiCall<Issue>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(issue),
    });
  },

  async updateStatus(id: string, status: Issue['status']) {
    return apiCall<Issue>(`/api/issues/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async delete(id: string) {
    return apiCall<{ message: string }>(`/api/issues/${id}`, {
      method: 'DELETE',
    });
  },
};

// Comments API
export const commentsAPI = {
  async getByIssueId(issueId: string) {
    return apiCall<Comment[]>(`/api/comments/issue/${issueId}`);
  },

  async create(issueId: string, content: string, userName: string) {
    return apiCall<Comment>(`/api/comments/issue/${issueId}`, {
      method: 'POST',
      body: JSON.stringify({ content, user_name: userName }),
    });
  },
};

// Notifications API
export const notificationsAPI = {
  async getAll() {
    return apiCall<Notification[]>('/api/notifications');
  },

  async markAsRead(id: string) {
    return apiCall<Notification>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead() {
    return apiCall<{ message: string }>('/api/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
