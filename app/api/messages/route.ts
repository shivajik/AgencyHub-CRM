import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages, insertMessageSchema } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";
import { eq, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!["admin", "manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");

  const messageList = channel
    ? await db.select().from(messages).where(eq(messages.channel, channel)).orderBy(asc(messages.createdAt))
    : await db.select().from(messages).orderBy(asc(messages.createdAt));

  return NextResponse.json({ messages: messageList });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!["admin", "manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = insertMessageSchema.parse({
      ...body,
      senderId: auth.user.id,
    });
    const [message] = await db.insert(messages).values(validatedData).returning();
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
