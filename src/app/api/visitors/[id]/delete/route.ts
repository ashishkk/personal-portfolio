import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request, context: unknown) {
  try {
    // require a valid session
    const session = await getServerSession(authOptions as unknown as NextAuthOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // optional allowlist: ADMIN_EMAILS (comma separated) or ADMIN_EMAIL
    const allow = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(s => s.trim()).filter(Boolean);
    if (allow.length > 0 && !allow.includes(session.user?.email ?? "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // context.params can be a Promise depending on runtime; normalize safely
    const paramsCandidate = (context as { params?: unknown })?.params;
    let params: { id?: string } | undefined;
    if (paramsCandidate instanceof Promise) {
      params = (await paramsCandidate) as { id?: string };
    } else {
      params = paramsCandidate as { id?: string } | undefined;
    }
    const id = Number(params?.id);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await prisma.visitor.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
