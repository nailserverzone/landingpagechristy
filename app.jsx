/* global React */
const { useState, useEffect, useRef } = React;

// ── Palette ──────────────────────────────────────────────────────────────────
const T = {
  navy:   "#15294b",
  navyD:  "#0e1c33",
  navyL:  "#1e3560",
  gold:   "#c9a84c",
  goldL:  "#e8d08a",
  goldBg: "#fdf6e3",
  white:  "#ffffff",
  cream:  "#faf8f3",
  ink:    "#1a1a2e",
  soft:   "#5a6070",
  line:   "#e4ddd0",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 700ms ${delay}ms ease, transform 700ms ${delay}ms ease`,
      ...style,
    }}>{children}</div>
  );
};

const Script = ({ children, size = 52 }) => (
  <span style={{ fontFamily: "'Caveat', cursive", fontSize: size, fontWeight: 600, color: T.gold, fontStyle: "italic", lineHeight: 1 }}>
    {children}
  </span>
);

const PhBadge = () => (
  <span style={{
    display: "inline-block", background: T.gold, color: "#fff",
    fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
    padding: "2px 8px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle",
  }}>PLACEHOLDER</span>
);

const PhBox = ({ children, style }) => (
  <div style={{
    background: "repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(201,168,76,0.06) 6px,rgba(201,168,76,0.06) 12px)",
    border: `2px dashed ${T.goldL}`,
    borderRadius: 12, padding: 20,
    color: T.soft, fontStyle: "italic", fontSize: 14,
    ...style,
  }}>{children}</div>
);

const Btn = ({ children, onClick, outline, style }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "16px 32px",
    background: outline ? "transparent" : T.gold,
    color: outline ? T.gold : T.navy,
    border: `2px solid ${T.gold}`,
    borderRadius: 999,
    fontSize: 15, fontWeight: 700,
    letterSpacing: "0.01em",
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 180ms, opacity 180ms",
    ...style,
  }}>{children}</button>
);

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// ── NAV ───────────────────────────────────────────────────────────────────────
const Nav = () => (
  <nav style={{
    position: "sticky", top: 0, zIndex: 100,
    background: T.navyD,
    borderBottom: `1px solid rgba(255,255,255,0.07)`,
  }}>
    <div style={{
      maxWidth: 1200, margin: "0 auto", padding: "14px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 6, padding: 3, display: "flex" }}>
          <img src="assets/logo.webp" alt="" style={{ width: 30, height: "auto" }} />
        </div>
        <div style={{ color: "#fff", lineHeight: 1.2 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Christy Marvel</div>
          <div style={{ fontSize: 10, letterSpacing: "0.16em", color: T.goldL, opacity: 0.8 }}>BE YOUR OWN SUPERHERO™</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {[["The Experience","experience"],["Schedule","schedule"],["Accommodations","rooms"],["Meet Christy","christy"],["FAQ","faq"]].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500,
          }}>{label}</button>
        ))}
        <Btn onClick={() => scrollTo("register")} style={{ padding: "9px 20px", fontSize: 13 }}>Reserve Your Place →</Btn>
      </div>
    </div>
  </nav>
);

// ── HERO ──────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section id="top" style={{
    position: "relative",
    background: T.navyD,
    color: "#fff",
    padding: "100px 32px 120px",
    overflow: "hidden",
    textAlign: "center",
  }}>
    {/* gradient orbs */}
    <div style={{ position: "absolute", top: -100, left: "20%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(${T.navyL}, transparent 70%)`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -80, right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(rgba(201,168,76,0.12), transparent 70%)`, pointerEvents: "none" }} />

    {/* Lake photo placeholder */}
    <Reveal>
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto 52px", borderRadius: 20, overflow: "hidden" }}>
        <PhBox style={{
          height: 380, borderRadius: 20, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          background: "rgba(255,255,255,0.04)",
          border: `2px dashed rgba(201,168,76,0.4)`,
          color: "rgba(255,255,255,0.5)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌅</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>[Lake Hamilton hero photo]</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Sunrise / lakefront / boardwalk — replace with professional photography</div>
        </PhBox>
        {/* date badge */}
        <div style={{
          position: "absolute", top: 20, right: 20,
          background: T.gold, color: T.navy,
          padding: "8px 18px", borderRadius: 999,
          fontSize: 12, fontWeight: 800, letterSpacing: "0.1em",
        }}>SEPT 18–20, 2026</div>
      </div>
    </Reveal>

    <Reveal delay={100}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.goldL, textTransform: "uppercase", marginBottom: 20 }}>
        Be Your Own Superhero™ Retreat &nbsp;·&nbsp; Lake Hamilton, Hot Springs, Arkansas
      </div>
      <h1 style={{
        fontSize: "clamp(40px, 6vw, 80px)",
        fontWeight: 900, lineHeight: 1.0,
        letterSpacing: "-0.03em", margin: "0 auto", maxWidth: 800,
      }}>
        Heal.{" "}<span style={{ color: T.gold }}>Recharge.</span>{" "}Rediscover the Strength Within You.
      </h1>
      <p style={{
        fontSize: 19, lineHeight: 1.65, color: "rgba(255,255,255,0.78)",
        maxWidth: 620, margin: "28px auto 0",
      }}>
        An intimate lakefront weekend for women who are ready to step out of survival mode, reconnect with themselves, and intentionally design what comes next.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
        <Btn onClick={() => scrollTo("register")}>Reserve Your Place →</Btn>
        <Btn outline onClick={() => scrollTo("experience")}>Learn More</Btn>
      </div>
      <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
        Limited to 10 women &nbsp;·&nbsp; September 18–20, 2026 &nbsp;·&nbsp; Hot Springs, Arkansas
      </div>
    </Reveal>
  </section>
);

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
const Experience = () => (
  <section id="experience" style={{ padding: "120px 32px", background: T.cream }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>The Experience</div>
          <h2 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: 0 }}>
            A weekend designed entirely{" "}<Script size={56}>for you.</Script>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: T.soft, maxWidth: 660, margin: "24px auto 0" }}>
            This is not a conference. It's an intimate, transformational weekend focused on healing, personal growth, rest, reflection, and authentic connection — in a small group of no more than 10 women.
          </p>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {[
          ["🌿", "Intimate Group", "Limited to 10 women for deep individual attention and genuine connection."],
          ["🏡", "Lakefront Setting", "Two beautiful neighboring lake homes on Lake Hamilton in Hot Springs, Arkansas."],
          ["💛", "Rest & Reflection", "Space to pause, breathe, and reconnect with who you are beneath the overwhelm."],
          ["🗺️", "Practical Growth", "Leave with a real 90-day action plan — not just inspiration, but a clear next step."],
        ].map(([icon, title, desc]) => (
          <Reveal key={title} delay={80}>
            <div style={{
              background: T.white, borderRadius: 16, padding: 28,
              border: `1px solid ${T.line}`,
              boxShadow: "0 4px 20px -8px rgba(21,41,75,0.1)",
              height: "100%",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: T.soft, margin: 0 }}>{desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Who it's for */}
      <Reveal delay={80}>
        <div style={{
          marginTop: 72, display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 60, alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>Who This Is For</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: "0 0 24px" }}>
              This is for the woman who…
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Has spent years taking care of everyone else",
                "Feels tired, overwhelmed, or stuck in survival mode",
                "Is moving through a transition or considering a new direction",
                "Wants to reconnect with the person she was before life became so demanding",
                "Is ready to examine fears, beliefs, and boundaries",
                "Wants a practical plan for her next chapter",
                "Values genuine connection with a small group of women",
                "Needs permission to rest, reflect, and begin again",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: T.gold, color: T.navy,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, marginTop: 1,
                  }}>✓</span>
                  <span style={{ fontSize: 15, color: T.ink, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{
              background: T.navy, color: "#fff",
              borderRadius: 20, padding: 40,
              boxShadow: "0 30px 60px -20px rgba(21,41,75,0.4)",
            }}>
              <div style={{ fontSize: 48, color: T.gold, fontFamily: "'Caveat', cursive", lineHeight: 0.8, marginBottom: 20 }}>"</div>
              <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                The retreat is not about pretending to be invincible. It is about learning to stop abandoning yourself while waiting for someone else to rescue you.
              </p>
              <div style={{ marginTop: 24, fontFamily: "'Caveat', cursive", fontSize: 26, color: T.gold }}>— Christy Marvel</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
const Schedule = () => {
  const days = [
    {
      day: "Friday", theme: "Seen, Safe & Connected",
      icon: "🌙",
      items: ["Arrival & check-in", "Welcome gifts & room settling", "Welcome dinner", "Introductions & connection", "Opening teaching", "Creating an emotionally safe environment", "Begin identifying what you want to release or change", "Evening lakefront gathering or bonfire"],
    },
    {
      day: "Saturday", theme: "Healing Little Me & Reclaiming Your Power",
      icon: "☀️",
      items: ["Breakfast", "Little Me & inner-child work", "Understanding survival mode", "Fear and the beliefs we carry", "Boundaries & self-trust", "Resilience & personal responsibility", "Leadership & intentional life design", "Lunch", "Personal reflection & free time", "Lake activities & relaxation", "Afternoon or evening teaching/workshop", "Dinner", "Bonfire, meaningful conversation, or quiet reflection"],
    },
    {
      day: "Sunday", theme: "Designing What Comes Next",
      icon: "🌅",
      items: ["Breakfast", "Closing teaching & reflection", "Identifying your next chapter", "Creating your practical 90-day action plan", "Sunday massage experience", "Optional lake or boat experience (weather permitting)", "Closing celebration — leave with your cape on", "Departure"],
    },
  ];
  return (
    <section id="schedule" style={{ padding: "120px 32px", background: T.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>Weekend Flow</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: 0 }}>
              Three days of transformation
            </h2>
            <p style={{ fontSize: 14, color: T.soft, marginTop: 12, fontStyle: "italic" }}>
              Times shown on this schedule are intentionally general — the final agenda will be shared with registered guests.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {days.map(({ day, theme, icon, items }, i) => (
            <Reveal key={day} delay={i * 80}>
              <div style={{
                background: i === 1 ? T.navy : T.cream,
                color: i === 1 ? "#fff" : T.ink,
                borderRadius: 20, padding: 32, height: "100%",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{
                  display: "inline-block",
                  background: i === 1 ? T.gold : T.navy,
                  color: i === 1 ? T.navy : "#fff",
                  fontSize: 11, fontWeight: 800, letterSpacing: "0.14em",
                  padding: "4px 12px", borderRadius: 999, marginBottom: 10,
                  textTransform: "uppercase",
                }}>{day}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.3, color: i === 1 ? T.gold : T.navy }}>
                  {theme}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: T.gold, fontSize: 14, marginTop: 1, flexShrink: 0 }}>◆</span>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: i === 1 ? "rgba(255,255,255,0.85)" : T.soft }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── INCLUDED ──────────────────────────────────────────────────────────────────
const Included = () => (
  <section style={{ padding: "100px 32px", background: T.navy, color: "#fff" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>Everything You Need</div>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            What's included in your retreat
          </h2>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        {[
          ["🏠", "Two nights of lakefront accommodations"],
          ["🎓", "All retreat teaching & coaching sessions"],
          ["📔", "Retreat workbook"],
          ["📖", "Signed copy of Christy Marvel's book"],
          ["🎁", "A thoughtfully curated Be Your Own Superhero™ welcome package"],
          ["🍽️", "Meals & refreshments during the retreat"],
          ["🚤", "Lake access & planned lake activities"],
          ["🔥", "Bonfire gatherings (weather permitting)"],
          ["💆", "Sunday massage experience"],
          ["⛵", "Optional boat experience (weather permitting)"],
          ["📋", "Your personal 90-day action plan"],
          ["👑", "An intimate experience limited to a small group of women"],
        ].map(([icon, text]) => (
          <Reveal key={text} delay={40}>
            <div style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: 16,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{text}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── MEET CHRISTY ──────────────────────────────────────────────────────────────
const MeetChristy = () => (
  <section id="christy" style={{ padding: "120px 32px", background: T.cream }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 80, alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -16, left: -16, width: "85%", aspectRatio: "3/4", background: T.gold, borderRadius: 20, opacity: 0.25 }} />
            <img src="assets/christy.webp" alt="Christy Marvel" style={{
              position: "relative", width: "85%", borderRadius: 20,
              boxShadow: "0 30px 60px -20px rgba(21,41,75,0.35)",
              display: "block",
            }} />
            <div style={{
              position: "absolute", bottom: 20, right: 0,
              background: "#fff", padding: "14px 18px", borderRadius: 14,
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.2)",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <img src="assets/ziglar-legacy.webp" alt="" style={{ width: 40, objectFit: "contain" }} />
              <div>
                <div style={{ fontSize: 9, color: T.soft, fontWeight: 700, letterSpacing: "0.12em" }}>CERTIFIED</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>Ziglar Master Coach</div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>Meet Christy</div>
          <h2 style={{ fontSize: "clamp(30px, 3.8vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: "0 0 24px" }}>
            She's been where you are — and found her way through.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: T.soft, margin: "0 0 16px" }}>
            Christy Marvel is the author of <em>Be Your Own Superhero</em>, a Ziglar Master Coach and Trainer, keynote speaker, entrepreneur, and former architect. She is a self-made multi-millionaire and small-business owner since 2000.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: T.soft, margin: "0 0 28px" }}>
            As a severe childhood trauma survivor, Christy knows what it means to live in survival mode — and what it takes to step out of it. Her mission is to help women heal their "Little Me," set healthy boundaries, and unlock the power that has been within them all along.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Author · Be Your Own Superhero", "Ziglar Master Coach", "Keynote Speaker", "Entrepreneur & Former Architect"].map(tag => (
              <span key={tag} style={{
                background: T.goldBg, color: T.navy, border: `1px solid ${T.goldL}`,
                fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 999,
              }}>{tag}</span>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <a href="https://www.amazon.com/dp/1967451249" target="_blank" rel="noopener" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 22px", background: T.navy, color: "#fff",
              borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              <img src="assets/book.webp" alt="" style={{ width: 28, borderRadius: 3 }} />
              Grab the Book on Amazon →
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ── ACCOMMODATIONS ────────────────────────────────────────────────────────────
const rooms = [
  { house: "Newer Lake House", name: "Master Suite", bed: "King", bath: "Private", cap: 1, price: "$995", type: "private", note: "Downstairs master suite with private bathroom and walk-in closet." },
  { house: "Newer Lake House", name: "King Room", bed: "King", bath: "Shared", cap: 1, price: "$795", type: "shared", note: "King room with walk-in closet and shared bathroom." },
  { house: "Newer Lake House", name: "Bunk Room", bed: "4 Bunk Beds", bath: "Shared", cap: 4, price: "$795 / bed", type: "shared", note: "Four bunk beds with shared bathroom." },
  { house: "Older Lake House", name: "Master Suite", bed: "King", bath: "Private", cap: 1, price: "$995", type: "private", note: "Master suite with private bathroom." },
  { house: "Older Lake House", name: "Loft King", bed: "King", bath: "Shared", cap: 1, price: "$795", type: "shared", note: "Loft king accommodation with shared downstairs bathroom." },
  { house: "Older Lake House", name: "Garden Room", bed: "Full + Twin", bath: "Shared", cap: 2, price: "$795 / bed", type: "shared", note: "One full bed and one twin bed." },
];

const Accommodations = () => (
  <section id="rooms" style={{ padding: "120px 32px", background: T.white }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>Accommodations</div>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: 0 }}>
            Two beautiful lake homes, side by side
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: T.soft, maxWidth: 640, margin: "16px auto 0" }}>
            The retreat takes place at two neighboring lake homes on Lake Hamilton — approximately ten feet apart, connected by a gate, with shared access to the lake and boardwalk.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <PhBox style={{ textAlign: "center", marginBottom: 48, marginTop: 32 }}>
          📸 [Professional photos of the lake houses, bedrooms, gathering spaces, lake & boardwalk — replace with Christy's property photography]
        </PhBox>
      </Reveal>

      <Reveal delay={80}>
        <div style={{
          background: T.goldBg, border: `1.5px solid ${T.goldL}`, borderRadius: 12,
          padding: "12px 20px", marginBottom: 36,
          fontSize: 13, color: T.navy, fontWeight: 600, textAlign: "center",
        }}>
          ⚠️ Prices below are working figures. Do not share publicly until Christy confirms. &nbsp;<PhBadge />
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {rooms.map((r, i) => (
          <Reveal key={r.name + i} delay={i * 60}>
            <div style={{
              border: `1.5px solid ${r.type === "private" ? T.gold : T.line}`,
              borderRadius: 18, overflow: "hidden",
              boxShadow: r.type === "private" ? `0 8px 32px -12px rgba(201,168,76,0.3)` : "0 4px 16px -8px rgba(0,0,0,0.08)",
              height: "100%", display: "flex", flexDirection: "column",
            }}>
              <PhBox style={{
                height: 160, borderRadius: 0, border: "none",
                borderBottom: `1.5px dashed ${T.goldL}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "rgba(201,168,76,0.04)",
              }}>
                <div style={{ fontSize: 28 }}>🛏️</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>[Room photo — {r.name}]</div>
              </PhBox>
              <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, color: T.gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>{r.house}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 13, color: T.soft, marginBottom: 14 }}>{r.note}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "auto" }}>
                  {[`🛏 ${r.bed}`, `🚿 ${r.bath} bath`, `👤 Max ${r.cap}`].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600,
                      background: T.cream, color: T.navy,
                      padding: "3px 10px", borderRadius: 999,
                      border: `1px solid ${T.line}`,
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.soft }}>per person</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: r.type === "private" ? T.gold : T.navy }}>{r.price}<PhBadge /></div>
                  </div>
                  <Btn onClick={() => scrollTo("register")} style={{ padding: "9px 18px", fontSize: 12 }}>Select Room</Btn>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={80}>
        <div style={{
          marginTop: 48, background: T.cream, borderRadius: 16, padding: 28,
          border: `1px solid ${T.line}`, textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, color: T.navy, marginBottom: 6 }}>💳 Reserve with a $300 deposit<PhBadge /></div>
          <div style={{ fontSize: 13, color: T.soft }}>Remaining balance due date to be confirmed. [Connect payment to Stripe / Square / other processor]</div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
const Testimonials = () => (
  <section style={{ padding: "100px 32px", background: T.cream }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 12 }}>
            Testimonials <PhBadge />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: 0 }}>What women are saying</h2>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[1, 2, 3].map(n => (
          <Reveal key={n} delay={n * 80}>
            <PhBox style={{ height: "100%" }}>
              <div style={{ fontSize: 36, opacity: 0.3, lineHeight: 0.8, marginBottom: 14 }}>"</div>
              <div style={{ marginBottom: 20, lineHeight: 1.6 }}>
                [Testimonial {n} — client quote about their experience at the retreat or working with Christy.]
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: T.line, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: T.soft,
                }}>PHOTO</div>
                <div>
                  <div style={{ fontStyle: "normal", fontWeight: 700, color: T.navy, fontSize: 13 }}>[Name {n}]</div>
                  <div style={{ fontSize: 11, color: T.soft }}>[City, State]</div>
                </div>
              </div>
            </PhBox>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  ["May I attend by myself?", "Absolutely. Many women attend on their own and leave with meaningful new friendships. You do not need to know anyone before you arrive."],
  ["What is included in my registration?", "Your registration includes two nights of lakefront lodging, all retreat sessions, meals and refreshments, your retreat workbook, a signed copy of Christy's book, a curated welcome package, lake activities, bonfire gatherings, and a Sunday massage experience."],
  ["Are meals included?", "Yes. Meals and refreshments are provided throughout the retreat weekend."],
  ["Can dietary restrictions be accommodated?", "Yes. Please note any dietary restrictions or food allergies in your registration form."],
  ["What should I bring?", "[Packing list to be provided to registered guests — comfortable clothes, journal, open heart.]"],
  ["Are the activities physically demanding?", "No. Lake activities and free time are optional and relaxed in nature. The retreat is designed to be restful, not strenuous."],
  ["Is the retreat faith-based?", "[To be confirmed by Christy before publishing.]"],
  ["How are roommates assigned?", "You may register with a preferred roommate or indicate you are open to being paired. Final assignments will be communicated before arrival."],
  ["What is the cancellation policy?", "[Cancellation and transfer policy to be confirmed by Christy before publishing.]"],
  ["When is the remaining balance due?", "[Payment deadline to be confirmed by Christy before publishing.]"],
  ["When will I receive the exact address?", "The exact property address will be shared only with confirmed registered guests."],
  ["Is transportation provided?", "[Transportation details to be confirmed.]"],
  ["What airport is closest?", "[Airport and travel directions to be confirmed — likely Little Rock National Airport (LIT) or Hot Springs Memorial Field (HOT).]"],
  ["Will photographs or videos be taken?", "[Photography/video policy to be confirmed by Christy.]"],
  ["What time should I arrive and depart?", "[Arrival and departure times to be confirmed and shared with registered guests.]"],
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "120px 32px", background: T.white }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: T.navy, margin: 0 }}>Common questions</h2>
          </div>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            const isTbd = a.startsWith("[");
            return (
              <Reveal key={i} delay={20}>
                <div style={{ border: `1.5px solid ${isOpen ? T.gold : T.line}`, borderRadius: 12, overflow: "hidden", transition: "border-color 200ms" }}>
                  <button onClick={() => setOpen(isOpen ? null : i)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 22px", background: isOpen ? T.goldBg : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left", gap: 16,
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.navy }}>{q}</span>
                    <span style={{ color: T.gold, fontSize: 20, flexShrink: 0, fontWeight: 300 }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 22px 18px", fontSize: 14, lineHeight: 1.7, color: isTbd ? T.soft : T.ink, fontStyle: isTbd ? "italic" : "normal" }}>
                      {a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
const Register = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name:"", email:"", phone:"", address:"", emergency:"", room:"", roommate:"", dietary:"", accessibility:"", massage:"", health:"", size:"", heard:"", photoConsent:false, policyAgreed:false });
  const upd = k => e => setData({ ...data, [k]: e.type === "checkbox" ? e.target.checked : e.target.value });

  const inputStyle = { width: "100%", padding: "12px 14px", border: `1.5px solid ${T.line}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: T.ink, background: T.cream, boxSizing: "border-box" };
  const labelStyle = { display: "flex", flexDirection: "column", gap: 5 };
  const labelText = { fontSize: 11, fontWeight: 700, color: T.soft, letterSpacing: "0.06em", textTransform: "uppercase" };

  return (
    <section id="register" style={{ padding: "120px 32px", background: T.navy, color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "start" }}>
        <Reveal>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 20 }}>Reserve Your Place</div>
          <h2 style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.025em", margin: "0 0 28px" }}>
            You have spent enough time<br/><Script size={72}>surviving.</Script>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", maxWidth: 480, marginBottom: 36 }}>
            This weekend is an invitation to pause, reconnect with yourself, and intentionally choose what comes next. You do not have to have everything figured out before you arrive. You only need to be willing to show up for yourself.
          </p>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.gold, marginBottom: 14 }}>Space is intentionally limited.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            {["September 18–20, 2026", "Lake Hamilton · Hot Springs, Arkansas", "Limited to 10 women", "$300 deposit reserves your room"].map(t => (
              <div key={t} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: T.gold }}>◆</span> {t}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ background: "#fff", color: T.ink, borderRadius: 24, padding: 36, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)", position: "relative" }}>
            <div style={{ position: "absolute", top: -14, right: 28, background: T.gold, color: T.navy, padding: "5px 16px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>$300 DEPOSIT<PhBadge /></div>

            {step < 2 ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.navy, marginBottom: 6 }}>Reservation Form</div>
                <div style={{ fontSize: 13, color: T.soft, marginBottom: 24 }}>Less than 2 minutes to complete.</div>

                {step === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <label style={labelStyle}><span style={labelText}>Full Name *</span><input style={inputStyle} value={data.name} onChange={upd("name")} /></label>
                    <label style={labelStyle}><span style={labelText}>Email Address *</span><input type="email" style={inputStyle} value={data.email} onChange={upd("email")} /></label>
                    <label style={labelStyle}><span style={labelText}>Mobile Number *</span><input type="tel" style={inputStyle} value={data.phone} onChange={upd("phone")} /></label>
                    <label style={labelStyle}><span style={labelText}>Mailing Address *</span><input style={inputStyle} value={data.address} onChange={upd("address")} /></label>
                    <label style={labelStyle}><span style={labelText}>Emergency Contact (Name & Number) *</span><input style={inputStyle} value={data.emergency} onChange={upd("emergency")} /></label>
                    <label style={labelStyle}>
                      <span style={labelText}>Room Selection *<PhBadge /></span>
                      <select style={inputStyle} value={data.room} onChange={upd("room")}>
                        <option value="">— choose a room —</option>
                        {rooms.map(r => <option key={r.name + r.house} value={`${r.house} — ${r.name}`}>{r.house} — {r.name} ({r.price})</option>)}
                      </select>
                    </label>
                    <Btn onClick={() => setStep(1)} style={{ width: "100%", marginTop: 6 }}>Continue →</Btn>
                  </div>
                )}

                {step === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <label style={labelStyle}><span style={labelText}>Roommate's name (if registering together)</span><input style={inputStyle} value={data.roommate} onChange={upd("roommate")} /></label>
                    <label style={labelStyle}><span style={labelText}>Dietary restrictions / food allergies</span><input style={inputStyle} value={data.dietary} onChange={upd("dietary")} /></label>
                    <label style={labelStyle}><span style={labelText}>Accessibility or mobility considerations</span><input style={inputStyle} value={data.accessibility} onChange={upd("accessibility")} /></label>
                    <label style={labelStyle}><span style={labelText}>Massage interest</span>
                      <select style={inputStyle} value={data.massage} onChange={upd("massage")}>
                        <option value="">— select —</option>
                        <option>Yes, interested</option>
                        <option>No, thank you</option>
                        <option>Not sure yet</option>
                      </select>
                    </label>
                    <label style={labelStyle}><span style={labelText}>Apparel size (for welcome package)</span><input style={inputStyle} value={data.size} onChange={upd("size")} placeholder="e.g. S / M / L / XL" /></label>
                    <label style={labelStyle}><span style={labelText}>How did you hear about this retreat?</span><input style={inputStyle} value={data.heard} onChange={upd("heard")} /></label>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: T.soft }}>
                      <input type="checkbox" checked={data.policyAgreed} onChange={upd("policyAgreed")} style={{ marginTop: 3, flexShrink: 0 }} />
                      I agree to the cancellation and participation policies. <span style={{ fontStyle: "italic" }}>[Policy link — TBD]</span>
                    </label>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: T.soft }}>
                      <input type="checkbox" checked={data.photoConsent} onChange={upd("photoConsent")} style={{ marginTop: 3, flexShrink: 0 }} />
                      I give optional permission for photographs and video during the retreat. <span style={{ fontStyle: "italic" }}>[Policy — TBD]</span>
                    </label>
                    <PhBox style={{ textAlign: "center", marginTop: 4 }}>
                      [Connect to payment processor — Stripe / Square — to collect $300 deposit]
                    </PhBox>
                    <Btn onClick={() => setStep(2)} style={{ width: "100%" }}>Reserve My Place →</Btn>
                    <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: T.soft, fontSize: 13, cursor: "pointer" }}>← Back</button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🦸‍♀️</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.navy }}>You're registered!</div>
                <div style={{ fontSize: 15, color: T.soft, marginTop: 10, lineHeight: 1.6 }}>
                  Check your inbox for confirmation.<br/>We'll be in touch with next steps.
                </div>
                <div style={{ marginTop: 20 }}>
                  <PhBox>Payment confirmation email will be sent here automatically once payment integration is connected.</PhBox>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ── GALLERY PLACEHOLDER ───────────────────────────────────────────────────────
const Gallery = () => (
  <section style={{ padding: "80px 32px", background: T.white }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: T.gold, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>Gallery<PhBadge /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {["Lake sunrise", "Boardwalk & water", "Cozy bedroom", "Women connecting", "Bonfire gathering", "Journaling space", "Lake activities", "Quiet reflection"].map(label => (
            <PhBox key={label} style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 6 }}>
              <div style={{ fontSize: 24 }}>📷</div>
              <div style={{ fontSize: 11 }}>[{label}]</div>
            </PhBox>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section style={{ padding: "60px 32px", background: T.goldBg, borderTop: `1px solid ${T.goldL}`, borderBottom: `1px solid ${T.goldL}` }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Stay in the loop</div>
        <div style={{ fontSize: 14, color: T.soft, marginBottom: 20 }}>Be the first to hear about future retreats and updates.</div>
        {!done ? (
          <div style={{ display: "flex", gap: 10 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" style={{ flex: 1, padding: "12px 16px", border: `1.5px solid ${T.goldL}`, borderRadius: 999, fontSize: 14, fontFamily: "inherit", color: T.ink, background: "#fff" }} />
            <Btn onClick={() => setDone(true)} style={{ whiteSpace: "nowrap", padding: "12px 24px", fontSize: 14 }}>Subscribe</Btn>
          </div>
        ) : (
          <div style={{ color: T.navy, fontWeight: 700 }}>✓ You're on the list!</div>
        )}
        <div style={{ marginTop: 14 }}>
          <PhBox style={{ fontSize: 12 }}>[Connect to email provider — Mailchimp / ConvertKit / Flodesk]</PhBox>
        </div>
      </div>
    </section>
  );
};

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: T.navyD, color: "rgba(255,255,255,0.7)", padding: "48px 32px 32px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 48, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#fff", borderRadius: 6, padding: 3, display: "flex" }}>
              <img src="assets/logo.webp" alt="" style={{ width: 28 }} />
            </div>
            <div style={{ color: "#fff" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Christy Marvel</div>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", color: T.goldL }}>BE YOUR OWN SUPERHERO™</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 300, margin: 0 }}>
            An intimate lakefront retreat for women ready to step out of survival mode and intentionally design what comes next.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            {["Facebook", "Instagram", "YouTube"].map(s => (
              <PhBox key={s} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 6, border: `1px dashed rgba(201,168,76,0.4)`, fontStyle: "normal", color: "rgba(255,255,255,0.5)" }}>
                [{s}]
              </PhBox>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.goldL, marginBottom: 16 }}>Retreat</div>
          {["The Experience", "Weekend Schedule", "Accommodations", "What's Included", "Meet Christy", "FAQ"].map(l => (
            <div key={l} style={{ fontSize: 13, marginBottom: 8 }}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: T.goldL, marginBottom: 16 }}>Contact</div>
          <PhBox style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "normal", marginBottom: 16, border: "1px dashed rgba(201,168,76,0.3)", padding: "8px 12px" }}>
            [contact@email.com — TBD]
          </PhBox>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            <a href="https://christy.ziglarcoach.com/privacy-policy-4224" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Privacy Policy</a>
            <a href="https://christy.ziglarcoach.com/terms-conditions-1884" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Terms & Conditions</a>
            <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>[Cancellation Policy — TBD]</span>
            <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>[Photo/Video Release — TBD]</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12 }}>
        <span>©2026 Christy Marvel · Be Your Own Superhero™ Retreat</span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>September 18–20, 2026 · Lake Hamilton, Hot Springs, Arkansas</span>
      </div>
    </div>
  </footer>
);

// ── APP ───────────────────────────────────────────────────────────────────────
const App = () => (
  <div style={{ background: T.cream, color: T.ink, minHeight: "100vh", fontFamily: "inherit" }}>
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: "#1a1a1a", color: "#fff",
      textAlign: "center", fontSize: 12, fontWeight: 600,
      padding: "8px 16px", letterSpacing: "0.02em",
      borderBottom: `2px solid ${T.gold}`,
    }}>
      ⚠️ Concept design © 2026 Noor Naila Himam – draft demo, not final client site.
    </div>
    <div style={{ paddingTop: 37 }}>
      <Nav />
      <Hero />
      <Experience />
      <Schedule />
      <Included />
      <MeetChristy />
      <Accommodations />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Register />
      <Newsletter />
      <Footer />
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
