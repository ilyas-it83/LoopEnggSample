import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Drivewise Car Rental",
    template: "%s | Drivewise",
  },
  description: "A deterministic car rental demo built with Next.js, TDD, and BDD.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
