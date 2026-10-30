import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/about.css";
import { readLowBandwidth, writeLowBandwidth } from "../lib/preferences";
import { exportFeedback, readFeedback } from "../lib/feedback";

export default function Settings() {
  const [lowBw, setLowBw] = useState(readLowBandwidth);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const update = () => setFeedbackCount(readFeedback().length);
    update();
    window.addEventListener("kyr-feedback-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("kyr-feedback-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const toggleLowBw = () => {
    const next = !lowBw;
    setLowBw(next);
    writeLowBandwidth(next);
  };

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 60 }}>
        <nav className="anim" style={{ fontSize: "0.83rem", color: "var(--text-faint)" }} aria-label="Breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          &nbsp;/&nbsp;<span style={{ color: "var(--text)", fontWeight: 600 }}>Settings</span>
        </nav>

        <h1 className="display display--compact anim" style={{ fontSize: "clamp(1.7rem,3.6vw,2.4rem)", marginTop: 18 }}>
          Settings
        </h1>
        <p className="muted anim" style={{ marginTop: 10 }}>
          Controls that stay on this device. No accounts, no server, no tracking.
        </p>

        <section className="about-section" style={{ marginTop: 32 }}>
          <h2>Low bandwidth mode</h2>
          <p className="sub">
            Reduce motion and hide decorative backgrounds on slow connections or low-power phones.
          </p>
          <div className="callout callout--tint" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <span>Low bandwidth mode is {lowBw ? "on" : "off"}.</span>
            <button className="btn btn--primary btn--sm" type="button" aria-pressed={lowBw} onClick={toggleLowBw}>
              {lowBw ? "Turn off" : "Turn on"}
            </button>
          </div>
        </section>

        <section className="about-section">
          <h2>Feedback</h2>
          <p className="sub">
            Flags are stored only in this browser. Export them as JSON if you want to send them to the project owner.
          </p>
          <div className="callout callout--tint" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <span>{feedbackCount} saved {feedbackCount === 1 ? "flag" : "flags"} on this device.</span>
            <button className="btn btn--primary btn--sm" type="button" onClick={exportFeedback} disabled={feedbackCount === 0}>
              Export feedback
            </button>
          </div>
          <p className="muted" style={{ marginTop: 12, fontSize: "0.85rem" }}>
            Read more in the <Link to="/about#offline" className="link-green">offline and updates</Link> section.
          </p>
        </section>
      </div>
    </div>
  );
}
