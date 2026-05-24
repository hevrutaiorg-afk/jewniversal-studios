import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const GOLD = '#C9A84C'
const DEEP_BLUE = '#1A3A5C'
const NAV = '#070D1A'

const projects = [
  {
    path: '/ohel-or',
    hebrew: 'אֹהֶל אוֹר',
    name: 'Ohel Or',
    sub: 'Tent of Light',
    desc: 'Portable Jewish sanctuary culture. Embodied practice, breath, sound, and communal gathering through the Mishkan framework.',
    tag: 'Somatic Practice',
    color: '#C9A84C',
  },
  {
    path: '/upload-or',
    hebrew: 'אוֹר',
    name: 'Upload Or',
    sub: 'Upload Light',
    desc: 'A participatory Jewish memory installation. Every fragment becomes a thread of light woven into the living tapestry.',
    tag: 'Memory Installation',
    color: '#6490FF',
  },
  {
    path: 'https://hevrutai.org',
    external: true,
    hebrew: 'חֶבְרוּתָא',
    name: 'HevrutAI',
    sub: 'Forensic Truth',
    desc: 'AI-powered forensic verification system for Jewish historical truth and Israel-related geopolitics.',
    tag: 'Forensic AI',
    color: '#8B6914',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const handleNav = (p) => {
    if (p.external) { window.open(p.path, '_blank'); return }
    navigate(p.path)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: NAV,
      color: '#E8D5A3',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Star field */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 97.3) % 100}%`,
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            borderRadius: '50%',
            background: i % 7 === 0 ? GOLD : '#E8E0FF',
            opacity: 0.3 + (i % 5) * 0.1,
          }} />
        ))}
      </div>

      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: 'clamp(3rem, 8vh, 6rem) 2rem clamp(2rem, 4vh, 3rem)',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'none' : 'translateY(20px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
      }}>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: GOLD,
          opacity: 0.7,
          marginBottom: '1rem',
        }}>
          Stacy La Mell &nbsp;·&nbsp; Artist, Educator, Creator
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          letterSpacing: '0.1em',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}>
          Jewniversal Studios
        </h1>

        <div style={{
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
          color: '#8A9FC2',
          letterSpacing: '0.08em',
          marginBottom: '2rem',
        }}>
          Jewish cultural creation &nbsp;·&nbsp; sanctuary &nbsp;·&nbsp; memory &nbsp;·&nbsp; light
        </div>

        <div style={{
          width: '60px',
          height: '1px',
          background: GOLD,
          margin: '0 auto',
          opacity: 0.4,
        }} />
      </header>

      {/* Project cards */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        {projects.map((p, i) => (
          <div
            key={p.name}
            onClick={() => handleNav(p)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: 'clamp(260px, 30vw, 340px)',
              border: `1px solid ${hovered === i ? p.color : 'rgba(201,168,76,0.15)'}`,
              padding: '2rem',
              cursor: 'pointer',
              background: hovered === i ? `rgba(${p.color === '#6490FF' ? '100,144,255' : '201,168,76'},0.04)` : 'transparent',
              transition: 'all 0.4s ease',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(30px)',
              transitionDelay: `${0.3 + i * 0.15}s`,
              position: 'relative',
            }}
          >
            {/* Hebrew */}
            <div style={{
              fontFamily: "'Times New Roman', serif",
              fontSize: '1.4rem',
              color: p.color,
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              opacity: 0.8,
              direction: 'rtl',
            }}>
              {p.hebrew}
            </div>

            {/* Tag */}
            <div style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: p.color,
              opacity: 0.6,
              marginBottom: '0.75rem',
            }}>
              {p.tag}
            </div>

            {/* Name */}
            <h2 style={{
              fontWeight: 400,
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              letterSpacing: '0.05em',
              marginBottom: '0.15rem',
              lineHeight: 1,
            }}>
              {p.name}
            </h2>

            <div style={{
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: '#8A9FC2',
              marginBottom: '1.25rem',
              letterSpacing: '0.05em',
            }}>
              {p.sub}
            </div>

            <div style={{
              fontSize: '0.9rem',
              lineHeight: 1.65,
              color: 'rgba(232,213,163,0.65)',
              fontStyle: 'italic',
            }}>
              {p.desc}
            </div>

            {/* Arrow */}
            <div style={{
              marginTop: '1.5rem',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: p.color,
              opacity: hovered === i ? 0.9 : 0.3,
              transition: 'opacity 0.3s ease',
            }}>
              Enter →
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(232,213,163,0.25)',
      }}>
        © 2025 Stacy La Mell &nbsp;·&nbsp; Jewniversal Studios
      </footer>
    </div>
  )
}
