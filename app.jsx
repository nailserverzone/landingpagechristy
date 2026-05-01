/* global React */
const { useState, useEffect, useRef } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "navy",
  "ctaLabel": "Free Coaching Call"
}/*EDITMODE-END*/;

const PALETTES = {
  navy: {
    bg: "#fbf8f1",
    bgAlt: "#f3ecdb",
    deep: "#15143a",
    deepAlt: "#1f1d4f",
    ink: "#15143a",
    inkSoft: "#52514a",
    line: "#e6dcc4",
    accent: "#3a3a8a",
    gold: "#d9a73a",
    yellow: "#f5d04e",
    cream: "#f7eed8",
  },
  warm: {
    bg: "#fbf8f1",
    bgAlt: "#f3ecdb",
    deep: "#1a1838",
    deepAlt: "#2a2858",
    ink: "#171717",
    inkSoft: "#52514a",
    line: "#e6dcc4",
    accent: "#3a3a8a",
    gold: "#b88a32",
    yellow: "#f5d04e",
    cream: "#f7eed8",
  },
};
const useTheme = (p) => PALETTES[p] || PALETTES.navy;

// ---- helpers ----
const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 800ms ${delay}ms cubic-bezier(.2,.7,.2,1), transform 800ms ${delay}ms cubic-bezier(.2,.7,.2,1)`,
    ...style,
  }}>{children}</div>;
};

const Script = ({ children, color, size = 64, style }) => (
  <span style={{
    fontFamily: "'Caveat', 'Patrick Hand', cursive",
    fontSize: size,
    fontWeight: 600,
    color,
    fontStyle: "italic",
    lineHeight: 0.9,
    display: "inline-block",
    ...style,
  }}>{children}</span>
);

const ctaPrimary = (T, light) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
  padding: "18px 32px",
  background: light ? T.yellow : T.accent,
  color: light ? T.deep : "#fff",
  borderRadius: 999,
  fontSize: 15, fontWeight: 700,
  letterSpacing: "0.01em",
  textDecoration: "none",
  border: "none", cursor: "pointer",
  boxShadow: light ? `0 12px 28px -10px rgba(245,208,78,0.55)` : `0 12px 28px -10px ${T.accent}88`,
  transition: "transform 180ms",
});

// ---- NAV ----
const Nav = ({ T, onCta }) => (
  <nav style={{
    position: "sticky", top: 0, zIndex: 50,
    background: T.deep,
    borderBottom: `1px solid rgba(255,255,255,0.08)`,
  }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto",
      padding: "16px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#fff" }}>
        <div style={{
          background: "#fff", padding: 4, borderRadius: 6,
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src="assets/logo.webp" alt="" style={{ width: 32, height: "auto" }} />
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Christy Marvel</div>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: T.cream, opacity: 0.6, marginTop: 2 }}>LIFE COACHING</div>
        </div>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <a href="#about" style={navLink}>About</a>
        <a href="#why" style={navLink}>Why Christy</a>
        <a href="#book" style={navLink}>Book</a>
        <button onClick={onCta} style={{
          padding: "10px 18px",
          background: T.yellow, color: T.deep,
          border: "none", borderRadius: 999,
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>Book Free Call →</button>
      </div>
    </div>
  </nav>
);
const navLink = {
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontSize: 14, fontWeight: 500,
};

// ---- HERO ----
const Hero = ({ T, ctaLabel, onCta }) => (
  <section id="top" style={{
    position: "relative",
    background: T.deep,
    color: "#fff",
    overflow: "hidden",
    paddingTop: 60,
    paddingBottom: 140,
  }}>
    {/* Decorative background type */}
    <div style={{
      position: "absolute", top: 80, right: -40,
      fontSize: 220, fontWeight: 900,
      color: "rgba(255,255,255,0.025)",
      letterSpacing: "-0.05em",
      lineHeight: 0.85,
      pointerEvents: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}>POTENTIAL</div>
    {/* halftone dots */}
    <div style={{
      position: "absolute", bottom: -100, right: -80,
      width: 360, height: 360, borderRadius: "50%",
      background: `radial-gradient(${T.gold}55 1.5px, transparent 2px) 0 0/14px 14px`,
      opacity: 0.5,
      pointerEvents: "none",
    }} />
    {/* yellow blob behind portrait */}
    <div style={{
      position: "absolute",
      top: 80, right: "8%",
      width: 480, height: 540,
      background: T.yellow,
      borderRadius: "48% 52% 60% 40% / 50% 45% 55% 50%",
      opacity: 0.92,
      pointerEvents: "none",
    }} />

    <div style={{
      position: "relative",
      maxWidth: 1280, margin: "0 auto", padding: "0 32px",
      display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
      gap: 40,
      alignItems: "center",
    }}>
      <Reveal>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "8px 16px",
          border: `1px solid rgba(255,255,255,0.18)`,
          borderRadius: 999,
          fontSize: 12, fontWeight: 600,
          letterSpacing: "0.12em",
          color: T.cream,
          marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.yellow }} />
          1 HOUR · COMPLIMENTARY · NO COST
        </div>
        <h1 style={{
          fontSize: "clamp(44px, 6vw, 84px)",
          lineHeight: 1.02,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          margin: 0,
          color: "#fff",
        }}>
          Unlock the full<br/>
          potential in{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "relative", zIndex: 1, color: T.deep, padding: "0 8px" }}>YOU</span>
            <span style={{
              position: "absolute", inset: 0,
              background: T.yellow,
              transform: "skew(-6deg)",
              zIndex: 0,
            }} />
          </span>.
        </h1>
        <div style={{ marginTop: 18 }}>
          <Script color={T.yellow} size={48}>with Christy Marvel</Script>
        </div>
        <p style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.78)",
          maxWidth: 500,
          marginTop: 24,
          marginBottom: 36,
        }}>
          Enjoy a complimentary 1-hour coaching session with Christy Marvel
          and discover your path to fulfillment.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <button onClick={onCta} style={ctaPrimary(T, true)}>
            {ctaLabel} →
          </button>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            <div style={{ fontWeight: 700, color: T.yellow, fontSize: 14 }}>1 Hour. No Cost.</div>
            No obligation, no sales pitch.
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div style={{ position: "relative", height: 580 }}>
          {/* portrait clipped to blob */}
          <img src="assets/christy.webp" alt="Christy Marvel" style={{
            position: "absolute",
            top: 30, right: -40,
            width: "105%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            borderRadius: "48% 52% 60% 40% / 50% 45% 55% 50%",
            zIndex: 2,
          }} />
          {/* floating Ziglar badge */}
          <div style={{
            position: "absolute",
            bottom: 60, left: -10,
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 14,
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)",
            zIndex: 3,
            transform: "rotate(-4deg)",
          }}>
            <img src="assets/ziglar-legacy.webp" alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: 10, color: "#52514a", letterSpacing: "0.12em", fontWeight: 700 }}>CERTIFIED</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.deep }}>Ziglar Master Coach</div>
            </div>
          </div>
          {/* small stats card */}
          <div style={{
            position: "absolute",
            top: 120, right: -30,
            background: T.deep,
            border: `1px solid rgba(255,255,255,0.12)`,
            padding: "16px 18px",
            borderRadius: 14,
            zIndex: 3,
            transform: "rotate(3deg)",
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.yellow, lineHeight: 1 }}>10+</div>
            <div style={{ fontSize: 11, color: T.cream, letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>Years Coaching</div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---- TRUST STRIP ----
const TrustStrip = ({ T }) => (
  <section style={{ background: "#fff", padding: "32px 0", borderBottom: `1px solid ${T.line}` }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto", padding: "0 32px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 24,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Certified by
      </div>
      {[
        "Ziglar See You at the Top",
        "Choose to Win Coach",
        "Master Coach",
        "10+ Years Experience",
        "Self-Made Multi-Millionaire",
      ].map((t) => (
        <div key={t} style={{
          fontSize: 13, fontWeight: 600, color: T.deep,
          opacity: 0.8,
          letterSpacing: "0.02em",
        }}>{t}</div>
      ))}
    </div>
  </section>
);

// ---- ABOUT ----
const About = ({ T, onCta, ctaLabel }) => (
  <section id="about" style={{ padding: "140px 0 120px", background: T.bg, position: "relative", overflow: "hidden" }}>
    {/* big background script */}
    <div style={{
      position: "absolute", top: 40, left: -60,
      fontFamily: "'Caveat', cursive",
      fontSize: 240, color: T.line, opacity: 0.6,
      lineHeight: 0.9, fontWeight: 700,
      pointerEvents: "none", userSelect: "none",
    }}>purpose.</div>

    <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "0.85fr 1.15fr",
        gap: 80, alignItems: "center",
      }}>
        <Reveal>
          <div style={{ position: "relative", height: 460 }}>
            {/* main quote card */}
            <div style={{
              position: "absolute",
              top: 0, left: 0,
              width: "85%",
              background: T.deep,
              color: "#fff",
              padding: 36,
              borderRadius: 18,
              boxShadow: "0 30px 60px -20px rgba(21,20,58,0.5)",
              zIndex: 2,
            }}>
              <div style={{ fontSize: 60, color: T.yellow, lineHeight: 0.6, fontFamily: "'Caveat', cursive" }}>"</div>
              <div style={{
                fontSize: 22, fontWeight: 600, lineHeight: 1.35,
                marginTop: 8,
              }}>
                We can't control what happens to us — but we can determine{" "}
                <span style={{ color: T.yellow, fontStyle: "italic" }}>where we end up.</span>
              </div>
              <div style={{
                marginTop: 20,
                fontFamily: "'Caveat', cursive", fontSize: 28,
                color: T.yellow,
              }}>— Christy</div>
            </div>
            {/* lived experience chip */}
            <div style={{
              position: "absolute",
              bottom: 60, right: 20,
              background: "#fff",
              padding: "20px 24px",
              borderRadius: 16,
              border: `1.5px solid ${T.line}`,
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
              transform: "rotate(4deg)",
              zIndex: 3,
              maxWidth: 240,
            }}>
              <div style={{ fontSize: 11, color: T.accent, letterSpacing: "0.14em", fontWeight: 700, textTransform: "uppercase" }}>Lived Experience</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.deep, marginTop: 6, lineHeight: 1.3 }}>
                Trauma survivor.<br/>Global traveler.<br/>Self-made.
              </div>
            </div>
            {/* stat circle */}
            <div style={{
              position: "absolute",
              top: 20, right: -10,
              width: 130, height: 130,
              background: T.yellow,
              borderRadius: "50%",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center",
              transform: "rotate(-6deg)",
              boxShadow: "0 12px 30px -8px rgba(245,208,78,0.6)",
              zIndex: 4,
              padding: 12,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.deep, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.2 }}>Business owner<br/>since</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: T.deep, lineHeight: 1, marginTop: 6 }}>2000</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: T.accent,
            letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: 16,
          }}>Embrace a purposeful life</div>
          <h2 style={{
            fontSize: "clamp(36px, 4.5vw, 56px)",
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: 0,
            color: T.deep,
          }}>
            Ten years guiding people<br/>
            to the <Script color={T.gold} size={64} style={{ verticalAlign: "-2px", marginRight: 12, marginLeft: 4 }}>life</Script>they meant<br/>to live.
          </h2>
          <div style={{
            fontSize: 17, lineHeight: 1.7,
            color: T.inkSoft,
            marginTop: 28, marginBottom: 36,
            maxWidth: 540,
          }}>
            <p style={{ margin: 0 }}>
              Christy is an expert in leadership and personal development with
              over 10 years of experience. A certified Ziglar Coach and
              self-made multi-millionaire, she brings knowledge from a diverse
              background in architecture, business management, and real-world
              success.
            </p>
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              As a trauma survivor and global traveler, her coaching emphasizes
              resilience and personal empowerment. Start your transformation
              with a complimentary 1-hour call.
            </p>
          </div>
          <button onClick={onCta} style={ctaPrimary(T)}>{ctaLabel} →</button>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---- WHY CHRISTY ----
const WhyChristy = ({ T }) => {
  const items = [
    ["01", "Extensive Professional Background", "Christy holds multiple degrees in architecture, landscape architecture, and business management. She has worked in various fields, including engineering, site planning, and construction management."],
    ["02", "Extensive Professional Background", "With over 10 years of experience, Christy specializes in leadership, team building, time management, goal setting, and motivation, making her well-equipped to guide clients in their personal and professional growth."],
    ["03", "Certified Ziglar Coach", "Christy is a Ziglar See You at the Top Coach, Ziglar Choose to Win Coach, and Ziglar Master Coach, providing her with a robust framework to help clients unlock their full potential."],
    ["04", "Real-World Success", "As a self-made multi-millionaire and small business owner since 2000, Christy has a proven track record of growing successful companies and achieving financial independence."],
    ["05", "Unique Life Experiences", "Christy has lived in over half the states in the USA and abroad in Germany. She is a world traveler and mission worker in Spanish-speaking countries, bringing a global perspective to her coaching."],
    ["06", "Diverse Interests and Skills", "Benefit from insights drawn from Ziglar Coaching's diverse career to navigate the complexities of your own path."],
    ["07", "Resilience and Empowerment", "As a severe trauma survivor, Christy embodies resilience and empowerment. Her coaching philosophy emphasizes that while we can't control what happens to us, we can determine where we end up in life, helping clients overcome their challenges and achieve lasting happiness."],
  ];
  return (
    <section id="why" style={{ padding: "140px 0", background: T.deep, color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* big bg type */}
      <div style={{
        position: "absolute", top: 80, right: -60,
        fontFamily: "'Caveat', cursive",
        fontSize: 260, color: "rgba(255,255,255,0.04)",
        lineHeight: 0.9, fontWeight: 700,
        pointerEvents: "none", userSelect: "none",
      }}>why?</div>

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div style={{
            fontSize: 12, fontWeight: 700, color: T.yellow,
            letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: 16,
          }}>Why Choose Christy Marvel</div>
          <h2 style={{
            fontSize: "clamp(36px, 4.5vw, 56px)",
            lineHeight: 1.05, fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: 0, color: "#fff", maxWidth: 720,
          }}>
            Seven reasons <Script color={T.yellow} size={68} style={{ verticalAlign: "-4px" }}>real people</Script> choose Christy.
          </h2>
        </Reveal>

        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {items.map(([n, t, d], i) => {
            const isYellow = i === 2 || i === 6;
            return (
              <Reveal key={n} delay={i * 50}>
                <div style={{
                  background: isYellow ? T.yellow : "rgba(255,255,255,0.04)",
                  border: isYellow ? "none" : "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 18,
                  padding: 28,
                  height: "100%",
                  color: isYellow ? T.deep : "#fff",
                  position: "relative",
                  ...(i === 6 ? { gridColumn: "span 2" } : {}),
                }}>
                  <div style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: 56,
                    color: isYellow ? T.deep : T.yellow,
                    opacity: isYellow ? 0.4 : 0.8,
                    lineHeight: 0.8,
                    fontWeight: 700,
                  }}>{n}</div>
                  <div style={{
                    fontSize: 18, fontWeight: 700,
                    marginTop: 16, marginBottom: 10,
                    letterSpacing: "-0.005em",
                    color: isYellow ? T.deep : "#fff",
                  }}>{t}</div>
                  <p style={{
                    fontSize: 14, lineHeight: 1.6,
                    color: isYellow ? "rgba(21,20,58,0.78)" : "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}>{d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---- BRIDGE CTA ----
const Bridge = ({ T, onCta, ctaLabel }) => (
  <section style={{ padding: "100px 0", background: T.bg, position: "relative", overflow: "hidden" }}>
    <div style={{
      maxWidth: 1100, margin: "0 auto", padding: "0 32px",
      display: "grid", gridTemplateColumns: "1.2fr 0.8fr",
      gap: 60, alignItems: "center",
    }}>
      <Reveal>
        <div style={{
          fontSize: 12, fontWeight: 700, color: T.accent,
          letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: 14,
        }}>Begin your path to purposeful success</div>
        <h2 style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          lineHeight: 1.05, fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: 0, color: T.deep,
        }}>
          Ready to take the first step toward a more <Script color={T.gold} size={56} style={{ verticalAlign: "-4px" }}>fulfilling</Script> life?
        </h2>
        <p style={{
          fontSize: 17, lineHeight: 1.65,
          color: T.inkSoft, marginTop: 24, marginBottom: 0, maxWidth: 560,
        }}>
          Whether you're aiming to overcome challenges, achieve professional
          growth, or leave a lasting legacy — Christy's expertise will help you
          unlock your full potential.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <button onClick={onCta} style={{ ...ctaPrimary(T), fontSize: 16, padding: "20px 36px" }}>
            {ctaLabel} →
          </button>
          <div style={{ fontSize: 13, color: T.inkSoft, marginLeft: 4 }}>
            ✓ 1 Hour &nbsp; ✓ No Cost &nbsp; ✓ No Pitch
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---- BOOK ----
const Book = ({ T }) => (
  <section id="book" style={{
    padding: "140px 0",
    background: `linear-gradient(135deg, ${T.deep} 0%, ${T.deepAlt} 100%)`,
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  }}>
    {/* halftone bg */}
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(rgba(245,208,78,0.06) 1px, transparent 1.5px) 0 0/24px 24px`,
      pointerEvents: "none",
    }} />
    {/* Big "READ" type behind */}
    <div style={{
      position: "absolute",
      top: 60, left: -20,
      fontSize: 280,
      fontWeight: 900,
      color: "rgba(255,255,255,0.03)",
      letterSpacing: "-0.05em",
      lineHeight: 0.85,
      pointerEvents: "none", userSelect: "none",
    }}>READ.</div>

    <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "0.9fr 1.1fr",
        gap: 80, alignItems: "center",
      }}>
        {/* Book image */}
        <Reveal>
          <div style={{ position: "relative", padding: "40px 0" }}>
            {/* yellow accent square behind book */}
            <div style={{
              position: "absolute",
              top: 60, left: 40,
              width: "85%", aspectRatio: "2/3",
              background: T.yellow,
              borderRadius: 8,
              transform: "rotate(-4deg)",
              boxShadow: "0 30px 60px -20px rgba(245,208,78,0.4)",
            }} />
            <img src="assets/book.webp" alt="Be Your Own Superhero" style={{
              position: "relative",
              width: "85%",
              height: "auto",
              borderRadius: 6,
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
              transform: "rotate(2deg)",
              display: "block",
              margin: "0 auto",
            }} />
            {/* "just dropped" sticker */}
            <div style={{
              position: "absolute",
              top: 0, right: "8%",
              width: 90, height: 90,
              background: "#e74c3c",
              color: "#fff",
              borderRadius: "50%",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              transform: "rotate(14deg)",
              boxShadow: "0 12px 30px -8px rgba(231,76,60,0.6)",
              zIndex: 2,
            }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 32, fontWeight: 700, lineHeight: 0.8 }}>just</div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.12em", marginTop: 2 }}>DROPPED</div>
            </div>
            {/* foreword tag */}
            <div style={{
              position: "absolute",
              bottom: 30, left: 0,
              background: "#fff",
              color: T.deep,
              padding: "10px 16px",
              borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 14px 30px -10px rgba(0,0,0,0.3)",
              transform: "rotate(-3deg)",
              zIndex: 2,
            }}>
              <div style={{ fontSize: 9, color: T.inkSoft, letterSpacing: "0.16em", fontWeight: 700 }}>FOREWORD BY</div>
              <div>Tom Ziglar</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: T.yellow,
            letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: 14,
          }}>Grab my new book</div>
          <h2 style={{
            fontSize: "clamp(40px, 5vw, 68px)",
            lineHeight: 0.98, fontWeight: 900,
            letterSpacing: "-0.03em",
            margin: 0, color: "#fff",
          }}>
            BE <span style={{
              position: "relative", display: "inline-block",
              padding: "0 4px",
            }}>
              <span style={{ position: "relative", zIndex: 1, color: T.deep }}>YOU</span>
              <span style={{
                position: "absolute", inset: 0,
                background: T.yellow,
                transform: "skew(-6deg)",
                zIndex: 0,
              }} />
            </span>R OWN<br/>
            SUPERHERO.
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7,
            color: "rgba(255,255,255,0.78)",
            marginTop: 28, marginBottom: 32,
            maxWidth: 540,
          }}>
            A guide to healing, identity, and transformation. Christy shares
            her journey from a childhood marked by trauma and hardship to a
            life of strength, purpose, and faith. Through raw storytelling and
            practical tools rooted in neuroplasticity and spiritual truth — a
            roadmap for reclaiming your power.
          </p>
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 26, color: T.yellow,
            marginBottom: 24,
            fontStyle: "italic",
          }}>
            "The hero you've been waiting for has been inside you all along."
          </div>
          <a href="https://www.amazon.com/dp/1967451249" target="_blank" rel="noopener" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 28px",
            background: T.yellow, color: T.deep,
            borderRadius: 999,
            fontSize: 15, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 12px 28px -10px rgba(245,208,78,0.55)",
          }}>Grab My Book on Amazon →</a>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---- SONG — "Little Me" video ----
const Song = ({ T }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <section style={{ padding: "120px 0", background: T.bg, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 60, right: -40,
        fontSize: 200, fontWeight: 900,
        color: T.line, opacity: 0.6,
        letterSpacing: "-0.05em",
        lineHeight: 0.85,
        pointerEvents: "none", userSelect: "none",
        whiteSpace: "nowrap",
      }}>♪ LISTEN</div>

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: T.accent,
              letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: 14,
            }}>Just Dropped</div>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.05, fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 auto", color: T.deep,
              maxWidth: 760,
            }}>
              <Script color={T.gold} size={64}>"Little Me"</Script>
              {" — "}the new release everyone's talking about.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div style={{
            position: "relative",
            aspectRatio: "16/9",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
            border: `1px solid ${T.line}`,
            background: "#000",
          }}>
            {playing ? (
              <iframe
                src="https://www.youtube.com/embed/YI0Qm6Fv59s?autoplay=1"
                title="Little Me — Christy Marvel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  border: "none", padding: 0, cursor: "pointer",
                  backgroundImage: `url("https://img.youtube.com/vi/YI0Qm6Fv59s/maxresdefault.jpg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-label="Play 'Little Me' video"
              >
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
                }} />
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 96, height: 96,
                  borderRadius: "50%",
                  background: T.yellow,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}>
                  <div style={{
                    width: 0, height: 0,
                    borderTop: "18px solid transparent",
                    borderBottom: "18px solid transparent",
                    borderLeft: `26px solid ${T.deep}`,
                    marginLeft: 6,
                  }} />
                </div>
                <div style={{
                  position: "absolute", bottom: 28, left: 32,
                  color: "#fff", textAlign: "left",
                  textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.16em", color: T.yellow, fontWeight: 700 }}>BE ONE OF THE FIRST TO HEAR IT</div>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>Watch the full video now</div>
                </div>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---- FINAL CTA / FORM ----
const FinalCTA = ({ T, ctaLabel }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", email: "", phone: "" });
  const upd = (k) => (e) => setData({ ...data, [k]: e.target.value });
  return (
    <section id="book-form" style={{
      padding: "140px 0",
      background: T.deep,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Big bg type */}
      <div style={{
        position: "absolute", top: 60, left: -40,
        fontSize: 240, fontWeight: 900,
        color: "rgba(255,255,255,0.03)",
        letterSpacing: "-0.05em",
        lineHeight: 0.85,
        pointerEvents: "none", userSelect: "none",
        whiteSpace: "nowrap",
      }}>RESERVE.</div>
      {/* yellow blob */}
      <div style={{
        position: "absolute", bottom: -120, right: -120,
        width: 380, height: 380, borderRadius: "50%",
        background: T.yellow, opacity: 0.12,
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        maxWidth: 1100, margin: "0 auto", padding: "0 32px",
        display: "grid", gridTemplateColumns: "1.05fr 0.95fr",
        gap: 60, alignItems: "center",
      }}>
        <Reveal>
          <div style={{
            fontSize: 12, fontWeight: 700, color: T.yellow,
            letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: 16,
          }}>Reserve Your Free Session Now</div>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.0, fontWeight: 900,
            letterSpacing: "-0.025em",
            margin: 0, color: "#fff",
          }}>
            One hour.<br/>
            No cost.<br/>
            <Script color={T.yellow} size={88}>your move.</Script>
          </h2>
          <p style={{
            fontSize: 17, lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            marginTop: 28, maxWidth: 480,
          }}>
            Reserve your complimentary 1-hour coaching call. Take the first
            step toward a more meaningful and fulfilling life.
          </p>
          <div style={{
            marginTop: 28,
            display: "flex", flexDirection: "column", gap: 10,
            fontSize: 14, color: T.cream,
          }}>
            {["1 full hour, completely free", "1-on-1 with Christy, Ziglar Master Coach", "Zero obligation — yours regardless"].map(t => (
              <div key={t} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: T.yellow, color: T.deep,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{
            background: "#fff",
            color: T.deep,
            borderRadius: 24,
            padding: 40,
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -16, right: 32,
              background: T.yellow, color: T.deep,
              padding: "6px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>1 HR · NO COST</div>

            {step < 3 ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.deep, marginBottom: 6, letterSpacing: "-0.01em" }}>
                  Reserve your free session
                </div>
                <div style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
                  Less than 60 seconds.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field T={T} label="Full Name *" value={data.name} onChange={upd("name")} />
                  <Field T={T} label="Email *" type="email" value={data.email} onChange={upd("email")} />
                  <Field T={T} label="Phone" type="tel" value={data.phone} onChange={upd("phone")} optional />
                  <button
                    onClick={() => setStep(3)}
                    style={{ ...ctaPrimary(T), width: "100%", marginTop: 8 }}
                  >{ctaLabel} →</button>
                  <div style={{ fontSize: 12, color: T.inkSoft, textAlign: "center", marginTop: 4 }}>
                    No spam. We respect your inbox.
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: T.accent, color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 700,
                  marginBottom: 16,
                }}>✓</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.deep }}>You're in.</div>
                <div style={{ fontSize: 15, color: T.inkSoft, marginTop: 10 }}>
                  Check your inbox for a link to pick a time.
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Field = ({ T, label, optional, ...rest }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span style={{
      fontSize: 11, color: T.inkSoft, fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      {label}{optional && <span style={{ opacity: 0.6 }}> (optional)</span>}
    </span>
    <input
      {...rest}
      style={{
        background: T.bg,
        border: `1.5px solid ${T.line}`,
        padding: "14px 16px",
        borderRadius: 10,
        fontSize: 15,
        color: T.ink,
        outline: "none",
        fontFamily: "inherit",
      }}
      onFocus={(e) => { e.target.style.borderColor = T.accent; }}
      onBlur={(e) => { e.target.style.borderColor = T.line; }}
    />
  </label>
);

// ---- FOOTER ----
const Footer = ({ T }) => (
  <footer style={{
    background: T.bg,
    padding: "40px 32px 28px",
    borderTop: `1px solid ${T.line}`,
  }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="assets/logo.webp" alt="" style={{ width: 36, height: "auto" }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.deep }}>Christy Marvel</div>
          <div style={{ fontSize: 10, color: T.inkSoft, letterSpacing: "0.15em", fontWeight: 600 }}>LIFE COACHING</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, fontSize: 13, color: T.inkSoft }}>
        <a href="https://christy.ziglarcoach.com/terms-conditions-1884" style={{ color: T.inkSoft, textDecoration: "none" }}>Terms &amp; Conditions</a>
        <a href="https://christy.ziglarcoach.com/privacy-policy-4224" style={{ color: T.inkSoft, textDecoration: "none" }}>Privacy Policy</a>
      </div>
      <div style={{ fontSize: 12, color: T.inkSoft }}>
        ©2026 Christy Marvel
      </div>
    </div>
  </footer>
);

// ---- APP ----
const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const T = useTheme(tweaks.palette);
  const scrollToForm = () => {
    document.getElementById("book-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div style={{ background: T.bg, color: T.ink, minHeight: "100vh" }}>
      <Nav T={T} onCta={scrollToForm} />
      <Hero T={T} ctaLabel={tweaks.ctaLabel} onCta={scrollToForm} />
      <TrustStrip T={T} />
      <About T={T} onCta={scrollToForm} ctaLabel={tweaks.ctaLabel} />
      <WhyChristy T={T} />
      <Bridge T={T} onCta={scrollToForm} ctaLabel={tweaks.ctaLabel} />
      <Book T={T} />
      <Song T={T} />
      <FinalCTA T={T} ctaLabel={tweaks.ctaLabel} />
      <Footer T={T} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Visual">
          <TweakRadio
            label="Palette"
            value={tweaks.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "navy", label: "Navy + Yellow" },
              { value: "warm", label: "Warm + Gold" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Copy">
          <TweakText
            label="CTA button text"
            value={tweaks.ctaLabel}
            onChange={(v) => setTweak("ctaLabel", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
