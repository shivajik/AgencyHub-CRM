import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients, insertClientSchema } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  if (user.role === "client") {
    if (!user.clientId) {
      return NextResponse.json({ clients: [] });
    }
    const clientList = await db.select().from(clients).where(eq(clients.id, user.clientId));
    return NextResponse.json({ clients: clientList });
  }

  const clientList = await db.select().from(clients).orderBy(desc(clients.createdAt));
  return NextResponse.json({ clients: clientList });
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
    const validatedData = insertClientSchema.parse(body);
    const [client] = await db.insert(clients).values(validatedData).returning();
    return NextResponse.json({ client });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
