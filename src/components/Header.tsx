"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();

  useEffect(() => {
    // If admin allowlist is provided via NEXT_PUBLIC_ADMIN_EMAILS, enforce it client-side
    try {
      const allowlist = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
      const email = session?.user?.email;
      if (session && allowlist.length > 0) {
        if (!email || !allowlist.includes(email)) {
          // not allowed — sign out and notify
          // small delay to allow NextAuth to finish any init
          setTimeout(() => {
            signOut();
            // eslint-disable-next-line no-alert
            alert("You are not authorized to sign in to this admin site.");
          }, 100);
        }
      }
    } catch (err) {
      // ignore
      // console.error(err);
    }
  }, [session]);

  return (
    <header className="border-b py-4">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Ashish Kumar Kadasi
        </Link>

        <nav className="flex gap-4 text-sm items-center">
          <Link href="/about">About</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#contact">Contact</Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
          {session ? (
            <>
              <span className="text-sm">{session.user?.email}</span>
              <button onClick={() => signOut()} className="ml-2 text-sm">Sign out</button>
            </>
          ) : (
            <button onClick={() => signIn()} className="ml-2 text-sm">Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}
