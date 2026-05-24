import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const lerpHex = (hex1, hex2, t) => {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  return `rgb(${Math.round(lerp(c1.r, c2.r, t))},${Math.round(lerp(c1.g, c2.g, t))},${Math.round(lerp(c1.b, c2.b, t))})`;
};

const Stars = ({ opacity }) => {
  const stars = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      x: (i * 137.5) % 100, y: (i * 97.3) % 80,
      r: i % 4 === 0 ? 1.5 : 0.8,
      delay: (i * 0.3) % 4, speed: 2 + (i % 3),
    })), []
  );
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity, transition: "opacity 2s ease" }}>
      <style>{`@keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.r * 2, height: s.r * 2, borderRadius: "50%",
          background: i % 5 === 0 ? "#C9A84C" : "#E8E0FF",
          animation: `twinkle ${s.speed}s ${s.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
};

const DAY_OFFERINGS = [
  { icon: "◯", text: "Breath & movement circles" },
  { icon: "◈", text: "Embodied text study" },
  { icon: "◎", text: "Journaling & book arts" },
  { icon: "◇", text: "Tea & communal gathering" },
  { icon: "◉", text: "Sound & breath integration" },
];

const NIGHT_OFFERINGS = [
  { icon: "◉", text: "Sound immersion & singing bowls" },
  { icon: "◈", text: "Upload Or — memory projection" },
  { icon: "◎", text: "Contemplative ceremony" },
  { icon: "◇", text: "Collective archive tapestry" },
  { icon: "◯", text: "Threshold & sacred atmosphere" },
];

// Custom touch+mouse slider — works on all browsers and devices
function SanctuaryDial({ value, onChange }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  const getValueFromEvent = (clientX) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return pct;
  };

  // Mouse events
  const onMouseDown = (e) => {
    isDragging.current = true;
    onChange(getValueFromEvent(e.clientX));
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    onChange(getValueFromEvent(e.clientX));
  };
  const onMouseUp = () => { isDragging.current = false; };

  // Touch events
  const onTouchStart = (e) => {
    isDragging.current = true;
    onChange(getValueFromEvent(e.touches[0].clientX));
    e.preventDefault();
  };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    onChange(getValueFromEvent(e.touches[0].clientX));
    e.preventDefault();
  };
  const onTouchEnd = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  });

  const eased = ease(value);

  return (
    <div
      ref={trackRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        position: "relative",
        height: "60px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Track background */}
      <div style={{
        width: "100%", height: "4px", borderRadius: "2px",
        background: eased < 0.5
          ? "linear-gradient(to right, rgba(255,180,50,0.4), rgba(139,105,20,0.15))"
          : "linear-gradient(to right, rgba(201,168,76,0.4), rgba(100,140,255,0.4))",
        transition: "background 0.8s ease",
        position: "relative",
      }}>
        {/* Fill */}
        <div style={{
          position: "absolute", left: 0, top: 0,
          height: "4px", borderRadius: "2px",
          width: `${value * 100}%`,
          background: eased < 0.5
            ? "linear-gradient(to right, #FFB830, #C9A84C)"
            : "linear-gradient(to right, #C9A84C, #6490FF)",
        }} />
      </div>

      {/* Sun / Moon thumb */}
      <div style={{
        position: "absolute",
        left: `calc(${value * 100}% - 24px)`,
        top: "50%", transform: "translateY(-50%)",
        width: "48px", height: "48px",
        borderRadius: "50%",
        background: eased < 0.5
          ? "radial-gradient(circle at 38% 38%, #FFF0A0, #E8A830 40%, #C07010)"
          : "radial-gradient(circle at 38% 38%, #F0F0FF, #C8D0F0 40%, #7080B0)",
        boxShadow: eased < 0.5
          ? `0 0 ${lerp(14, 30, eased)}px rgba(255,180,50,0.9)`
          : `0 0 ${lerp(10, 26, eased)}px rgba(100,140,255,0.9)`,
        transition: "background 0.8s ease, box-shadow 0.5s ease",
        pointerEvents: "none",
        // Larger invisible touch target
        outline: "12px solid transparent",
      }} />
    </div>
  );
}

export default function OhelOr() {
  const navigate = useNavigate();
  const [t, setT] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const eased = ease(t);

  const bg = lerpHex("#F5EDD8", "#070D1A", eased);
  const textPrimary = lerpHex("#2C2416", "#E8D5A3", eased);
  const textSub = lerpHex("#5C5047", "#8A9FC2", eased);
  const accent = lerpHex("#8B6914", "#C9A84C", eased);
  const borderC = `rgba(${eased < 0.5 ? "139,105,20" : "201,168,76"},${lerp(0.25, 0.4, eased)})`;

  const phase = t < 0.15 ? "The sanctuary opens with morning light"
    : t < 0.45 ? "The circle gathers in the warmth of day"
    : t < 0.6 ? "Dusk softens the canvas walls…"
    : t < 0.8 ? "As evening falls, the tent transforms"
    : "Night brings the tent into its deepest life";

  const offerings = t < 0.5 ? DAY_OFFERINGS : NIGHT_OFFERINGS;
  const offeringLabel = t < 0.5 ? "Day Circle — What is offered" : "Night Sanctuary — What awaits";

  const handleDialChange = (val) => {
    setT(val);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <div style={{
      minHeight: "100vh", background: bg, color: textPrimary,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      transition: "background 0.8s ease, color 0.8s ease",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes breathe { 0%,100%{opacity:0.6} 50%{opacity:1} }
        * { box-sizing: border-box; }
      `}</style>

      <Stars opacity={Math.max(0, (t - 0.4) * 2)} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: eased < 0.5
          ? `radial-gradient(ellipse at 50% 30%, rgba(255,200,80,${0.07 + eased * 0.04}) 0%, transparent 60%)`
          : `radial-gradient(ellipse at 50% 30%, rgba(80,120,255,${eased * 0.08}) 0%, transparent 60%)`,
        transition: "background 1s ease", zIndex: 0,
      }} />

      {/* Background Hebrew Or */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(160px, 38vw, 420px)",
        fontFamily: "'Times New Roman', serif",
        color: eased < 0.5 ? "rgba(139,105,20,0.04)" : "rgba(201,168,76,0.05)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        direction: "rtl", zIndex: 0, transition: "color 1s ease",
      }}>
        אוֹר
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Nav */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.5rem 2rem", borderBottom: `1px solid ${borderC}`,
          transition: "border-color 0.6s ease",
        }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: textSub, transition: "color 0.6s ease", padding: 0,
          }}>
            ← Jewniversal Studios
          </button>
          <div style={{
            fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: textSub, transition: "color 0.6s ease",
          }}>
            {t < 0.5 ? "Day Circle" : "Night Sanctuary"}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", padding: "4vh 2rem 2vh" }}>
          <div style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            letterSpacing: "0.3em", color: accent,
            marginBottom: "0.5rem", direction: "rtl",
            transition: "color 0.6s ease",
          }}>
            אֹהֶל אוֹר
          </div>
          <h1 style={{
            fontWeight: 300, fontSize: "clamp(3.5rem, 9vw, 7rem)",
            letterSpacing: "0.08em", lineHeight: 0.95, margin: "0 0 0.5rem",
          }}>
            Ohel Or
          </h1>
          <div style={{
            fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            color: textSub, letterSpacing: "0.1em",
            transition: "color 0.6s ease",
          }}>
            portable jewish sanctuary culture
          </div>
        </div>

        {/* HERO DIAL */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "3vh 2rem 2vh",
        }}>
          {/* Instruction / phase label */}
          <div style={{
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            fontStyle: "italic", color: accent,
            letterSpacing: "0.08em", marginBottom: "2rem",
            textAlign: "center", minHeight: "2.5em",
            transition: "color 0.6s ease",
            animation: !hasInteracted ? "breathe 3s infinite ease" : "none",
            padding: "0 1rem",
          }}>
            {!hasInteracted
              ? <>Drag or tap the light to enter the sanctuary<br /><span style={{ fontSize: "1.5rem" }}>☀ ——————— ☽</span></>
              : phase
            }
          </div>

          {/* Dial box */}
          <div style={{
            width: "min(580px, 92vw)",
            padding: "2rem 2.5rem 2rem",
            border: `2px solid ${borderC}`,
            background: eased < 0.5 ? "rgba(139,105,20,0.05)" : "rgba(100,140,255,0.05)",
            transition: "border-color 0.6s ease, background 0.6s ease",
          }}>

            {/* Day / Night labels */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: "1.5rem", alignItems: "center",
            }}>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: textSub, opacity: t < 0.5 ? 1 : 0.4,
                transition: "opacity 0.5s, color 0.6s ease",
              }}>
                <span style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>☀</span> Day
              </span>
              <span style={{
                fontSize: "clamp(0.8rem, 1.3vw, 1rem)",
                fontStyle: "italic", color: textSub, opacity: 0.5,
                transition: "color 0.6s ease", textAlign: "center",
              }}>
                {t < 0.5 ? "slide toward night →" : "← slide toward day"}
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: textSub, opacity: t >= 0.5 ? 1 : 0.4,
                transition: "opacity 0.5s, color 0.6s ease",
              }}>
                Night <span style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>☽</span>
              </span>
            </div>

            {/* The custom dial */}
            <SanctuaryDial value={t} onChange={handleDialChange} />

            {/* Time markers */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: "1rem",
            }}>
              {["Dawn", "Morning", "Afternoon", "Dusk", "Evening", "Night"].map((label, i, arr) => (
                <div
                  key={i}
                  onClick={() => handleDialChange(i / (arr.length - 1))}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "5px", cursor: "pointer",
                    opacity: Math.abs(t - i / (arr.length - 1)) < 0.15 ? 1 : 0.3,
                    transition: "opacity 0.4s ease",
                    padding: "4px 2px",
                  }}
                >
                  <div style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: textSub, transition: "background 0.6s ease",
                  }} />
                  <span style={{
                    fontSize: "clamp(0.65rem, 1vw, 0.8rem)",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: textSub, transition: "color 0.6s ease",
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tap hint for mobile */}
          <div style={{
            marginTop: "1rem",
            fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)",
            fontStyle: "italic", color: textSub, opacity: 0.5,
            transition: "color 0.6s ease",
          }}>
            tap a time of day or drag the light
          </div>
        </div>

        {/* Offerings */}
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2vh 2rem 4vh", width: "100%" }}>
          <div style={{
            textAlign: "center",
            fontSize: "clamp(0.8rem, 1.3vw, 1rem)",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: accent, marginBottom: "1.5rem",
            transition: "color 0.6s ease",
          }}>
            {offeringLabel}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {offerings.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.5rem", border: `1px solid ${borderC}`,
                fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                transition: "all 0.6s ease",
                background: eased > 0.5 ? "rgba(100,140,255,0.03)" : "rgba(139,105,20,0.02)",
              }}>
                <span style={{ color: accent, fontSize: "0.9rem", opacity: 0.7, flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Torah verse */}
        <div style={{
          textAlign: "center", maxWidth: "600px", margin: "0 auto 4vh",
          padding: "0 2rem",
          fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
          fontStyle: "italic", color: textSub, lineHeight: 1.8,
          transition: "color 0.6s ease",
        }}>
          {t < 0.5
            ? "V'asu li mikdash v'shachanti b'tocham — Make me a sanctuary and I will dwell among them."
            : "The tent transforms. Or moves between them."
          }
        </div>

        <div style={{
          textAlign: "center", padding: "0 2rem 5vh",
          fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: textSub, opacity: 0.6, transition: "color 0.6s ease",
        }}>
          kiyyor &nbsp;·&nbsp; threshold &nbsp;·&nbsp; mishkan &nbsp;·&nbsp; gathering
        </div>

      </div>
    </div>
  );
}
