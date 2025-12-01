import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Member API
export const memberAPI = {
  getAll: () => api.get('/member/'),
  getById: (id) => api.get(`/member/${id}`),
  create: (data) => api.post('/member/', data),
  update: (id, data) => api.put(`/member/${id}`, data),
  delete: (id) => api.delete(`/member/${id}`),
  getHealthMetrics: (memberId) => api.get(`/member/${memberId}/health-metrics`),
  createHealthMetric: (memberId, data) => api.post(`/member/${memberId}/health-metrics`, { ...data, member_id: memberId }),
  getFitnessGoals: (memberId) => api.get(`/member/${memberId}/fitness-goals`),
  createFitnessGoal: (memberId, data) => api.post(`/member/${memberId}/fitness-goals`, { ...data, member_id: memberId }),
  getClassRegistrations: (memberId) => api.get(`/member/${memberId}/class-registrations`),
  registerForClass: (memberId, classId) => api.post(`/member/${memberId}/class-registrations`, { member_id: memberId, class_id: classId }),
  cancelRegistration: (memberId, classId) => api.delete(`/member/${memberId}/class-registrations/${classId}`),
}

// Admin API
export const adminAPI = {
  getAll: () => api.get('/admin/'),
  getById: (id) => api.get(`/admin/by-id/${id}`),
  create: (data) => api.post('/admin/', data),
  update: (id, data) => api.put(`/admin/by-id/${id}`, data),
  delete: (id) => api.delete(`/admin/by-id/${id}`),
  // Rooms
  getRooms: () => api.get('/admin/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  // Equipment
  getEquipment: () => api.get('/admin/equipment'),
  createEquipment: (data) => api.post('/admin/equipment', data),
  // Classes
  createClass: (data) => api.post('/admin/classes', data),
  // PT Sessions
  createPTSession: (data) => api.post('/admin/pt-session', data),
}

// Trainer API
export const trainerAPI = {
  getAll: () => api.get('/trainer/'),
  getById: (id) => api.get(`/trainer/${id}`),
  create: (data) => api.post('/trainer/', data),
  getAvailability: (trainerId) => api.get(`/trainer/${trainerId}/availability`),
  addAvailability: (trainerId, data) => api.post(`/trainer/${trainerId}/availability`, data),
}

export default api

