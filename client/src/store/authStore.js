import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'خطأ في تسجيل الدخول' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', userData)
          set({ isLoading: false })
          return { success: true, message: data.message }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'خطأ في التسجيل' }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        delete api.defaults.headers.common['Authorization']
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),

      initAuth: () => {
        const { token } = get()
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },

      // Dev quick login
      quickLogin: async (role) => {
        const credentials = {
          admin: { email: 'admin@qurani.online', password: 'Admin@123' },
          student: { email: 'student@qurani.online', password: 'Student@123' },
        }
        return get().login(credentials[role].email, credentials[role].password)
      },
    }),
    {
      name: 'qurani-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
