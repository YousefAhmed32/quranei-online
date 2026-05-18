import toast from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const G = '#dfab70'

const BASE = {
  fontFamily: 'Cairo, sans-serif',
  direction: 'rtl',
  borderRadius: '14px',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: '500',
  maxWidth: '380px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

export const qToast = {
  success: (msg) => toast.custom(
    <div style={{ ...BASE, background: 'rgba(10,22,40,0.97)', border: '1px solid rgba(34,197,94,0.3)', color: '#fff' }}>
      <CheckCircle style={{ color: '#22c55e', flexShrink: 0, width: 18, height: 18 }} />
      <span>{msg}</span>
    </div>,
    { duration: 3500, position: 'top-left' }
  ),

  error: (msg) => toast.custom(
    <div style={{ ...BASE, background: 'rgba(10,22,40,0.97)', border: '1px solid rgba(239,68,68,0.3)', color: '#fff' }}>
      <XCircle style={{ color: '#ef4444', flexShrink: 0, width: 18, height: 18 }} />
      <span>{msg}</span>
    </div>,
    { duration: 4500, position: 'top-left' }
  ),

  warning: (msg) => toast.custom(
    <div style={{ ...BASE, background: 'rgba(10,22,40,0.97)', border: '1px solid rgba(251,146,60,0.3)', color: '#fff' }}>
      <AlertTriangle style={{ color: '#fb923c', flexShrink: 0, width: 18, height: 18 }} />
      <span>{msg}</span>
    </div>,
    { duration: 4000, position: 'top-left' }
  ),

  info: (msg) => toast.custom(
    <div style={{ ...BASE, background: 'rgba(10,22,40,0.97)', border: `1px solid rgba(223,171,112,0.25)`, color: '#fff' }}>
      <Info style={{ color: G, flexShrink: 0, width: 18, height: 18 }} />
      <span>{msg}</span>
    </div>,
    { duration: 3500, position: 'top-left' }
  ),

  loading: (msg) => toast.loading(msg, {
    position: 'top-left',
    style: { ...BASE, background: 'rgba(10,22,40,0.97)', border: `1px solid rgba(223,171,112,0.2)`, color: '#fff' },
  }),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, msgs) => toast.promise(promise, msgs, {
    position: 'top-left',
    style: { ...BASE, background: 'rgba(10,22,40,0.97)', border: `1px solid rgba(223,171,112,0.2)`, color: '#fff' },
  }),
}

export default qToast
