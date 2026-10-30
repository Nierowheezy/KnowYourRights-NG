import "../styles/help.css";
import { PageHero, AdSlot, AdAnchor, Reveal, Pagination } from "../components/ui";
import { usePagination } from "../hooks/usePagination";
import { isSupportVerified, supportChannels } from "../lib/content";
import type { SupportChannel, SupportContact } from "../lib/schema";

/** Short check date, e.g. "Oct 2026", or null when the entry is not verified. */
function checkLabel(channel: SupportChannel): string | null {
  if (!channel.contactVerified || !channel.lastVerified) return null;
  const d = new Date(`${channel.lastVerified}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${month} ${d.getFullYear()}`;
}

function contactHref(contact: SupportContact): string {
  if (contact.kind === "phone") {
    const dialable = contact.value.replace(/[^\d+]/g, "").replace(/^\+?2340/, "+234");
    return `tel:${dialable}`;
  }
  if (contact.kind === "email") return `mailto:${contact.value}`;
  return contact.value;
}

function ChannelCard({ channel, delay }: { channel: SupportChannel; delay?: number }) {
  const checked = checkLabel(channel);
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
      <div className="contact-line">
        {channel.contacts.map((contact, i) => (
          <span key={`${contact.kind}-${contact.value}`}>
            {i > 0 && <span className="contact-line__sep" aria-hidden="true"> · </span>}
            <a href={contactHref(contact)}>{contact.value}</a>
          </span>
        ))}
      </div>
      {channel.limitations && (
        <p className="muted" style={{ fontSize: "0.76rem", margin: "0 0 10px" }}>{channel.limitations}</p>
      )}
      <div className="card__foot">
        <span className="badge-lime">{checked ? `✓ Checked ${checked}` : "Check date missing"}</span>
        <span className="card__meta">{channel.coverageNote ?? channel.agencyOrOrg}</span>
      </div>
      {channel.url && (
        <a className="card__source" href={channel.url} target="_blank" rel="noopener noreferrer">
          Source: {channel.verificationSource ?? channel.agencyOrOrg}
        </a>
      )}
    </div>
  );
}

const PAGE_SIZE = 9;

export default function Help() {
  const published = supportChannels.filter((c) => isSupportVerified(c));
  const emergencies = published.filter((c) => c.type === "emergency");
  const complaints = published.filter((c) => c.type === "complaints");
  const legal = published.filter((c) => c.type === "legal-aid" || c.type === "civil-society");

  const complaintsResetKey = `complaints-${complaints.length}`;
  const {
    page: complaintsPage,
    totalPages: complaintsTotalPages,
    startIndex: complaintsStart,
    endIndex: complaintsEnd,
    setPage: setComplaintsPage,
  } = usePagination({ totalItems: complaints.length, pageSize: PAGE_SIZE, resetKey: complaintsResetKey });
  const pagedComplaints = complaints.slice(complaintsStart, complaintsEnd);

  const legalResetKey = `legal-${legal.length}`;
  const {
    page: legalPage,
    totalPages: legalTotalPages,
    startIndex: legalStart,
    endIndex: legalEnd,
    setPage: setLegalPage,
  } = usePagination({ totalItems: legal.length, pageSize: PAGE_SIZE, resetKey: legalResetKey });
  const pagedLegal = legal.slice(legalStart, legalEnd);

  return (
    <>
      {/* Page hero */}
      <PageHero
        title="Get help. The verified kind."
        lede="Official complaint channels and legal support for enforcement encounters. Every entry was checked against the organisation's own page, and shows that source and the date it was last checked."
        ledeStyle={{ maxWidth: 600, marginTop: 14, animationDelay: ".08s" }}
      />

      {/* Emergency band */}
      {emergencies.length > 0 && (
        <section className="section--tight" style={{ paddingTop: 8 }}>
          <div className="container">
            <div className="emergency-band">
              {emergencies.map((channel, i) => {
                const phone = channel.contacts.find((c) => c.kind === "phone");
                const checked = checkLabel(channel);
                return (
                  <div
                    key={channel.id}
                    className={`emergency-tile${i === 0 ? " emergency-tile--red" : ""} reveal`}
                    style={i ? { transitionDelay: `${i * 0.06}s` } : undefined}
                  >
                    <a className="emergency-tile__num" href={phone ? contactHref(phone) : undefined}>
                      {channel.name}
                    </a>
                    <div className="emergency-tile__label">{channel.description ?? channel.agencyOrOrg}</div>
                    <div className="emergency-tile__source">
                      {checked ? <span>Checked {checked}</span> : <span>Check date missing</span>}
                      {channel.url && (
                        <a href={channel.url} target="_blank" rel="noopener noreferrer">
                          {channel.verificationSource ?? channel.agencyOrOrg}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Complaints + legal aid */}
      <section className="section--tight">
        <div className="container">
          {complaints.length > 0 ? (
            <Reveal className="channel-group">
              <h2>Complaint channels <span className="count">{complaints.length} listed</span></h2>
              <p className="sub">When your rights were breached and you want it on record.</p>
              <div className="card-grid card-grid--3">
                {pagedComplaints.map((channel, i) => (
                  <ChannelCard key={channel.id} channel={channel} delay={(i % 3) * 0.05} />
                ))}
              </div>
              {complaintsTotalPages > 1 && (
                <Pagination
                  page={complaintsPage}
                  totalPages={complaintsTotalPages}
                  onChange={setComplaintsPage}
                  totalItems={complaints.length}
                  startIndex={complaintsStart}
                  endIndex={complaintsEnd}
                  itemLabel="channels"
                  ariaLabel="Complaint channels pagination"
                />
              )}
            </Reveal>
          ) : (
            <Reveal className="channel-group">
              <p className="sub">No complaint channel has passed checking yet. Check back after the next review.</p>
            </Reveal>
          )}

          {legal.length > 0 ? (
            <Reveal className="channel-group">
              <h2>Free legal support <span className="count">{legal.length} listed</span></h2>
              <p className="sub">When you need a lawyer, not just a complaint.</p>
              <div className="card-grid card-grid--3">
                {pagedLegal.map((channel, i) => (
                  <ChannelCard key={channel.id} channel={channel} delay={(i % 3) * 0.05} />
                ))}
              </div>
              {legalTotalPages > 1 && (
                <Pagination
                  page={legalPage}
                  totalPages={legalTotalPages}
                  onChange={setLegalPage}
                  totalItems={legal.length}
                  startIndex={legalStart}
                  endIndex={legalEnd}
                  itemLabel="channels"
                  ariaLabel="Legal support channels pagination"
                />
              )}
            </Reveal>
          ) : (
            <Reveal className="channel-group">
              <p className="sub">No free legal support channel has passed checking yet. Check back after the next review.</p>
            </Reveal>
          )}

          {/* MPU ad (300 × 250) */}
          <AdSlot variant="square" size="300 × 250 / MPU" reveal style={{ margin: "8px auto 44px", maxWidth: 340 }} />

          {/* Note */}
          <div className="callout callout--tint reveal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 9v4M10 6.6v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span><strong>Every listing shows the date it was last checked against the organisation's own page.</strong> Numbers change; if one doesn't work, treat the entry as unverified until the next review. This directory is information, not a referral or endorsement.</span>
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
