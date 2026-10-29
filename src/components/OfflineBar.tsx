import { Link } from "react-router-dom";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { RELEASE_LABEL } from "../lib/release";

/**
 * Site-wide offline notice. It names the release being read and points at the
 * About explainer. It deliberately does not claim the copy was saved, because a
 * failed or incomplete install can still leave the browser showing cached assets.
 */
export default function OfflineBar() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="offline-bar" role="status" aria-live="polite">
      <div className="container offline-bar__inner">
        <span className="offline-bar__label">Offline</span>
        <span className="offline-bar__text">
          You are reading the release built {RELEASE_LABEL}. Content may have changed since it was last checked.
        </span>
        <Link className="offline-bar__link" to="/about#offline">What is saved →</Link>
      </div>
    </div>
  );
}
