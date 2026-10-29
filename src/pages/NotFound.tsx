import { Link, useNavigate } from "react-router-dom";
import "../styles/notfound.css";
import { IconSearch, IconArrowRight } from "../components/icons";

const CHIPS = [
  { label: "Checkpoint stop", to: "/scenario/police-stop-search-car" },
  { label: "Phone search", to: "/scenario/police-phone-search-checkpoint" },
  { label: "Impoundment", to: "/scenario/vio-vehicle-impound" },
  { label: "Browse situations", to: "/browse" },
  { label: "Help directory", to: "/help" },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="nf bg-grid bg-glow">
      <div className="container text-center">
        <div className="nf__art anim" aria-hidden="true">
          {/* Checkpoint barrier illustration */}
          <svg className="nf__barrier" width="96" height="96" viewBox="0 0 72 72" fill="none">
            <path d="M22 41v19M50 41v19" stroke="var(--line-strong)" strokeWidth="4" strokeLinecap="round"/>
            <rect x="6" y="25" width="60" height="16" rx="4" fill="var(--bg-tint)" stroke="var(--line-strong)" strokeWidth="1.5"/>
            <g clipPath="url(#barrierClip)">
              <path d="M12 41 24 25M26 41 38 25M40 41 52 25M54 41 66 25" stroke="var(--lime)" strokeWidth="7"/>
            </g>
            <defs>
              <clipPath id="barrierClip"><rect x="6" y="25" width="60" height="16" rx="4"/></clipPath>
            </defs>
          </svg>
          <div className="road-wrap"><span className="road-dashes"></span></div>
        </div>

        <div className="nf__code anim" style={{ animationDelay: ".08s" }} aria-hidden="true">4<span className="zero">0</span>4</div>

        <h1 className="nf__title anim" style={{ animationDelay: ".16s" }}>
          This page took a wrong turn
          at <span className="mark-lime" style={{ borderRadius: 10, padding: "0 10px" }}>the checkpoint</span>
        </h1>

        <p className="lede anim" style={{ animationDelay: ".24s" }}>
          The link may be old, or the page may have moved.
          Everything you need is still one tap away.
        </p>

        <form
          className="search-lg anim"
          style={{ animationDelay: ".3s" }}
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            navigate(q ? `/search?q=${encodeURIComponent(String(q))}` : "/search");
          }}
        >
          <IconSearch className="search-lg__icon" />
          <input type="search" name="q" placeholder="Search the guide…" aria-label="Search the guide" />
          <button className="search-lg__submit" type="submit" aria-label="Search">
            <IconArrowRight />
          </button>
        </form>

        <div className="chip-row anim" style={{ animationDelay: ".36s" }}>
          {CHIPS.map((chip) => (
            <Link key={chip.label} to={chip.to} className="chip chip--tint">{chip.label}</Link>
          ))}
        </div>

        <div className="nf__ctas anim" style={{ animationDelay: ".42s" }}>
          <Link to="/" className="btn btn--primary btn--lg">← Back to home</Link>
          <Link to="/encounter" className="btn btn--soft btn--lg">Open encounter mode</Link>
        </div>
      </div>
    </section>
  );
}
