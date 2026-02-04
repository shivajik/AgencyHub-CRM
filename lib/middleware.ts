import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }
  
  const payload = await verifyToken(token);
  if (!payload) {
    return { error: "Invalid token", status: 401 };
  }
  
  const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
  if (!user) {
    return { error: "User not found", status: 401 };
  }
  
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
}

export function requireRole(...allowedRoles: string[]) {
  return async () => {
    const result = await requireAuth();
    if ("error" in result) return result;
    
    if (!allowedRoles.includes(result.user.role)) {
      return { error: "Forbidden", status: 403 };
    }
    
    return result;
  };
}
