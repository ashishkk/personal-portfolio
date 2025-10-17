import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions as unknown as NextAuthOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allow = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(s => s.trim()).filter(Boolean);
    if (allow.length > 0 && !allow.includes(session.user?.email ?? "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const visitors = await prisma.visitor.findMany({ orderBy: { createdAt: "desc" } });
    const rows = ["firstName,lastName,email,phone,company,createdAt", ...visitors.map(v => `${v.firstName},${v.lastName},${v.email},${v.phone ?? ''},${v.company ?? ''},${v.createdAt.toISOString()}`)];
    const csv = rows.join("\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=visitors.csv" } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
