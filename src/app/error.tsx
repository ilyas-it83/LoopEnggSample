"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="content-wrap">
      <div className="empty-state">
        <p className="eyebrow">Recoverable error</p>
        <h1>The demo took a wrong turn</h1>
        <p>Retry the current route or reset the active behavior in Demo controls.</p>
        <button className="button button-primary" type="button" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
