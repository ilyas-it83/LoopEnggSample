import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content-wrap">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>That road does not exist</h1>
        <p>The page or mock record could not be found.</p>
        <Link className="button button-primary" href="/">Return home</Link>
      </div>
    </div>
  );
}

