"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/storage";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const update = () => setFavoriteCount(getFavorites().length);
    update();
    window.addEventListener("drivewise-storage", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("drivewise-storage", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <div className="demo-banner">
        Demo experience · fictional data only · do not enter real personal or payment information
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Drivewise home">
          <span className="brand-mark">D</span>
          <span>Drivewise</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/search">Find a car</Link>
          <Link href="/manage-booking">Manage booking</Link>
          <Link href="/favorites">Favorites {favoriteCount > 0 && <span className="count">{favoriteCount}</span>}</Link>
          <Link href="/help">Help</Link>
        </nav>
        <Link className="button button-small button-secondary account-button" href="/account">
          Demo account
        </Link>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">D</span>
            <span>Drivewise</span>
          </Link>
          <p>A deterministic car rental demo built with Next.js, TDD, and BDD.</p>
        </div>
        <div className="footer-links">
          <Link href="/help">Policies & help</Link>
          <Link href="/admin">Demo administration</Link>
          <Link href="/demo-controls">Scenario controls</Link>
          <Link href="/help">Requirements summary</Link>
        </div>
      </footer>
    </>
  );
}
