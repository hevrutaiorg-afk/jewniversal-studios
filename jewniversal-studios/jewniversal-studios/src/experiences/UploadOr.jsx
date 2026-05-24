import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Palette ───────────────────────────────────────────────────────────────────
const GOLD = '#C9A84C'
const GOLD_GLOW = 'rgba(201,168,76,'
const DEEP = '#070D1A'
const STONE = '#1C1508'
const STONE_LIGHT = '#2A2010'

// ── Stone Wall ────────────────────────────────────────────────────────────────
const ROWS = [
  [1.2, 0.9, 1.1, 0.95, 1.05, 1.0],
  [0.95, 1.15, 1.0, 1.1, 0.9, 1.05],
  [1.1, 1.0, 0.9, 1.2, 0.95, 1.0],
  [1.0, 0.95, 1.1, 0.9, 1.15, 1.0],
  [1.05, 1.1, 1.0, 0.95, 1.0, 1.1],
  [0.9, 1.0, 1.15, 1.05, 0.95, 1.1],
  [1.1, 0.9, 1.0, 1.1, 1.0, 0.95],
]

function StoneWall({ threads }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
      padding: '3px',
      overflow: 'hidden',
    }}>
      {ROWS.map((row, ri) => (
        <div key={ri} style={{
          display: 'flex',
          flex: 1,
          gap: '3px',
        }}>
          {row.map((w, ci) => (
            <div key={ci} style={{
              flex: w,
              background: `linear-gradient(135deg, ${STONE_LIGHT} 0%, ${STONE} 60%, #150F03 100%)`,
              borderRadius: '1px',
              position: 'relative',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,200,80,0.03)',
            }}>
              {/* Stone texture lines */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                  92deg,
                  transparent,
                  transparent 8px,
                  rgba(0,0,0,0.08) 8px,
                  rgba(0,0,0,0.08) 9px
                )`,
                borderRadius: '1px',
              }} />
            </div>
          ))}
        </div>
      ))}

      {/* Glowing cracks — these grow as memories accumulate */}
      {threads.length > 0 && (
        <svg style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Base cracks — always visible */}
          {[
            "M 20,0 L 22,15 L 18,30 L 24,50 L 20,70 L 23,100",
            "M 55,0 L 52,20 L 58,45 L 54,65 L 57,100",
            "M 78,10 L 75,35 L 80,60 L 76,100",
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              stroke={`${GOLD_GLOW}${0.15 + Math.min(threads.length * 0.05, 0.35)})`}
              strokeWidth="0.4"
              fill="none"
              filter="url(#glow)"
            />
          ))}
          {/* Additional cracks as threads grow */}
          {threads.length > 2 && (
            <path
              d="M 40,0 L 37,25 L 43,55 L 39,80 L 42,100"
              stroke={`${GOLD_GLOW}${Math.min((threads.length - 2) * 0.08, 0.4)})`}
              strokeWidth="0.4"
              fill="none"
              filter="url(#glow)"
            />
          )}
          {threads.length > 5 && (
            <path
              d="M 65,0 L 68,30 L 63,60 L 67,100"
              stroke={`${GOLD_GLOW}${Math.min((threads.length - 5) * 0.07, 0.35)})`}
              strokeWidth="0.3"
              fill="none"
              filter="url(#glow)"
            />
          )}
        </svg>
      )}

      {/* Memory threads — glowing text on the wall */}
      {threads.map((t) => (
        <div
          key={t.id}
          style={{
            position: 'absolute',
            left: `${t.x}%`,
            top: `${t.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '22%',
            textAlign: 'center',
            fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            color: `${GOLD_GLOW}0.85)`,
            textShadow: `0 0 8px ${GOLD_GLOW}0.6), 0 0 20px ${GOLD_GLOW}0.3)`,
            lineHeight: 1.4,
            animation: 'threadAppear 2s ease forwards',
            opacity: 0,
            pointerEvents: 'none',
            letterSpacing: '0.02em',
          }}
        >
          {t.thread}
        </div>
      ))}
    </div>
  )
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles({ count }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      size: Math.random() * 2 + 0.5,
      gold: Math.random() > 0.6,
    })), [count]
  )

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        @keyframes threadAppear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          30% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          bottom: 0,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.gold ? GOLD : 'rgba(180,200,255,0.8)',
          animation: `float ${p.duration}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UploadOr() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('invite') // invite | input | weaving | woven
  const [input, setInput] = useState('')
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentThread, setCurrentThread] = useState(null)
  const inputRef = useRef(null)

  // Position used threads avoid overlap
  const usedPositions = useRef([])

  const getPosition = () => {
    const zones = [
      { x: [15, 35], y: [15, 35] },
      { x: [55, 75], y: [15, 35] },
      { x: [15, 35], y: [50, 70] },
      { x: [55, 75], y: [50, 70] },
      { x: [35, 55], y: [30, 55] },
      { x: [70, 88], y: [30, 60] },
      { x: [8, 25], y: [60, 80] },
      { x: [60, 80], y: [65, 85] },
    ]
    const idx = usedPositions.current.length % zones.length
    const zone = zones[idx]
    usedPositions.current.push(idx)
    return {
      x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
      y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setError(null)
    setPhase('weaving')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a sacred weaver of Jewish memory. When given a fragment of someone's Jewish story or memory — however brief, however ordinary, however painful — transform it into a single luminous thread: a poetic 1-2 sentence distillation that honors the original while weaving it into the collective tapestry of Jewish memory across generations.

Respond ONLY with the thread itself. No preamble, no explanation, no quotation marks.
Keep it under 30 words.
Use the language of light, weaving, memory, time, and continuity — but stay grounded in the human truth of what was shared.
The thread should feel like it could be projected onto stone walls and read by a stranger who would recognize themselves in it.`,
          messages: [
            { role: 'user', content: input.trim() }
          ]
        })
      })

      const data = await response.json()
      const thread = data.content?.[0]?.text?.trim()

      if (!thread) throw new Error('No thread returned')

      const pos = getPosition()
      const newThread = {
        id: Date.now(),
        original: input.trim(),
        thread,
        x: pos.x,
        y: pos.y,
      }

      setCurrentThread(newThread)
      setThreads(prev => [...prev, newThread])
      setPhase('woven')
      setInput('')

    } catch (err) {
      console.error(err)
      setError('The light could not be woven. Please try again.')
      setPhase('input')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: DEEP,
      color: '#E8D5A3',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Particles count={30} />

      {/* Nav */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        background: 'linear-gradient(rgba(7,13,26,0.95), transparent)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(232,213,163,0.4)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ← Jewniversal Studios
        </button>
        <div style={{
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.5)',
        }}>
          {threads.length > 0 ? `${threads.length} thread${threads.length !== 1 ? 's' : ''} in the tapestry` : 'Upload / אוֹר'}
        </div>
      </div>

      {/* Stone wall — full screen background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        opacity: phase === 'invite' ? 0.4 : 0.85,
        transition: 'opacity 2s ease',
      }}>
        <StoneWall threads={threads} />
      </div>

      {/* Ambient glow over wall */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: `radial-gradient(ellipse at 50% 40%, ${GOLD_GLOW}0.06) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem 8rem',
        textAlign: 'center',
      }}>

        {/* ── INVITE PHASE ── */}
        {phase === 'invite' && (
          <div style={{
            maxWidth: '560px',
            animation: 'threadAppear 1.5s ease forwards',
          }}>
            <div style={{
              fontFamily: "'Times New Roman', serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: GOLD,
              letterSpacing: '0.2em',
              marginBottom: '1.5rem',
              textShadow: `0 0 30px ${GOLD_GLOW}0.4)`,
              direction: 'rtl',
            }}>
              עֲלֵה אוֹר
            </div>

            <h1 style={{
              fontWeight: 300,
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              letterSpacing: '0.08em',
              lineHeight: 0.95,
              marginBottom: '0.5rem',
            }}>
              Upload / אוֹר
            </h1>

            <div style={{
              fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
              color: 'rgba(138,159,194,0.8)',
              letterSpacing: '0.08em',
              marginBottom: '2.5rem',
            }}>
              A living tapestry of Jewish memory and light
            </div>

            <div style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              lineHeight: 1.8,
              color: 'rgba(232,213,163,0.65)',
              fontStyle: 'italic',
              marginBottom: '3rem',
              maxWidth: '420px',
              margin: '0 auto 3rem',
            }}>
              You are standing in front of a memory that remembers you.
              <br /><br />
              The cracks in this wall hold the prayers, stories, and fragments
              of Jewish lives across generations. Each note becomes light.
              Each line becomes a thread in the tapestry.
            </div>

            <div style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)',
              marginBottom: '2rem',
            }}>
              Dor l'dor &nbsp;·&nbsp; Zikaron &nbsp;·&nbsp; Or
            </div>

            <button
              onClick={() => { setPhase('input'); setTimeout(() => inputRef.current?.focus(), 100) }}
              style={{
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.8rem, 1.3vw, 1rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '0.85rem 2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.background = `${GOLD_GLOW}0.1)`
                e.target.style.boxShadow = `0 0 20px ${GOLD_GLOW}0.2)`
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent'
                e.target.style.boxShadow = 'none'
              }}
            >
              Add Your Light
            </button>
          </div>
        )}

        {/* ── INPUT PHASE ── */}
        {(phase === 'input' || phase === 'woven') && (
          <div style={{
            width: '100%',
            maxWidth: '640px',
          }}>
            {phase === 'woven' && currentThread && (
              <div style={{
                marginBottom: '3rem',
                padding: '2rem',
                border: `1px solid ${GOLD_GLOW}0.3)`,
                background: `${GOLD_GLOW}0.03)`,
                animation: 'threadAppear 1s ease forwards',
              }}>
                <div style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: `${GOLD_GLOW}0.5)`,
                  marginBottom: '1rem',
                }}>
                  Your thread has been woven into the tapestry
                </div>
                <div style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                  lineHeight: 1.7,
                  color: GOLD,
                  textShadow: `0 0 15px ${GOLD_GLOW}0.3)`,
                }}>
                  "{currentThread.thread}"
                </div>
              </div>
            )}

            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: `${GOLD_GLOW}0.5)`,
              marginBottom: '1rem',
            }}>
              {phase === 'woven' ? 'Add another thread' : 'Enter a fragment of your Jewish story'}
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
              }}
              placeholder="A memory. A name. A place. A prayer. A fragment of what you carry."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(7,13,26,0.8)',
                border: `1px solid ${GOLD_GLOW}0.25)`,
                color: '#E8D5A3',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                lineHeight: 1.7,
                padding: '1.25rem',
                resize: 'none',
                outline: 'none',
                letterSpacing: '0.02em',
                transition: 'border-color 0.3s ease',
                borderRadius: 0,
              }}
              onFocus={e => e.target.style.borderColor = `${GOLD_GLOW}0.5)`}
              onBlur={e => e.target.style.borderColor = `${GOLD_GLOW}0.25)`}
            />

            {error && (
              <div style={{
                color: 'rgba(255,120,80,0.7)',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                margin: '0.75rem 0',
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              gap: '1rem',
            }}>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'rgba(232,213,163,0.3)',
                fontStyle: 'italic',
              }}>
                {input.length > 0 ? `${input.length} characters` : 'Enter to weave · Shift+Enter for new line'}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                style={{
                  background: input.trim() && !loading ? `${GOLD_GLOW}0.1)` : 'transparent',
                  border: `1px solid ${input.trim() && !loading ? GOLD : GOLD_GLOW + '0.2)'}`,
                  color: input.trim() && !loading ? GOLD : `${GOLD_GLOW}0.3)`,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  padding: '0.7rem 1.75rem',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Weaving...' : 'Weave Into Light'}
              </button>
            </div>
          </div>
        )}

        {/* ── WEAVING PHASE ── */}
        {phase === 'weaving' && (
          <div style={{
            textAlign: 'center',
            animation: 'pulse 1.5s infinite ease',
          }}>
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: GOLD,
              textShadow: `0 0 30px ${GOLD_GLOW}0.6)`,
              marginBottom: '1.5rem',
              fontFamily: "'Times New Roman', serif",
              direction: 'rtl',
              letterSpacing: '0.2em',
            }}>
              אוֹר
            </div>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: `${GOLD_GLOW}0.6)`,
            }}>
              Weaving your memory into light…
            </div>
          </div>
        )}

      </div>

      {/* Bottom: tapestry count + view wall */}
      {threads.length > 0 && phase !== 'weaving' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '1.25rem 2rem',
          background: 'linear-gradient(transparent, rgba(7,13,26,0.95))',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: `${GOLD_GLOW}0.5)`,
            fontStyle: 'italic',
          }}>
            {threads.length} thread{threads.length !== 1 ? 's' : ''} of light in the tapestry
          </div>
          <div style={{
            width: '1px',
            height: '16px',
            background: `${GOLD_GLOW}0.2)`,
          }} />
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: `${GOLD_GLOW}0.4)`,
            fontStyle: 'italic',
          }}>
            Weaving memory into light and light into memory
          </div>
        </div>
      )}
    </div>
  )
}
