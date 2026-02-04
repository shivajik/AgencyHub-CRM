const API_BASE = "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message);
  }
  return res.json();
}

export const api = {
  // Auth
  async getMe() {
    return handleResponse<{ user: any }>(
      await fetch(`${API_BASE}/auth/me`, { credentials: "include" })
    );
  },

  // Clients
  async getClients() {
    return handleResponse<{ clients: any[] }>(
      await fetch(`${API_BASE}/clients`, { credentials: "include" })
    );
  },

  async getClient(id: string) {
    return handleResponse<{ client: any }>(
      await fetch(`${API_BASE}/clients/${id}`, { credentials: "include" })
    );
  },

  async createClient(data: any) {
    return handleResponse<{ client: any }>(
      await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async updateClient(id: string, data: any) {
    return handleResponse<{ client: any }>(
      await fetch(`${API_BASE}/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async deleteClient(id: string) {
    return handleResponse<{ message: string }>(
      await fetch(`${API_BASE}/clients/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
    );
  },

  // Projects
  async getProjects() {
    return handleResponse<{ projects: any[] }>(
      await fetch(`${API_BASE}/projects`, { credentials: "include" })
    );
  },

  async getProject(id: string) {
    return handleResponse<{ project: any }>(
      await fetch(`${API_BASE}/projects/${id}`, { credentials: "include" })
    );
  },

  async createProject(data: any) {
    return handleResponse<{ project: any }>(
      await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async updateProject(id: string, data: any) {
    return handleResponse<{ project: any }>(
      await fetch(`${API_BASE}/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async deleteProject(id: string) {
    return handleResponse<{ message: string }>(
      await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
    );
  },

  // Tasks
  async getTasks() {
    return handleResponse<{ tasks: any[] }>(
      await fetch(`${API_BASE}/tasks`, { credentials: "include" })
    );
  },

  async getMyTasks() {
    return handleResponse<{ tasks: any[] }>(
      await fetch(`${API_BASE}/tasks/my`, { credentials: "include" })
    );
  },

  async createTask(data: any) {
    return handleResponse<{ task: any }>(
      await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async updateTask(id: string, data: any) {
    return handleResponse<{ task: any }>(
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async deleteTask(id: string) {
    return handleResponse<{ message: string }>(
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
    );
  },

  // Invoices
  async getInvoices() {
    return handleResponse<{ invoices: any[] }>(
      await fetch(`${API_BASE}/invoices`, { credentials: "include" })
    );
  },

  async createInvoice(data: any) {
    return handleResponse<{ invoice: any }>(
      await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  async updateInvoice(id: string, data: any) {
    return handleResponse<{ invoice: any }>(
      await fetch(`${API_BASE}/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  // Messages
  async getMessages(channel?: string) {
    const url = channel
      ? `${API_BASE}/messages?channel=${encodeURIComponent(channel)}`
      : `${API_BASE}/messages`;
    return handleResponse<{ messages: any[] }>(
      await fetch(url, { credentials: "include" })
    );
  },

  async sendMessage(data: { content: string; channel: string }) {
    return handleResponse<{ message: any }>(
      await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
    );
  },

  // Users
  async getUsers() {
    return handleResponse<{ users: any[] }>(
      await fetch(`${API_BASE}/users`, { credentials: "include" })
    );
  },

  // Activities
  async getActivities(limit = 10) {
    return handleResponse<{ activities: any[] }>(
      await fetch(`${API_BASE}/activities?limit=${limit}`, { credentials: "include" })
    );
  },
};