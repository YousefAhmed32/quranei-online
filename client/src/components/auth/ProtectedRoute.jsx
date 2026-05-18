import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}