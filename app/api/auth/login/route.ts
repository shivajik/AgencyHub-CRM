import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await login(email, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const cookieStore = cookies();
    cookieStore.set("auth_token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ user: result.user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
