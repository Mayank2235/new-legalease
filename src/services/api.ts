import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((res) => res.data),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data).then((res) => res.data),
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken }).then((res) => res.data);
  },
};

export const lawyerApi = {
  getAll: (q?: string) => api.get('/lawyers', { params: q ? { q } : undefined }).then((res) => res.data),
  search: (query?: string) => api.get('/lawyers/search', { params: query ? { q: query } : undefined }).then((res) => res.data),
  getById: (id: string) => api.get(`/lawyers/${id}`).then((res) => res.data),
  update: (id: string, data: any) => api.put(`/lawyers/${id}`, data).then((res) => res.data),
};

export const consultationApi = {
  create: (data: any) => api.post('/consultations', data).then((res) => res.data),
  getByClient: (clientId: string) => api.get(`/consultations/client/${clientId}`).then((res) => res.data),
  getByLawyer: (lawyerId: string) => api.get(`/consultations/lawyer/${lawyerId}`).then((res) => res.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/consultations/${id}/status`, { status }).then((res) => res.data),
};

export const caseApi = {
  create: (clientId: string, lawyerId: string, title: string, description: string, type: string, hourlyRate: number) =>
    api.post('/cases', null, { params: { clientId, lawyerId, title, description, type, hourlyRate } }).then((res) => res.data),
  getByClient: (clientId: string) => api.get(`/cases/client/${clientId}`).then((res) => res.data),
  getByLawyer: (lawyerId: string) => api.get(`/cases/lawyer/${lawyerId}`).then((res) => res.data),
  updateStatus: (caseId: string, status: string) =>
    api.put(`/cases/${caseId}/status`, null, { params: { status } }).then((res) => res.data),
  updateHours: (caseId: string, hours: number) =>
    api.put(`/cases/${caseId}/hours`, null, { params: { hours } }).then((res) => res.data),
  delete: (caseId: string) => api.delete(`/cases/${caseId}`).then((res) => res.data),
};

export const caseDocumentsApi = {
  list: (caseId: string, lawyerId: string) =>
    api.get('/case-documents', { params: { caseId, lawyerId } }).then((res) => res.data),
  upload: (caseId: string, lawyerId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post('/case-documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { caseId, lawyerId },
      })
      .then((res) => res.data);
  },
  delete: (documentId: string, lawyerId: string) =>
    api.delete(`/case-documents/${documentId}`, { params: { lawyerId } }).then((res) => res.data),
};

export const caseRequestApi = {
  create: (clientId: string, lawyerId: string, title: string, description: string, type: string) =>
    api.post('/case-requests', null, { params: { clientId, lawyerId, title, description, type } }).then((res) => res.data),
  getByClient: (clientId: string) => api.get(`/case-requests/client/${clientId}`).then((res) => res.data),
  getPendingByLawyer: (lawyerId: string) => api.get(`/case-requests/lawyer/${lawyerId}/pending`).then((res) => res.data),
  accept: (requestId: string, hourlyRate: number) =>
    api.put(`/case-requests/${requestId}/accept`, null, { params: { hourlyRate } }).then((res) => res.data),
  reject: (requestId: string) => api.put(`/case-requests/${requestId}/reject`).then((res) => res.data),
  cancel: (requestId: string) => api.put(`/case-requests/${requestId}/cancel`).then((res) => res.data),
};

export const messageApi = {
  send: (senderId: string, receiverId: string, content: string, caseId?: string) =>
    api.post('/messages', null, { params: { senderId, receiverId, content, caseId } }).then((res) => res.data),
  getConversation: (user1Id: string, user2Id: string) =>
    api.get('/messages/conversation', { params: { user1Id, user2Id } }).then((res) => res.data),
  getByCase: (caseId: string) => api.get(`/messages/case/${caseId}`).then((res) => res.data),
  markAsRead: (messageId: string) => api.put(`/messages/${messageId}/read`).then((res) => res.data),
  markAllAsRead: (userId: string) => api.put(`/messages/user/${userId}/read-all`).then((res) => res.data),
  getUnreadCount: (userId: string) => api.get(`/messages/user/${userId}/unread-count`).then((res) => res.data),
  getUnread: (userId: string) => api.get(`/messages/user/${userId}/unread`).then((res) => res.data),
};

export const adminApi = {
  create: (name: string, email: string, password: string, department: string, permissions: string) =>
    api.post('/admin/create', null, { params: { name, email, password, department, permissions } }).then((res) => res.data),
  getAll: () => api.get('/admin/all').then((res) => res.data),
  getById: (id: string) => api.get(`/admin/${id}`).then((res) => res.data),
  update: (id: string, name: string, department: string, permissions: string) =>
    api.put(`/admin/${id}`, null, { params: { name, department, permissions } }).then((res) => res.data),
  delete: (id: string) => api.delete(`/admin/${id}`).then((res) => res.data),
  getAllUsers: () => api.get('/admin/users').then((res) => res.data),
  getUserById: (id: string) => api.get(`/admin/users/${id}`).then((res) => res.data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`).then((res) => res.data),
};

export default api;


