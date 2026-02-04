import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, insertProjectSchema } from "@/lib/schema";
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
      return NextResponse.json({ projects: [] });
    }
    const projectList = await db.select().from(projects).where(eq(projects.clientId, user.clientId));
    return NextResponse.json({ projects: projectList });
  }

  const projectList = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return NextResponse.json({ projects: projectList });
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
    const validatedData = insertProjectSchema.parse(body);
    const [project] = await db.insert(projects).values(validatedData).returning();
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
