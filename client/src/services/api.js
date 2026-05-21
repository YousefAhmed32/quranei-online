import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.quranei.com/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('qurani-auth') || '{}')?.state?.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qurani-auth')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api

// ── Course helpers ──────────────────────────────────────────────────────────
export const courseService = {
  getPublic: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getBySlug: (slug) => api.get(`/courses/${slug}`),

  adminGetAll: (params) => api.get('/courses/admin/all', { params }),
  adminCreate: (data) => api.post('/courses/admin/create', data),
  adminUpdate: (id, data) => api.put(`/courses/admin/${id}`, data),
  adminDelete: (id) => api.delete(`/courses/admin/${id}`),

  adminReorder: (orderedIds) =>
    api.post('/courses/admin/reorder', { orderedIds }),
}

// ── Teacher helpers ─────────────────────────────────────────────────────────
export const teacherService = {
  getPublic: () => api.get('/teachers'),

  adminGetAll: () => api.get('/teachers/admin/all'),
  adminCreate: (data) => api.post('/teachers/admin/create', data),
  adminUpdate: (id, data) => api.put(`/teachers/admin/${id}`, data),
  adminDelete: (id) => api.delete(`/teachers/admin/${id}`),
}

// ── Media helpers ───────────────────────────────────────────────────────────
export const mediaService = {
  upload: (file, onProgress) => {
    const form = new FormData()

    form.append('file', file)

    return api.post('/media/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      onUploadProgress: (e) =>
        onProgress &&
        onProgress(Math.round((e.loaded * 100) / e.total)),
    })
  },

  getUrl: (id) =>
    id
      ? `https://api.quranei.com/api/media/stream/${id}`
      : null,
}