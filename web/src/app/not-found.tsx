"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="text-center max-w-lg">
        <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 text-foreground/60 mb-4" aria-hidden>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Head */}
            <circle cx="32" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Shrugging arms — palms up, who knows */}
            <path d="M26 28 L18 16 L12 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 28 L46 16 L52 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Body */}
            <line x1="32" y1="28" x2="32" y2="48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Legs - casual stance */}
            <line x1="32" y1="48" x2="24" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="48" x2="40" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Dot eyes looking at you */}
            <circle cx="28" cy="16" r="1.5" fill="currentColor" />
            <circle cx="36" cy="16" r="1.5" fill="currentColor" />
            {/* Wry mouth */}
            <path d="M26 22 Q32 24 38 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground/90 select-none">
          404
        </p>
        <h1 className="mt-4 text-xl sm:text-2xl font-semibold">
          Well, this is awkward.
        </h1>
        <p className="mt-3 text-foreground/70">
          The page you&apos;re looking for has left the building. Maybe it joined
          a band. Maybe it&apos;s in the Bahamas. We don&apos;t keep in touch.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Take me home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-lg border border-foreground/30 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            Actually, go back
          </button>
        </div>
        <p className="mt-10 text-sm text-foreground/50">
          Error code: 404 — &ldquo;Not Found&rdquo; (we asked the server; it
          shrugged)
        </p>
      </div>
    </div>
  );
}
