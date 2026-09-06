/* global React, ReactDOM, RETREAT_ROOMS, WAITLIST_ID, money, roomOptions,
   availabilityOf, AVAILABILITY_LABELS */
const { useState, useEffect, useRef } = React;

// Whether the site can take card payments yet. Defaults to false and only turns
// on if the server says so, so static hosting or a failed call errs towards
// "cannot take money" rather than promising a checkout that isn't there.
const usePaymentsEnabled = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    fetch("/api/config")
      .then(r => (r.ok ? r.json() : null))
      .then(d => setOn(Boolean(d && d.paymentsEnabled)))
      .catch(() => setOn(false));
  }, []);
  return on;
};

const IMG = "assets/retreat/web/";

// ── Content ───────────────────────────────────────────────────────────────────
const PILLARS = [
  ["01", "Rest and reflection", "Unhurried hours by the lake, quiet space to think, and permission to stop carrying everything for a weekend."],
  ["02", "Meaningful connection", "A small group of women in a safe, encouraging environment, where conversation stays real and no one gets lost in a crowd."],
  ["03", "Practical personal growth", "Teaching and coaching that turns reflection into a plan you can actually use when you get home."],
  ["04", "Individual attention", "Comfortable accommodations, a peaceful lakefront setting, and time with Christy that a conference could never offer."],
];

const WHO = [
  ["Has spent years taking care of everyone else",
   "Feels tired, overwhelmed, or stuck in survival mode",
   "Is moving through a transition or considering a new direction",
   "Wants to reconnect with the person she was before life became so demanding"],
  ["Is ready to examine fears, beliefs, and boundaries",
   "Wants a practical plan for her next chapter",
   "Values genuine connection with a small group of women",
   "Needs permission to rest, reflect, and begin again"],
];

const TAKEAWAYS = [
  ["Seen, heard, and supported",
   "More connected to your “Little Me”",
   "Clearer about the beliefs and fears holding you back",
   "More confident about setting healthy boundaries"],
  ["Rested and recharged",
   "Hopeful about your future",
   "Equipped with a practical 90-day action plan",
   "Ready to leave with your cape on"],
];

const DAYS = [
  {
    photo: "boat.jpg", alt: "Boat moored on a misty lake",
    label: "FRIDAY", title: "Seen, Safe, and Connected",
    items: ["Arrival and check-in", "Welcome gifts and room settling", "Welcome dinner", "Introductions and connection", "Opening teaching", "Creating an emotionally safe environment", "Naming what you want to release or change", "Evening lakefront gathering or bonfire"],
  },
  {
    photo: "gathering-lawn.jpg", alt: "Small group gathered outdoors",
    label: "SATURDAY", title: "Healing Little Me and Reclaiming Your Power",
    items: ["Breakfast", "Little Me and inner-child work", "Understanding survival mode", "Fear and the beliefs we carry", "Boundaries and self-trust", "Resilience and personal responsibility", "Leadership and intentional life design", "Lunch, reflection, and free time", "Lake activities and relaxation", "Afternoon or evening workshop, dinner, bonfire"],
  },
  {
    photo: "table-spread.jpg", alt: "Breakfast table",
    label: "SUNDAY", title: "Designing What Comes Next",
    items: ["Breakfast", "Closing teaching and reflection", "Identifying the next chapter", "Creating a practical 90-day action plan", "Sunday massage experience", "Optional lake or boat experience", "Closing celebration and departure"],
    note: "The weekend flows in this order; exact times are shared with registered guests once the final agenda is set. Lake and bonfire plans are weather permitting.",
  },
];

const INCLUDED = [
  "Two nights of lakefront accommodations",
  "All retreat teaching and coaching sessions",
  "Retreat workbook",
  "Signed copy of Christy Marvel's book",
  "A thoughtfully curated Be Your Own Superhero™ welcome package",
  "Meals and refreshments during the retreat",
  "Lake access and planned lake activities",
  "Bonfire gatherings, weather permitting",
  "Sunday massage experience or massage opportunity",
  "Optional boat experience, weather permitting",
  "A practical 90-day action plan",
  "An intimate experience limited to a small group of women",
];

// Rooms, prices and the select labels all come from rooms.js, which the server
// prices against — so a card and its option can never quote different figures.
const HOUSES = [...new Set(RETREAT_ROOMS.map(r => r.house))].map(house => ({
  name: house,
  tag: RETREAT_ROOMS.find(r => r.house === house).houseTag,
  rooms: RETREAT_ROOMS.filter(r => r.house === house),
}));

const ROOM_OPTIONS = roomOptions();

const GALLERY = [
  ["lake-house.jpg", "Lakefront house among the trees", "The houses on the water"],
  ["treeline.jpg", "Autumn treeline reflected in the lake", "Still mornings"],
  ["deck-table.jpg", "Deck table by the water", "Long table, long talks"],
  ["dock-chairs.jpg", "Two chairs on the dock", "Two chairs, no agenda"],
  ["ripple.jpg", "Ripple on still water", "Quiet water"],
  ["dock-empty.jpg", "Boardwalk on the lake", "The boardwalk"],
  ["sunrise-pink.jpg", "Lake at first light", "First light"],
  ["shoreline-homes.jpg", "Lakefront homes and docks", "Lake Hamilton"],
  ["birch-table.jpg", "Table under birch trees by the water", "A table under the birches"],
  ["swan.jpg", "Swan on still water", "Company on the water"],
  ["lake-homes-summer.jpg", "Lake homes and docks in summer", "Neighbouring homes"],
  ["boats-lake.jpg", "Boats out on the lake", "Out on the water"],
  ["pebble-shore.jpg", "Pebble shoreline at dusk", "The shoreline at dusk"],
];

const FAQS = [
  ["May I attend by myself?", "Yes. Most guests come on their own. The weekend is built to make that comfortable — introductions on Friday, a small group, and a setting where you are not left to figure anything out alone."],
  ["Do I need to know another guest?", "No. You do not need to bring anyone. If you are registering with a friend, you can name her as your roommate on the form."],
  ["What is included in my registration?", "Two nights of lakefront accommodations, all teaching and coaching sessions, the retreat workbook, a signed copy of Christy's book, a curated welcome package, meals and refreshments during the retreat, lake access and planned activities, bonfire gatherings, a Sunday massage experience, an optional boat experience, and your 90-day action plan."],
  ["Are meals included?", "Yes. Meals and refreshments during the retreat are included, beginning with Friday's welcome dinner and ending with Sunday breakfast."],
  ["Can dietary restrictions be accommodated?", "Tell us on the registration form and we will do our best. The full menu and dietary policy are being finalized and will be shared with registered guests."],
  ["What should I bring?", "Comfortable clothes for lake weather, something warm for evenings by the fire, and anything that helps you rest. A full packing list goes out to registered guests before the weekend."],
  ["Are the activities physically demanding?", "No. Sessions are seated, and lake activities are optional. Note any mobility or health considerations on the form so we can plan around them."],
  ["Is the retreat faith-based?", "The weekend is open to every woman regardless of background. Whether it is described as explicitly faith-based is still being finalized; details will be confirmed before registration closes."],
  ["How are roommates assigned?", "You choose your room or bed at registration. If you are coming with someone, name her on the form and you will be placed together. Shared rooms show how many women may occupy them."],
  ["What is the cancellation policy?", "The cancellation and transfer policy, including whether the deposit is refundable, is being finalized and will be provided in writing before any payment is taken."],
  ["When is the remaining balance due?", "The balance is paid online before the retreat. The exact deadline is being finalized and will be included in your confirmation."],
  ["When will I receive the exact address?", "The property address is shared only with registered guests, along with arrival instructions."],
  ["Is transportation provided? What airport is closest?", "Travel arrangements are still being confirmed. Airport and directions information will be sent to registered guests well before the weekend."],
  ["Will photographs or videos be taken?", "Some moments may be photographed. The registration form includes an optional permission checkbox, and the final photography policy will be confirmed with guests."],
  ["What time should I arrive and depart?", "Friday afternoon arrival and Sunday afternoon departure. Exact times are shared with registered guests once the final agenda is set."],
];

// ── Building blocks ───────────────────────────────────────────────────────────
const Photo = ({ src, alt, className = "", eager, children }) => (
  <div className={`ph ${className}`.trim()}>
    <img
      src={IMG + src}
      alt={alt}
      loading={eager ? undefined : "lazy"}
      decoding={eager ? undefined : "async"}
    />
    {children}
  </div>
);

const Heading = ({ eyebrow, tone = "deep", title, style }) => (
  <>
    <div className={`eyebrow rv ${tone}`}>{eyebrow}</div>
    <h2 className="h2 rv" style={{ marginTop: 16, ...style }}>{title}</h2>
    <div className="rule rv" />
  </>
);

const Checks = ({ items, ink }) => (
  <ul className={ink ? "checks ink" : "checks"}>
    {items.map(t => <li className="rv" key={t}>{t}</li>)}
  </ul>
);

// ── Sections ──────────────────────────────────────────────────────────────────
const Nav = () => (
  <nav>
    <div className="inner">
      <a className="brand" href="#top">
        <span className="mark"><img src="assets/logo.webp" alt="" style={{ width: 34 }} /></span>
        <span style={{ lineHeight: 1.1 }}>
          <span style={{ display: "block", fontSize: 16, fontWeight: 700 }}>Christy Marvel</span>
          <span style={{ display: "block", fontSize: 10, letterSpacing: ".18em", color: "#f7eed8", opacity: .6, marginTop: 2 }}>LIFE COACHING</span>
        </span>
      </a>
      <div className="links">
        <a href="#experience">The Experience</a>
        <a href="#who">Who It's For</a>
        <a href="#flow">The Weekend</a>
        <a href="#rooms">Rooms</a>
        <a href="#christy">Christy</a>
        <a href="#faq">FAQ</a>
        <a className="btn btn-sm" href="#reserve">Reserve Your Place →</a>
      </div>
    </div>
  </nav>
);

const Hero = ({ bgRef }) => (
  <section className="hero" id="top">
    <div className="bg" ref={bgRef}>
      <img src={IMG + "sunset-lake.jpg"} alt="Sunset over Lake Hamilton" />
    </div>
    <div className="scrim" />
    <div className="inner"><div className="wrap">
      <div className="eyebrow rv gold">September 18–20, 2026 · Hot Springs, Arkansas</div>
      <h1 className="rv" style={{ marginTop: 20 }}>
        Be Your Own Superhero<span className="tm">™</span> Retreat
      </h1>
      <p className="sub rv">Heal. Recharge. Rediscover the Strength Within You.</p>
      <div className="acts rv">
        <a className="btn btn-gold" href="#reserve">Reserve Your Place</a>
        <a className="btn btn-ghost" href="#experience">Learn More</a>
      </div>
      <div className="meta rv">
        <div><div className="k">DATES</div><div className="v">September 18–20, 2026</div></div>
        <div><div className="k">SETTING</div><div className="v">Lake Hamilton, Hot Springs, Arkansas</div></div>
        <div><div className="k">GROUP SIZE</div><div className="v">No more than 10 women</div></div>
      </div>
    </div></div>
    <a className="cue" href="#experience">SCROLL<i /></a>
  </section>
);

const Experience = () => (
  <section className="pad" id="experience"><div className="wrap about">
    <div>
      <Heading eyebrow="The Experience" title="A weekend to step out of survival mode." />
      <p className="lede rv" style={{ margin: "30px 0 0" }}>
        An intimate lakefront weekend created for women who are ready to step out of survival mode, reconnect with themselves, and intentionally design what comes next.
      </p>
      <p className="rv" style={{ fontSize: 19, lineHeight: 1.65, color: "var(--muted)", margin: "22px 0 0", maxWidth: "56ch" }}>
        The weekend is held at two beautiful neighboring lake homes on Lake Hamilton — about ten feet apart, connected by a gate, sharing easy access to the lake and boardwalk. Registration is limited to no more than ten women, because comfort, privacy, and the quality of each woman's experience matter more than filling every bed.
      </p>
      <div className="pillars">
        {PILLARS.map(([n, t, d]) => (
          <div className="p rv" key={n}>
            <div className="n">{n}</div>
            <div>
              <div className="t">{t}</div>
              <p className="d">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="aboutart rv">
      <Photo className="big" src="dock-picnic.jpg" alt="Two women talking on the dock" />
      <Photo className="small" src="journal.jpg" alt="Journaling by the water" />
      <Photo className="third" src="beach-group.jpg" alt="Small group gathered on the shore" />
      <Photo className="fourth" src="lakeside-group.jpg" alt="Group sitting by the lake at dusk" />
      <div className="badge script">room to breathe</div>
    </div>
  </div></section>
);

const Who = () => (
  <section className="pad who" id="who">
    <div className="bg"><img loading="lazy" decoding="async" src={IMG + "two-by-water.jpg"} alt="" /></div>
    <div className="inner"><div className="wrap">
      <Heading eyebrow="Who It Is For" tone="gold" title="This weekend is for the woman who…" style={{ maxWidth: "22ch" }} />
      <div className="split">
        {WHO.map((col, i) => <Checks key={i} items={col} />)}
      </div>
      <div className="pull rv">
        The retreat is not about pretending to be invincible. It is about learning to stop abandoning yourself while waiting for someone else to rescue you.
      </div>
    </div></div>
  </section>
);

const TakeHome = () => (
  <section className="pad alt"><div className="wrap">
    <Heading eyebrow="What You Will Take Home" title="Leave with your cape on." style={{ maxWidth: "20ch" }} />
    <div className="split">
      {TAKEAWAYS.map((col, i) => <Checks key={i} items={col} ink />)}
    </div>
  </div></section>
);

const Weekend = () => (
  <section className="pad" id="flow"><div className="wrap">
    <Heading eyebrow="The Weekend" title="Three days, one arc" style={{ maxWidth: "18ch" }} />
    <div className="days">
      {DAYS.map(d => (
        <div className="day rv" key={d.label}>
          <Photo src={d.photo} alt={d.alt} />
          <div className="body">
            <div className="lbl"><i>{d.label}</i><b>{d.title}</b></div>
            <ul>{d.items.map(i => <li key={i}>{i}</li>)}</ul>
            {d.note && <p className="note">{d.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </div></section>
);

const Included = () => (
  <section className="pad incband">
    <div className="bg"><img loading="lazy" decoding="async" src={IMG + "water-texture.jpg"} alt="" /></div>
    <div className="inner"><div className="wrap">
      <Heading eyebrow="What Is Included" tone="gold" title="Everything but the drive out." style={{ maxWidth: "20ch" }} />
      <div className="inc">
        {INCLUDED.map(t => <div className="rv" key={t}>{t}</div>)}
      </div>
    </div></div>
  </section>
);

const Rooms = ({ onSelectRoom }) => (
  <section className="pad alt" id="rooms"><div className="wrap">
    <Heading eyebrow="Accommodations" title="Two lake homes, ten feet apart" style={{ maxWidth: "24ch" }} />
    <p className="lede rv" style={{ margin: "30px 0 0", maxWidth: "62ch" }}>
      Choose the room that fits how you want to spend the weekend. Premium private rooms and comfortable shared rooms are offered first; each selection shows its bed type, how many women may share it, and whether the bathroom is private. Once a room or bed is reserved it is no longer offered to another guest.
    </p>
    <div className="ph-note rv">
      <b>Placeholder — availability not yet confirmed.</b> Every room below is marked
      available. Set each room's real status in <code>rooms.js</code> before this page
      is shared publicly, or it will offer rooms that are already taken.
    </div>

    {HOUSES.map(house => (
      <div className="house" key={house.name}>
        <h3 className="h3 rv">{house.name} <span className="tag">{house.tag}</span></h3>
        <div className="rooms">
          {house.rooms.map(r => (
            <div className="room rv" key={r.id}>
              <div className="slot">
                <div className="drop"><b>🛏</b>{r.photoNote}</div>
              </div>
              <div className="body">
                <div className="nm">{r.name}</div>
                <dl>
                  {r.specs.map(([k, v]) => (
                    <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>
                  ))}
                </dl>
                <div className="foot">
                  <div className="pr">{money(r.priceCents)} <small>{r.unit}</small></div>
                  <span className={`avail ${availabilityOf(r.id)}`}>
                    {AVAILABILITY_LABELS[availabilityOf(r.id)]}
                  </span>
                </div>
                <a className="btn btn-line" style={{ marginTop: 18 }} href="#reserve"
                   onClick={() => onSelectRoom(r.id)}>{r.cta}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    <p className="fine rv" style={{ maxWidth: "70ch" }}>
      Sleeper-sofa accommodations exist in both homes and are only offered if every room has been filled and a guest asks to be added. The exact property address is provided to registered guests. Room prices are being finalized and may be set individually per room.
    </p>
  </div></section>
);

const Investment = ({ paymentsEnabled }) => (
  <section className="pad" id="investment"><div className="wrap">
    <Heading eyebrow="Investment" title="Reserve with a deposit" />
    {!paymentsEnabled && (
      <div className="ph-note rv">
        <b>Placeholder — online payment is not live yet.</b> Prices below are working
        figures awaiting Christy's confirmation. Registrations are collected and Christy
        arranges payment personally until her payment account is set up.
      </div>
    )}
    <div className="pay">
      <div className="rv">
        <div className="lb">Shared Room</div>
        <div className="big" style={{ marginTop: 14 }}>$795</div>
        <p>Per person, for the full weekend — lodging, sessions, meals, workbook, signed book, and welcome package.</p>
      </div>
      <div className="rv">
        <div className="lb">Private Room</div>
        <div className="big" style={{ marginTop: 14 }}>$995</div>
        <p>Per person, with a private bathroom. Limited to the two master suites.</p>
      </div>
      <div className="rv dark">
        <div className="lb">Deposit</div>
        <div className="big" style={{ marginTop: 14 }}>$300</div>
        <p>Due at registration to hold your room. Applied to your total; the remaining balance is paid online before the retreat.</p>
      </div>
    </div>
    <p className="fine rv" style={{ maxWidth: "70ch" }}>
      Payment is made securely online — deposit now, remaining balance later. You will receive an automatic confirmation email as soon as your registration is received. Balance deadline, refund terms, and the cancellation and transfer policy are being finalized and will be confirmed in writing before any payment is taken.
    </p>
  </div></section>
);

const Christy = () => (
  <section className="pad alt" id="christy"><div className="wrap christy">
    <div className="port rv">
      <div className="ph"><img loading="lazy" decoding="async" src="assets/christy.webp" alt="Christy Marvel" /></div>
    </div>
    <div>
      <Heading eyebrow="Meet Christy" title="Christy Marvel" />
      <p className="lede rv" style={{ margin: "30px 0 0" }}>
        Author, Ziglar Master Coach and Trainer, keynote speaker, entrepreneur, and former architect.
      </p>
      <p className="rv" style={{ fontSize: 19, lineHeight: 1.7, color: "var(--muted)", margin: "20px 0 0", maxWidth: "58ch" }}>
        Christy healed her own childhood trauma and walked herself out of survival mode, and she now helps women do the same — heal their “Little Me” and unlock the power within. She wrote <em>Be Your Own Superhero: Heal Your “Little Me” and Unlock the Power Within</em>, with a foreword by Tom Ziglar, and every guest leaves the retreat with a signed copy.
      </p>
      <div className="creds rv">
        {["Author", "Ziglar Master Coach & Trainer", "Keynote Speaker", "Entrepreneur", "Former Architect"].map(c => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div className="seal rv">
        <img src="assets/book.webp" alt="Be Your Own Superhero book cover" />
        <img src="assets/ziglar-legacy.webp" alt="Ziglar Legacy Certified" />
      </div>
    </div>
  </div></section>
);

const Quote = ({ bgRef }) => (
  <section className="quote">
    <div className="bg" ref={bgRef}>
      <img loading="lazy" decoding="async" src={IMG + "dock-sitting.jpg"} alt="A woman sitting at the end of a dock" />
    </div>
    <div className="scrim" />
    <div className="inner"><div className="wrap">
      <p className="rv">You already have the strength. This is the weekend you get to feel it.</p>
      <div className="who2 rv">— Christy</div>
    </div></div>
  </section>
);

const Gallery = () => (
  <section className="pad" id="gallery"><div className="wrap">
    <Heading eyebrow="The Place" title="Lake, boardwalk, firelight." />
    <div className="gal">
      {GALLERY.map(([src, alt, cap]) => (
        <Photo key={src} className="rv" src={src} alt={alt}>
          <div className="cap">{cap}</div>
        </Photo>
      ))}
    </div>
  </div></section>
);

const Field = ({ label, children }) => (
  <label><span>{label}</span>{children}</label>
);

const Register = ({ room, setRoom, paymentsEnabled }) => {
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const d = new FormData(e.target);
    const payload = { roomId: room, policies: d.get("policies") === "on", media: d.get("media") === "on" };
    for (const [k, v] of d.entries()) {
      if (k !== "policies" && k !== "media" && k !== "room") payload[k] = v;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      // Waitlist and placeholder mode both take no money, so there is nothing
      // to redirect to — confirm inline instead.
      const first = String(d.get("name") || "friend").trim().split(" ")[0];
      if (data.waitlisted) { setSent({ first, waitlisted: true }); return; }
      if (data.deferred)   { setSent({ first, deferred: true }); return; }
      window.location.assign(data.url);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <section className="pad reg" id="reserve">
      <div className="inner wrap">
        <div>
          <div className="eyebrow rv gold">Reserve Your Place</div>
          <h2 className="h2 rv" style={{ marginTop: 16, color: "#fff" }}>
            {paymentsEnabled ? "Hold your room with $300." : "Request your place."}
          </h2>
          <div className="rule rv" />
          <p className="rv" style={{ marginTop: 28 }}>
            Tell us how to reach you and which room you would like. You will receive an automatic confirmation, and Christy will follow up personally with your payment link, arrival details, and the property address.
          </p>
          <p className="rv" style={{ marginTop: 18 }}>
            If the retreat is full, submit the form and choose the waitlist — you will be first to hear when a room opens.
          </p>
          <p className="script rv" style={{ fontSize: "clamp(28px,3.2vw,42px)", color: "var(--gold-light)", marginTop: 30 }}>
            Space is intentionally limited.
          </p>
        </div>

        <div className="card rv">
          {sent ? (
            <div className="done">
              <div className="script">
                {sent.waitlisted ? "You're on the list." : "Your place is held."}
              </div>
              <p style={{ fontSize: 19, lineHeight: 1.65, color: "var(--ink)", margin: "16px 0 0" }}>
                {sent.waitlisted ? (
                  <>Thank you, {sent.first}. No payment has been taken. You will be the first to
                  hear when a room opens, and Christy will follow up personally.</>
                ) : (
                  <>Thank you, {sent.first}. Your details are with Christy and no payment has been
                  taken yet. She will be in touch personally to confirm your room and arrange the
                  $300 deposit, along with arrival details and the property address.</>
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <fieldset className="fs">
                <legend>About you</legend>
                <Field label="Full name"><input name="name" required /></Field>
                <div className="row">
                  <Field label="Email address"><input type="email" name="email" required /></Field>
                  <Field label="Mobile number"><input name="mobile" required /></Field>
                </div>
                <Field label="Mailing address">
                  <textarea name="address" placeholder="Street, city, state, ZIP" />
                </Field>
                <div className="row">
                  <Field label="Emergency contact name"><input name="ecname" required /></Field>
                  <Field label="Emergency contact number"><input name="ecphone" required /></Field>
                </div>
              </fieldset>

              <fieldset className="fs">
                <legend>Your room</legend>
                <Field label="Room or bed selection">
                  <select name="room" value={room} onChange={e => setRoom(e.target.value)}>
                    {ROOM_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label="Roommate's name, if registering with someone">
                  <input name="roommate" />
                </Field>
              </fieldset>

              <fieldset className="fs">
                <legend>Caring for you well</legend>
                <Field label="Dietary restrictions or food allergies"><textarea name="diet" /></Field>
                <Field label="Accessibility or mobility considerations"><textarea name="access" /></Field>
                <Field label="Health considerations for lake or boat activities"><textarea name="health" /></Field>
                <div className="row">
                  <Field label="Massage interest">
                    <select name="massage">
                      <option>Yes, please</option><option>Maybe</option><option>No thank you</option>
                    </select>
                  </Field>
                  <Field label="Apparel size">
                    <select name="size">
                      {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="How did you hear about the retreat?"><input name="source" /></Field>
              </fieldset>

              <div className="chk">
                <input type="checkbox" name="policies" id="p1" required />
                <label htmlFor="p1"><span>I agree to the cancellation and participation policies.</span></label>
              </div>
              <div className="chk">
                <input type="checkbox" name="media" id="p2" />
                <label htmlFor="p2"><span>Optional: I give permission for photographs and video taken at the retreat to be used by Christy Marvel.</span></label>
              </div>

              {error && <p className="formerror" role="alert">{error}</p>}
              <button className="btn btn-gold" type="submit" disabled={busy}
                      style={{ width: "100%", marginTop: 12, opacity: busy ? .65 : 1 }}>
                {busy ? (paymentsEnabled ? "Taking you to checkout…" : "Sending…")
                      : room === WAITLIST_ID ? "Join the Waitlist"
                      : paymentsEnabled ? "Reserve My Place" : "Request My Place"}
              </button>
              <p className="fine">
                {room === WAITLIST_ID
                  ? "Joining the waitlist takes no payment. You will only be asked for a deposit if a room opens."
                  : paymentsEnabled
                    ? "A $300 deposit confirms your room and is applied to your total. The remaining balance is paid online before the retreat. Payment is handled securely by Stripe."
                    : "No payment is taken on this page. Christy will contact you personally to confirm your room and arrange the $300 deposit."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Faq = () => (
  <section className="pad alt" id="faq"><div className="wrap">
    <Heading eyebrow="Questions" title="Frequently asked" />
    <div className="faq">
      {FAQS.map(([q, a]) => (
        <details className="rv" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  </div></section>
);

const Invite = () => (
  <section className="invite">
    <div className="bg"><img loading="lazy" decoding="async" src={IMG + "water-texture.jpg"} alt="" /></div>
    <div className="inner"><div className="wrap">
      <h2 className="h2 rv" style={{ color: "#fff", maxWidth: "22ch", margin: "0 auto" }}>
        You have spent enough time surviving.
      </h2>
      <p className="rv" style={{ margin: "28px auto 0" }}>
        This weekend is an invitation to pause, reconnect with yourself, and intentionally choose what comes next. You do not have to have everything figured out before you arrive. You only need to be willing to show up for yourself.
      </p>
      <div className="lim rv">Space is intentionally limited</div>
      <div className="rv" style={{ marginTop: 26 }}>
        <a className="btn btn-gold" href="#reserve">Reserve Your Place</a>
      </div>
    </div></div>
  </section>
);

const Newsletter = () => {
  const [done, setDone] = useState(false);
  return (
    <section className="news"><div className="wrap">
      <h3 className="rv" style={{ fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 800, letterSpacing: "-.03em" }}>
        Not this one? Get the next dates first.
      </h3>
      <p className="rv" style={{ color: "var(--muted)", margin: "14px 0 0", fontSize: 19 }}>
        Future retreat dates, waitlist openings, and notes from Christy.
      </p>
      <form className="rv" onSubmit={e => { e.preventDefault(); e.target.reset(); setDone(true); }}>
        <input type="email" name="email" placeholder="you@email.com" required />
        <button className="btn btn-gold" type="submit" style={{ padding: "16px 32px" }}>Keep Me Posted</button>
      </form>
      {done && <p className="fine">You're on the list. Watch your inbox for the next dates.</p>}
    </div></section>
  );
};

const Footer = () => (
  <footer><div className="wrap">
    <div className="cols">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ background: "#fff", padding: 4, borderRadius: 6, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="assets/logo.webp" alt="" style={{ width: 34 }} />
          </span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>Christy Marvel</span>
        </div>
        <p style={{ margin: "18px 0 0", maxWidth: "34ch", lineHeight: 1.6 }}>
          Be Your Own Superhero™ Retreat · September 18–20, 2026 · Lake Hamilton, Hot Springs, Arkansas.
        </p>
        <p style={{ margin: "14px 0 0" }}><a href="mailto:hello@christymarvel.com">hello@christymarvel.com</a></p>
      </div>
      <div>
        <h4>Retreat</h4>
        <ul>
          <li><a href="#experience">The Experience</a></li>
          <li><a href="#flow">The Weekend</a></li>
          <li><a href="#rooms">Accommodations</a></li>
          <li><a href="#investment">Investment</a></li>
          <li><a href="#reserve">Reserve</a></li>
        </ul>
      </div>
      <div>
        <h4>Policies</h4>
        <ul>
          <li><a href="#faq">Cancellation policy</a></li>
          <li><a href="#faq">Participation terms</a></li>
          <li><a href="#faq">Photo &amp; video release</a></li>
          <li><a href="#faq">Privacy policy</a></li>
        </ul>
      </div>
      <div>
        <h4>Connect</h4>
        <ul>
          <li><a href="#christy">About Christy</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#reserve">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="base">
      <div>© 2026 Christy Marvel. All rights reserved. Be Your Own Superhero™.</div>
      <div>Policy pages to be linked once finalized.</div>
    </div>
  </div></footer>
);

// Shown when Stripe redirects back after a completed deposit. The booking is
// confirmed by the webhook, not here — this only reports what happened.
const Reserved = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has("reserved")) return;

    if (q.get("reserved") !== "1") { setState({ cancelled: true }); return; }

    const sid = q.get("session_id");
    if (!sid) { setState({ paid: true }); return; }
    fetch(`/api/registration?session_id=${encodeURIComponent(sid)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => setState({ paid: true, ...d }))
      .catch(() => setState({ paid: true }));
  }, []);

  if (!state) return null;

  return (
    <div className={`banner ${state.cancelled ? "warn" : ""}`} role="status">
      {state.cancelled ? (
        <span>Checkout was cancelled — no payment was taken. Your place is not yet held.</span>
      ) : (
        <span>
          <b>Your place is held{state.name ? `, ${state.name.split(" ")[0]}` : ""}.</b>{" "}
          {state.roomName ? `${state.roomName}. ` : ""}
          A confirmation is on its way{state.email ? ` to ${state.email}` : ""}, and Christy will
          follow up with arrival details and the property address.
        </span>
      )}
      <button onClick={() => setState(null)} aria-label="Dismiss">×</button>
    </div>
  );
};

// ── Scroll behaviour ──────────────────────────────────────────────────────────
// Reveal elements start invisible, so a failure to observe would render the page
// blank. Force them visible on a timeout, on tab focus, and before printing.
const useReveal = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".rv"));
    const showAll = () => els.forEach(el => el.classList.add("in"));

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: .12 });

    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });

    const onVisible = () => { if (document.visibilityState === "visible" && !document.querySelector(".rv.in")) showAll(); };
    const timer = setTimeout(() => { if (!document.querySelector(".rv.in")) showAll(); }, 1200);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("beforeprint", showAll);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("beforeprint", showAll);
    };
  }, []);
};

const useScrollEffects = (heroBg, quoteBg, bar) => {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (heroBg.current) heroBg.current.style.transform = `translateY(${y * 0.22}px)`;
      if (quoteBg.current) {
        const r = quoteBg.current.parentElement.getBoundingClientRect();
        quoteBg.current.style.transform = `translateY(${(r.top - window.innerHeight / 2) * -0.07}px)`;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
};

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  const heroBg = useRef(null);
  const quoteBg = useRef(null);
  const bar = useRef(null);
  const [room, setRoom] = useState(ROOM_OPTIONS[0].id);
  const paymentsEnabled = usePaymentsEnabled();

  useReveal();
  useScrollEffects(heroBg, quoteBg, bar);

  return (
    <>
      <div className="wm">
        ⚠️ Concept design © 2026 Noor Naila Himam — draft demo, not the final client site.
      </div>
      <Reserved />
      <div className="bar" ref={bar} />
      <Nav />
      <Hero bgRef={heroBg} />
      <Experience />
      <Who />
      <TakeHome />
      <Weekend />
      <Included />
      <Rooms onSelectRoom={setRoom} />
      <Investment paymentsEnabled={paymentsEnabled} />
      <Christy />
      <Quote bgRef={quoteBg} />
      <Gallery />
      <Register room={room} setRoom={setRoom} paymentsEnabled={paymentsEnabled} />
      <Faq />
      <Invite />
      <Newsletter />
      <Footer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
