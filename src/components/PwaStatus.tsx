import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * PWA update and install toasts. Rendered only in production because the
 * service worker is not active during `npm run dev`.
 */
export default function PwaStatus() {
  const isProd = import.meta.env.PROD && "serviceWorker" in navigator;
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.debug("[PWA] registered", r);
    },
    onRegisterError(e) {
      // eslint-disable-next-line no-console
      console.error("[PWA] registration failed", e);
    },
  });

  const [showNewRelease, setShowNewRelease] = useState(false);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    if (!isProd) return;
    if (needRefresh[0]) setShowNewRelease(true);
  }, [needRefresh, isProd]);

  useEffect(() => {
    if (!isProd) return;
    if (offlineReady[0]) {
      setShowReady(true);
      const t = setTimeout(() => setShowReady(false), 3000);
      return () => clearTimeout(t);
    }
  }, [offlineReady, isProd]);

  if (!isProd || (!showNewRelease && !showReady)) return null;

  return (
    <>
      {showReady && (
        <div className="pwa-toast pwa-toast--ready" role="status" aria-live="polite">
          <div className="container pwa-toast__inner">
            <span className="pwa-toast__label">Saved for offline</span>
            <span className="pwa-toast__text">
              This release is available offline.
            </span>
          </div>
        </div>
      )}
      {showNewRelease && (
        <div className="pwa-toast pwa-toast--update" role="status" aria-live="polite">
          <div className="container pwa-toast__inner">
            <span className="pwa-toast__label">New release ready</span>
            <span className="pwa-toast__text">
              A newer release is available.
            </span>
            <div className="pwa-toast__actions">
              <button
                className="btn btn--primary btn--sm"
                onClick={() => updateServiceWorker(true)}
              >
                Refresh
              </button>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setShowNewRelease(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
