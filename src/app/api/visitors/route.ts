import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Rate limiter parameters
const LIMIT_WINDOW = 60; // seconds
const LIMIT_COUNT = 10;

// In-memory fallback store
const memoryStore: Record<string, number[]> = {};

interface RedisLike {
  incr(key: string): Promise<number> | Promise<string>;
  expire(key: string, seconds: number): Promise<number> | Promise<string>;
  disconnect?: () => void | Promise<void>;
}

async function incrRedis(redis: RedisLike, key: string, window: number) {
  // Using Redis INCR with EXPIRE to implement a sliding window counter approximation
  const val = await redis.incr(key);
  if (Number(val) === 1) {
    await redis.expire(key, window);
  }
  return Number(val);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";

    // Try Redis if REDIS_URL is present
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      // lazy-import ioredis to avoid loading when not configured
      const mod = await import("ioredis");
      const IORedis = (mod && (mod.default ?? mod)) as unknown as { new (s: string): RedisLike };
      const redis = new IORedis(redisUrl);
      try {
        const key = `rate:visitors:${ip}`;
        const cnt = await incrRedis(redis, key, LIMIT_WINDOW);
        if (cnt > LIMIT_COUNT) {
          if (typeof redis.disconnect === "function") await redis.disconnect();
          return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }
      } finally {
        if (typeof redis.disconnect === "function") await redis.disconnect();
      }
    } else {
      // In-memory fallback
      const now = Date.now();
      memoryStore[ip] = (memoryStore[ip] || []).filter((t) => t > now - LIMIT_WINDOW * 1000);
      if (memoryStore[ip].length >= LIMIT_COUNT) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
      memoryStore[ip].push(now);
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, company } = body as Record<string, unknown>;
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Basic de-dup by email
    const existing = await prisma.visitor.findFirst({ where: { email: String(email) } });
    if (existing) {
      return NextResponse.json({ message: "Already submitted" }, { status: 200 });
    }

    const visitor = await prisma.visitor.create({
      data: { firstName: String(firstName), lastName: String(lastName), email: String(email), phone: (phone as string) || null, company: (company as string) || null },
    });

    return NextResponse.json({ visitor }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
