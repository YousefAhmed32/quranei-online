import { useEffect, useRef } from 'react'

export default function ParticlesBackground({ count = 30 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #dfab70, #906130);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        opacity: 0;
        animation: particle ${Math.random() * 10 + 8}s linear ${Math.random() * 8}s infinite;
        filter: blur(${size > 2 ? 1 : 0}px);
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [count])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
