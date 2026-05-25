import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ── Helpers ───────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const lerpHex = (hex1, hex2, t) => {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  const r = Math.round(lerp(c1.r, c2.r, t));
  const g = Math.round(lerp(c1.g, c2.g, t));
  const b = Math.round(lerp(c1.b, c2.b, t));
  return `rgb(${r},${g},${b})`;
};

const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ── Star field ────────────────────────────────────────────────────────────────
const Stars = ({ opacity }) => {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      r: Math.random() * 1.4 + 0.3,
      twinkle: Math.random() * 3 + 1.5,
      delay: Math.random() * 4,
    })), []
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity, transition: "opacity 2s ease" }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.r * 2,
          height: s.r * 2,
          borderRadius: "50%",
          background: i % 5 === 0 ? "#C9A84C" : "#E8E0FF",
          animation: `twinkle ${s.twinkle}s ${s.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
};

// ── Candle particles ──────────────────────────────────────────────────────────
const CandleGlow = ({ intensity }) => (
  <div style={{
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
  }}>
    {[
      { left: "20%", top: "55%", size: 180, color: "255,160,40" },
      { left: "50%", top: "60%", size: 260, color: "200,140,50" },
      { left: "78%", top: "52%", size: 160, color: "255,180,60" },
      { left: "35%", top: "70%", size: 200, color: "220,130,30" },
      { left: "65%", top: "65%", size: 140, color: "255,200,80" },
    ].map((c, i) => (
      <div key={i} style={{
        position: "absolute",
        left: c.left,
        top: c.top,
        transform: "translate(-50%, -50%)",
        width: c.size,
        height: c.size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(${c.color},${0.12 * intensity}) 0%, transparent 70%)`,
        pointerEvents: "none",
        transition: "opacity 1.5s ease",
      }} />
    ))}
  </div>
);

// ── Projection rays ───────────────────────────────────────────────────────────
const ProjectionRays = ({ intensity }) => (
  <div style={{
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    opacity: intensity,
    transition: "opacity 2s ease",
  }}>
    {[15, 35, 50, 65, 82].map((angle, i) => (
      <div key={i} style={{
        position: "absolute",
        top: 0,
        left: `${angle}%`,
        width: "1px",
        height: "100%",
        background: `linear-gradient(to bottom, rgba(100,140,255,0.12) 0%, transparent 80%)`,
        transform: `rotate(${(angle - 50) * 0.15}deg)`,
        transformOrigin: "top center",
      }} />
    ))}
    <div style={{
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60%",
      height: "40%",
      background: "radial-gradient(ellipse at top, rgba(80,100,200,0.08) 0%, transparent 70%)",
    }} />
  </div>
);

// ── Fabric texture overlay ─────────────────────────────────────────────────────
const FabricOverlay = ({ t }) => (
  <div style={{
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.025,
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(${t < 0.5 ? "139,105,20" : "200,168,76"},0.8) 2px,
      rgba(${t < 0.5 ? "139,105,20" : "200,168,76"},0.8) 3px
    )`,
  }} />
);

// ── Tent silhouette ────────────────────────────────────────────────────────────
const TentSilhouette = ({ t }) => (
  <div style={{
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(600px, 90vw)",
    pointerEvents: "none",
    opacity: lerp(0.06, 0.12, t),
    transition: "opacity 1s ease",
  }}>
    <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M300 20 L540 280 L60 280 Z"
        fill={t < 0.5 ? "#8B6914" : "#C9A84C"}
        opacity="0.6"
      />
      <line x1="300" y1="20" x2="300" y2="280" stroke={t < 0.5 ? "#8B6914" : "#E8D5A3"} strokeWidth="2" opacity="0.8" />
      <ellipse cx="300" cy="20" rx="6" ry="6" fill={t < 0.5 ? "#C9A84C" : "#E8E0FF"} />
    </svg>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OhelOr() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState(0); // 0–100
  const t = raw / 100;
  const eased = ease(t);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const bg = lerpHex("#F5EDD8", "#070D1A", eased);
  const textPrimary = lerpHex("#2C2416", "#E8D5A3", eased);
  const textSub = lerpHex("#5C5047", "#8A9FC2", eased);
  const accent = lerpHex("#8B6914", "#C9A84C", eased);
  const borderC = `rgba(${eased < 0.5 ? "139,105,20" : "201,168,76"},${lerp(0.2, 0.35, eased)})`;

  // Phase labels
  const phases = [
    { range: [0, 0.15], label: "The sanctuary awakens with morning light" },
    { range: [0.15, 0.45], label: "The circle gathers in the warmth of day" },
    { range: [0.45, 0.6], label: "Dusk softens the canvas walls…" },
    { range: [0.6, 0.8], label: "As evening falls, the tent transforms" },
    { range: [0.8, 1.01], label: "Night brings the tent into its deepest life" },
  ];
  const phase = phases.find(([s, e]) => t >= s && t < e, 0)?.label
    ?? phases.find(p => t >= p.range[0] && t < p.range[1])?.label
    ?? phases[phases.length - 1].label;
  const currentPhase = phases.find(p => t >= p.range[0] && t < p.range[1]) ?? phases[phases.length - 1];

  const dayItems = [
    { label: "Breath & movement circles", icon: "◯" },
    { label: "Embodied text study", icon: "◈" },
    { label: "Journaling & book arts", icon: "◎" },
    { label: "Tea & communal gathering", icon: "◇" },
    { label: "Sound & breath integration", icon: "◉" },
  ];

  const nightItems = [
    { label: "Sound immersion & singing bowls", icon: "◉" },
    { label: "Upload Or — memory projection", icon: "◈" },
    { label: "Contemplative ceremony", icon: "◎" },
    { label: "Collective archive tapestry", icon: "◇" },
    { label: "Threshold & sacred atmosphere", icon: "◯" },
  ];

  const dayOpacity = Math.max(0, 1 - t * 2.5);
  const nightOpacity = Math.max(0, (t - 0.4) * 2.5);

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      color: textPrimary,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.6s ease, color 0.6s ease",
      paddingBottom: "120px",
    }}>
      {/* Layers */}
      <FabricOverlay t={t} />
      <Stars opacity={Math.max(0, (t - 0.4) * 2)} />
      <CandleGlow intensity={1 - t * 0.6} />
      <ProjectionRays intensity={Math.max(0, (t - 0.55) * 2.5)} />
      <TentSilhouette t={t} />

      {/* Large background Hebrew Or */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(200px, 45vw, 480px)",
        fontFamily: "'Times New Roman', serif",
        color: eased < 0.5
          ? `rgba(139,105,20,${lerp(0.03, 0.05, eased)})`
          : `rgba(201,168,76,${lerp(0.03, 0.07, eased)})`,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        letterSpacing: "0.05em",
        transition: "color 1s ease",
        zIndex: 0,
        direction: "rtl",
      }}>
        אוֹר
      </div>

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Nav line */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2.5rem",
          borderBottom: `1px solid ${borderC}`,
          transition: "border-color 0.6s ease",
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.7rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: textSub,
              transition: "color 0.6s ease", padding: 0,
            }}
          >
            ← Jewniversal Studios
          </button>
          <div style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: textSub,
            transition: "color 0.6s ease",
          }}>
            {t < 0.5 ? "Day Circle" : "Night Sanctuary"} &nbsp;·&nbsp; Highwood, IL
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "6vh 2rem 4vh" }}>
          <div style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            letterSpacing: "0.35em",
            color: accent,
            marginBottom: "0.75rem",
            direction: "rtl",
            transition: "color 0.6s ease",
          }}>
            אֹהֶל אוֹר
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            margin: "0 0 0.5rem",
            letterSpacing: "0.08em",
            lineHeight: 0.95,
            transition: "color 0.6s ease",
          }}>
            Ohel Or
          </h1>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
            color: textSub,
            letterSpacing: "0.12em",
            marginBottom: "3vh",
            transition: "color 0.6s ease",
          }}>
            portable jewish sanctuary culture
          </div>

          {/* Phase label */}
          <div style={{
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
            color: accent,
            minHeight: "2em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.6s ease",
            marginBottom: "5vh",
          }}>
            {currentPhase?.label ?? phases[phases.length - 1].label}
          </div>
        </div>

        {/* Threshold line */}
        <div style={{
          textAlign: "center",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: textSub,
          marginBottom: "5vh",
          opacity: 0.7,
          transition: "color 0.6s ease",
        }}>
          kiyyor &nbsp;·&nbsp; threshold &nbsp;·&nbsp; {t < 0.5 ? "mishkan" : "or"} &nbsp;·&nbsp; gathering
        </div>

        {/* Offerings — cross-fade day/night */}
        <div style={{ position: "relative", minHeight: "220px", maxWidth: "800px", margin: "0 auto 5vh", padding: "0 2rem" }}>

          {/* Day offerings */}
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: dayOpacity,
            transition: "opacity 0.8s ease",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}>
            <div style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: lerpHex("#8B6914", "#C9A84C", eased), marginBottom: "0.5rem" }}>
              Day Circle — What is offered
            </div>
            {dayItems.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.6rem 1.2rem",
                border: `1px solid ${borderC}`,
                borderRadius: "2px",
                background: `rgba(139,105,20,0.03)`,
                fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                color: textPrimary,
                transition: "all 0.6s ease",
              }}>
                <span style={{ color: accent, opacity: 0.7, flexShrink: 0, fontSize: "0.8rem" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* Night offerings */}
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: nightOpacity,
            transition: "opacity 0.8s ease",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}>
            <div style={{ textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: lerpHex("#8B6914", "#C9A84C", eased), marginBottom: "0.5rem" }}>
              Night Sanctuary — What awaits
            </div>
            {nightItems.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.6rem 1.2rem",
                border: `1px solid rgba(100,140,255,0.2)`,
                borderRadius: "2px",
                background: `rgba(80,100,200,0.04)`,
                fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                color: textPrimary,
                transition: "all 0.6s ease",
              }}>
                <span style={{ color: "#8AA0D4", opacity: 0.8, flexShrink: 0, fontSize: "0.8rem" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mishkan line */}
        <div style={{
          textAlign: "center",
          maxWidth: "560px",
          margin: "0 auto 5vh",
          padding: "0 2rem",
          fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
          fontStyle: "italic",
          color: textSub,
          lineHeight: 1.7,
          transition: "color 0.6s ease",
        }}>
          {t < 0.5
            ? "V'asu li mikdash v'shachanti b'tocham — Make me a sanctuary and I will dwell among them."
            : "The tent transforms. The gathering deepens. Or moves between them."
          }
        </div>

        {/* Eco badge */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
          padding: "0 2rem",
          marginBottom: "2rem",
        }}>
          {["Ohel Or", "Upload Or", "Jewniversal Studios", "HevrutAI"].map((name, i) => (
            <div key={i} style={{
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: textSub,
              opacity: i === 0 ? 1 : 0.4,
              borderBottom: i === 0 ? `1px solid ${accent}` : "none",
              paddingBottom: "2px",
              transition: "color 0.6s ease",
            }}>
              {name}
            </div>
          ))}
        </div>

      </div>

      {/* ── TIME OF DAY CONTROL ─────────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: "1.5rem 2.5rem 2rem",
        background: eased < 0.5
          ? `linear-gradient(transparent, rgba(245,237,216,0.97))`
          : `linear-gradient(transparent, rgba(7,13,26,0.98))`,
        transition: "background 0.8s ease",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: textSub,
            transition: "color 0.6s ease",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.9rem" }}>☀</span> Dawn
            </span>
            <span style={{ fontStyle: "italic", opacity: 0.7 }}>
              move the light
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              Night <span style={{ fontSize: "0.9rem" }}>☽</span>
            </span>
          </div>

          {/* Track */}
          <div style={{ position: "relative", height: "26px", display: "flex", alignItems: "center" }}>
            <div style={{
              width: "100%",
              height: "1px",
              background: eased < 0.5
                ? "linear-gradient(to right, rgba(255,180,50,0.5), rgba(139,105,20,0.3))"
                : "linear-gradient(to right, rgba(201,168,76,0.4), rgba(100,140,255,0.5))",
              transition: "background 0.8s ease",
              position: "relative",
            }}>
              {/* Progress fill */}
              <div style={{
                position: "absolute",
                left: 0,
                top: "-0.5px",
                height: "2px",
                width: `${t * 100}%`,
                background: eased < 0.5
                  ? "linear-gradient(to right, #FFB830, #C9A84C)"
                  : "linear-gradient(to right, #C9A84C, #6490FF)",
                transition: "width 0.05s, background 0.8s ease",
              }} />
            </div>

            {/* Sun/Moon thumb */}
            <div style={{
              position: "absolute",
              left: `calc(${t * 100}% - 13px)`,
              top: "50%",
              transform: "translateY(-50%)",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: eased < 0.5
                ? `radial-gradient(circle at 38% 38%, #FFF0A0, #E8A830 40%, #C07010)`
                : `radial-gradient(circle at 38% 38%, #F0F0FF, #C8D0F0 40%, #7080B0)`,
              boxShadow: eased < 0.5
                ? `0 0 ${lerp(8, 20, eased)}px rgba(255,180,50,${lerp(0.5, 0.3, eased)})`
                : `0 0 ${lerp(8, 18, eased)}px rgba(100,140,255,${lerp(0.2, 0.7, eased)})`,
              transition: "background 0.8s ease, box-shadow 0.5s ease",
              pointerEvents: "none",
              zIndex: 2,
            }} />

            {/* Invisible range input */}
            <input
              type="range"
              min="0"
              max="100"
              value={raw}
              onChange={(e) => setRaw(Number(e.target.value))}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                opacity: 0,
                cursor: "pointer",
                margin: 0,
                zIndex: 3,
              }}
            />
          </div>

          {/* Horizon dots */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}>
            {["Dawn", "Morning", "Afternoon", "Dusk", "Evening", "Night"].map((label, i, arr) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                opacity: Math.abs(t - i / (arr.length - 1)) < 0.12 ? 0.9 : 0.25,
                transition: "opacity 0.4s ease",
              }}>
                <div style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: textSub,
                  transition: "background 0.6s ease",
                }} />
                <span style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: textSub,
                  transition: "color 0.6s ease",
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        input[type=range]::-moz-range-thumb { opacity: 0; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
