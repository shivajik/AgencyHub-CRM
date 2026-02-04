import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks, projects, insertTaskSchema } from "@/lib/schema";
import { requireAuth } from "@/lib/middleware";
import { desc, eq, inArray } from "drizzle-orm";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  if (user.role === "client") {
    if (!user.clientId) {
      return NextResponse.json({ tasks: [] });
    }
    const clientProjects = await db.select().from(projects).where(eq(projects.clientId, user.clientId));
    const projectIds = clientProjects.map(p => p.id);
    if (projectIds.length === 0) {
      return NextResponse.json({ tasks: [] });
    }
    const taskList = await db.select().from(tasks).where(inArray(tasks.projectId, projectIds));
    return NextResponse.json({ tasks: taskList });
  }

  const taskList = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  return NextResponse.json({ tasks: taskList });
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
    const validatedData = insertTaskSchema.parse(body);
    const [task] = await db.insert(tasks).values(validatedData).returning();
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
