import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "agencyflow-secret-key-change-in-production");

export async function createToken(payload: { userId: string; role: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function login(email: string, passwordInput: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return { error: "Invalid credentials" };
  
  const valid = await bcrypt.compare(passwordInput, user.password);
  if (!valid) return { error: "Invalid credentials" };
  
  const token = await createToken({ userId: user.id, role: user.role });
  const { password, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}
