import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!["admin", "manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  const activityList = await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
  return NextResponse.json({ activities: activityList });
}
