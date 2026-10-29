import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/encounter.css";
import { Reveal, CtaSplit } from "../components/ui";
import { IconPin } from "../components/icons";

const STEPS: Array<{
  id: string; num: number; kicker: string; title: string; note: string; tip?: string; link?: { label: string; to: string };
}> = [
  {
    id: "step-1", num: 1, kicker: "First 10 seconds", title: "Pull over safely",
    note: "Indicate, stop fully off the lane, switch off the engine. Sudden moves raise tension — yours and theirs.",
    tip: "💡 Night stops: interior light on. It signals nothing to hide and helps everyone see clearly.",
  },
  {
    id: "step-2", num: 2, kicker: "While stopping", title: "Hands visible, window down",
    note: "Keep hands on the wheel. Move slowly and announce what you're reaching for before you reach.",
    tip: "💡 \u201cI'm reaching for my licence in the wallet now\u201d — one sentence prevents most misunderstandings.",
  },
  {
    id: "step-3", num: 3, kicker: "Opening line", title: "Greet, then ask one calm question",
    note: "\u201cGood afternoon, officer. Please, what is the issue?\u201d Politeness costs nothing and de-escalates almost everything.",
  },
  {
    id: "step-4", num: 4, kicker: "Documents", title: "Provide required documents only",
    note: "Driver's licence and vehicle papers where required. Your phone, bag and privacy stay with you unless the law says otherwise.",
    link: { label: "Which documents are required? →", to: "/scenario/vehicle-documents-checks" },
  },
  {
    id: "step-5", num: 5, kicker: "Protect the record", title: "You may note or record, where safe",
    note: "Note the officer's name, unit and vehicle number. Recording rules vary — check the phone-search scenario for the details.",
    link: { label: "Can I record the encounter? →", to: "/scenario/police-phone-search-checkpoint" },
  },
  {
    id: "step-6", num: 6, kicker: "If it goes further", title: "If detained or unsure, ask the two questions",
    note: "\u201cAm I under arrest?\u201d and \u201cOn what grounds?\u201d If the answer is no, you may ask whether you are free to go — calmly, once.",
    tip: "💡 Then stop talking. Anything after this should happen with a lawyer informed — the help directory has free options.",
  },
];

const STEPNAV = [
  { id: "step-1", n: "01", label: "Pull over safely" },
  { id: "step-2", n: "02", label: "Hands visible" },
  { id: "step-3", n: "03", label: "Greet, then ask" },
  { id: "step-4", n: "04", label: "Documents only" },
  { id: "step-5", n: "05", label: "Note or record" },
  { id: "step-6", n: "06", label: "The two questions" },
];

const CHIPS: Array<{ label: string; to: string }> = [
  { label: "Checkpoint stop", to: "/scenario/police-stop-search-car" },
  { label: "Phone search", to: "/scenario/police-phone-search-checkpoint" },
  { label: "Impoundment", to: "/scenario/vio-vehicle-impound" },
  { label: "Arrest & detention", to: "/scenario/police-arrest-detention" },
  { label: "Fines on the spot", to: "/scenario/frsc-fines-on-the-spot" },
];

export default function Encounter() {
  /* Step-nav scroll highlighting, same params as the prototype script */
  const [activeStep, setActiveStep] = useState("step-1");

  useEffect(() => {
    const stepIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveStep(e.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".tstep[id]").forEach((el) => stepIo.observe(el));
    return () => stepIo.disconnect();
  }, []);

  return (
    <>
      {/* Emergency callout */}
      <div className="container" style={{ paddingTop: 20 }}>
        <div className="callout callout--danger anim">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><path d="M10 3 18 17H2L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8.5v3.5M10 14.6v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span><strong>If anyone is hurt, trapped, or the situation is escalating — stop reading and call <a href="tel:112" style={{ color: "inherit", textDecoration: "underline" }}>112</a> now.</strong></span>
        </div>
      </div>

      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb anim" aria-label="Breadcrumb">
            <Link to="/">Home</Link>&nbsp;/&nbsp;<span className="here">Encounter mode</span>
          </nav>
          <h1 className="display display--section anim" style={{ marginTop: 14, animationDelay: ".06s" }}>
            Stay calm. <span className="mark-lime" style={{ borderRadius: 10 }}>You have rights.</span>
          </h1>
          <p className="lede anim" style={{ maxWidth: 560, marginTop: 14, animationDelay: ".12s" }}>
            Six short steps for the moment you're stopped. Read them now — saves automatically after first visit.
          </p>
          <div className="badge-row anim" style={{ marginTop: 20, flexWrap: "wrap", animationDelay: ".18s" }}>
            <span className="badge-lime">✓ Reviewed · Oct 2026</span>
            <span className="badge-outline">Available offline after first visit</span>
            <span className="badge-outline">⎙ Print</span>
            <span className="badge-outline">🔗 Share</span>
          </div>
        </div>
      </section>

      {/* Steps: sticky nav + timeline */}
      <section className="section--tight" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="enc-grid">

            <aside className="stepnav anim" style={{ animationDelay: ".2s" }}>
              <h4>The six steps</h4>
              {STEPNAV.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={activeStep === s.id ? "is-active" : ""}>
                  <span className="n">{s.n}</span> {s.label}
                </a>
              ))}
              <div className="call-112">
                <a href="tel:112" className="btn btn--primary btn--sm">Call 112 now</a>
              </div>
            </aside>

            <div className="timeline">
              {STEPS.map((step) => (
                <Reveal key={step.id} as="div" className="tstep" id={step.id}>
                  <span className="tstep__num">{step.num}</span>
                  <div className="tstep__kicker">{step.kicker}</div>
                  <h3 className="tstep__title">{step.title}</h3>
                  <p className="tstep__note">{step.note}</p>
                  {step.link && (
                    <Link to={step.link.to} className="link-green" style={{ display: "inline-block", marginTop: 12, fontSize: "0.85rem" }}>
                      {step.link.label}
                    </Link>
                  )}
                  {step.tip && <div className="tstep__tip">{step.tip}</div>}
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Say this / not that */}
      <section className="section--tight" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container" style={{ paddingTop: 48 }}>
          <Reveal as="h2" className="display display--compact" style={{ fontSize: "1.5rem", marginBottom: 24 }}>Words that help, words that hurt</Reveal>
          <div className="phrase-grid">
            <div className="phrase-card reveal">
              <h3 style={{ color: "var(--link)" }}>
                <svg className="ico" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="m5.8 9.2 2.2 2.2 4.2-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Say this
              </h3>
              <ul className="phrase-list">
                <li><span className="ico">🟢</span>"Good afternoon, officer. Please, what is the issue?"</li>
                <li><span className="ico">🟢</span>"Here is my licence. Is there anything else you need?"</li>
                <li><span className="ico">🟢</span>"Am I under arrest? On what grounds?"</li>
                <li><span className="ico">🟢</span>"I'd like to note your name and unit number, please."</li>
              </ul>
            </div>
            <div className="phrase-card phrase-card--bad reveal" style={{ transitionDelay: ".08s" }}>
              <h3 style={{ color: "var(--danger)" }}>
                <svg className="ico" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="m6.2 6.2 5.6 5.6M11.8 6.2l-5.6 5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                Avoid saying
              </h3>
              <ul className="phrase-list">
                <li><span className="ico">🔴</span>"Do you know who I am?" — escalates fast.</li>
                <li><span className="ico">🔴</span>"How much will you take?" — that's a bribe, and a crime.</li>
                <li><span className="ico">🔴</span>Arguing case law at the roadside — note it, contest it later.</li>
                <li><span className="ico">🔴</span>Sudden movements toward the glove box unannounced.</li>
              </ul>
            </div>
          </div>

          {/* Quick scenarios */}
          <Reveal className="chip-row chip-row--start" style={{ marginTop: 32 }}>
            <span className="muted" style={{ fontSize: "0.85rem", alignSelf: "center" }}>Jump to a scenario:</span>
            {CHIPS.map((chip) => (
              <Link key={chip.label} to={chip.to} className="chip chip--tint">{chip.label}</Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <CtaSplit
            copy={
              <>
                <h2 className="display display--section">Need verified help,<br /><span className="mark-lime" style={{ borderRadius: 10 }}>not guesswork?</span></h2>
                <p className="lede">Complaint channels and free legal aid for what happens after the stop — each showing the date it was last checked.</p>
              </>
            }
            actions={
              <>
                <a href="tel:112" className="action-card action-card--dark reveal" style={{ transitionDelay: ".06s" }}>
                  <span className="action-card__icon">
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.2 3.5h3l1.5 3.8-2 1.4a11 11 0 0 0 4.6 4.6l1.4-2 3.8 1.5v3a1.7 1.7 0 0 1-1.9 1.7A13.5 13.5 0 0 1 2.5 5.4a1.7 1.7 0 0 1 1.7-1.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                  </span>
                  <div>
                    <h3>Emergency · 112</h3>
                    <p>If anyone is hurt or things are escalating, call now.</p>
                  </div>
                  <span className="action-card__arrow">→</span>
                </a>
                <Link to="/help" className="action-card reveal" style={{ transitionDelay: ".12s" }}>
                  <span className="action-card__icon">
                    <IconPin width={19} height={19} />
                  </span>
                  <div>
                    <h3>Open the help directory</h3>
                    <p>Complaint channels and free legal aid, with the date each was last checked.</p>
                  </div>
                  <span className="action-card__arrow">→</span>
                </Link>
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
