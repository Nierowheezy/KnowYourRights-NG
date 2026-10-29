import "../styles/help.css";
import { PageHero, AdSlot, AdAnchor, Reveal } from "../components/ui";
import { isSupportVerified, supportChannels } from "../lib/content";
import type { SupportChannel } from "../lib/schema";

const EMERGENCY_TILES = [
  { num: "112", tel: "112", label: "National emergency — police, fire, medical. Free from any network.", red: true },
  { num: "122", tel: "122", label: "FRSC rescue line — crashes and highway emergencies.", red: false },
  { num: "199", tel: "08022202158", label: "NEMA — disasters and mass-casualty incidents.", red: false },
];

const WARN_BADGE = {
  background: "var(--warning-tint)",
  borderColor: "var(--warn-line)",
  color: "var(--warning)",
};

function verification(channel: SupportChannel): { label: string; ok: boolean } {
  if (!isSupportVerified(channel)) return { label: "Verification pending", ok: false };
  const d = new Date(`${channel.lastVerified}T00:00:00`);
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return { label: `✓ Checked ${month} ${d.getFullYear()}`, ok: true };
}

function ChannelCard({ channel, delay }: { channel: SupportChannel; delay?: number }) {
  const check = verification(channel);
  return (
    <div className="card reveal" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      <div className="card__icon">{channel.icon}</div>
      <h3 className="card__title">{channel.name}</h3>
      <p className="card__desc">{channel.description ?? channel.agencyOrOrg}</p>
      <div className="issue-tags">
        {channel.issuesHandled.map((issue) => (
          <span key={issue} className="issue-tag">{issue}</span>
        ))}
      </div>
      <div className="contact-line">{channel.contact}</div>
      {!check.ok && channel.limitations && (
        <p className="muted" style={{ fontSize: "0.76rem", margin: "0 0 10px" }}>{channel.limitations}</p>
      )}
      <div className="card__foot">
        {check.ok ? (
          <span className="badge-lime">{check.label}</span>
        ) : (
          <span className="badge-gray" style={WARN_BADGE}>{check.label}</span>
        )}
        <span className="card__meta">{channel.coverageNote ?? channel.agencyOrOrg}</span>
      </div>
    </div>
  );
}

export default function Help() {
  const complaints = supportChannels.filter((c) => c.type === "complaints");
  const legal = supportChannels.filter((c) => c.type === "legal-aid" || c.type === "civil-society");

  return (
    <>
      {/* Page hero */}
      <PageHero
        title="Get help. The verified kind."
        lede="Official complaint channels and legal support for enforcement encounters. Each entry shows its source and the date it was last checked; entries still awaiting re-verification are labelled."
        ledeStyle={{ maxWidth: 600, marginTop: 14, animationDelay: ".08s" }}
      />

      {/* Emergency band */}
      <section className="section--tight" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="emergency-band">
            {EMERGENCY_TILES.map((tile) => (
              <a
                key={tile.num}
                href={`tel:${tile.tel}`}
                className={`emergency-tile${tile.red ? " emergency-tile--red" : ""} reveal`}
                style={tile.red ? undefined : { transitionDelay: tile.num === "122" ? ".06s" : ".12s" }}
              >
                <div className="emergency-tile__num">{tile.num}</div>
                <div className="emergency-tile__label">{tile.label}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Complaints + legal aid */}
      <section className="section--tight">
        <div className="container">
          <Reveal className="channel-group">
            <h2>Complaint channels <span className="count">{complaints.length} listed</span></h2>
            <p className="sub">When your rights were breached and you want it on record.</p>
            <div className="card-grid card-grid--3">
              {complaints.map((channel, i) => (
                <ChannelCard key={channel.id} channel={channel} delay={(i % 3) * 0.05} />
              ))}
            </div>
          </Reveal>

          <Reveal className="channel-group">
            <h2>Free legal support <span className="count">{legal.length} listed</span></h2>
            <p className="sub">When you need a lawyer, not just a complaint.</p>
            <div className="card-grid card-grid--3">
              {legal.map((channel, i) => (
                <ChannelCard key={channel.id} channel={channel} delay={(i % 3) * 0.05} />
              ))}
            </div>
          </Reveal>

          {/* MPU ad (300 × 250) */}
          <AdSlot variant="square" size="300 × 250 / MPU" reveal style={{ margin: "8px auto 44px", maxWidth: 340 }} />

          {/* Note */}
          <div className="callout callout--tint reveal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 9v4M10 6.6v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span><strong>We show the date each channel was last checked, and label any entry still awaiting re-verification.</strong> Numbers change; if one doesn't work, <a href="#feedback" style={{ color: "var(--forest)", fontWeight: 600 }}>flag it</a> and we'll re-check. This directory is information, not a referral or endorsement.</span>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <AdSlot variant="leaderboard" size="970 × 90 / responsive" reveal />
        </div>
      </section>

      {/* Dismissible mobile anchor ad (320 × 100) */}
      <AdAnchor>
        <AdSlot variant="large-mobile" label="Ad" hint="320 × 100 — large mobile banner" />
      </AdAnchor>
    </>
  );
}
