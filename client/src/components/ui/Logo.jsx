export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { icon: 32, text: 'text-sm' },
    md: { icon: 44, text: 'text-base' },
    lg: { icon: 64, text: 'text-xl' },
  }
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ direction: 'ltr' }}>
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#906130" />
              <stop offset="50%" stopColor="#dfab70" />
              <stop offset="100%" stopColor="#906130" />
            </linearGradient>
            <linearGradient id="logoNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a3a5c" />
              <stop offset="100%" stopColor="#112847" />
            </linearGradient>
          </defs>
          {/* Arch shape */}
          <path d="M22 2 C12 2, 4 10, 4 20 L4 32 L40 32 L40 20 C40 10, 32 2, 22 2Z"
            fill="url(#logoNavy)" stroke="url(#logoGold)" strokeWidth="1" />
          {/* Crescent */}
          <path d="M22 6 C26 6, 30 9, 30 14 C27 12, 23 13, 22 16 C20 13, 17 14, 16 16 C15 11, 18 6, 22 6Z"
            fill="url(#logoGold)" />
          {/* Book */}
          <path d="M8 36 L22 32 L36 36 L36 42 L22 38 L8 42 Z" fill="url(#logoGold)" />
          <path d="M22 32 L22 38" stroke="url(#logoNavy)" strokeWidth="1" />
          {/* Arabic ق suggestion */}
          <text x="22" y="29" textAnchor="middle" fontSize="10" fontFamily="Cairo, serif" fill="url(#logoGold)" fontWeight="700">ق</text>
        </svg>
      </div>
      <div style={{ direction: 'ltr' }}>
        <div className={`font-bold leading-none ${s.text}`} style={{
          background: 'linear-gradient(135deg, #906130, #dfab70)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Cinzel, serif',
          letterSpacing: '0.1em',
        }}>
          Qurani
        </div>
        <div className="text-xs tracking-widest" style={{ color: '#5e779a', fontFamily: 'Cinzel, serif' }}>
          Online
        </div>
      </div>
    </div>
  )
}
