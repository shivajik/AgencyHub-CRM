import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!["admin", "manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userList = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    avatar: users.avatar,
    status: users.status,
    createdAt: users.createdAt,
  }).from(users);

  return NextResponse.json({ users: userList });
}
