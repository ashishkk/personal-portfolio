import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import type { NextAuthOptions } from "next-auth";
import Link from "next/link";
import VisitorsTable from "../../components/VisitorsTable";
import { ToastsProvider } from "../../components/Toasts";

const prisma = new PrismaClient();

export default async function VisitorsPage() {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);
  if (!session) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>Please sign in to view this page.</p>
        <p className="mt-4"><Link href="/">← Back home</Link></p>
      </main>
    );
  }
  // Server-side admin allowlist (ADMIN_EMAILS comma-separated or ADMIN_EMAIL)
  const allow = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(s => s.trim()).filter(Boolean);
  if (allow.length > 0 && !allow.includes(session.user?.email ?? "")) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">Forbidden</h1>
        <p>Your account is not authorized to view this page.</p>
      </main>
    );
  }

  const visitors = await prisma.visitor.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold">Visitors</h1>
      <p className="text-sm text-muted-foreground">Signed in as {session.user?.email}</p>
      <ToastsProvider>
        <VisitorsTable initial={visitors.map((v) => ({
          ...v,
          createdAt: v.createdAt.toISOString(),
        }))} />
      </ToastsProvider>
    </main>
  );
}
