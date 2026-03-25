import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { verifyPasswordResetToken } from "@/lib/tokens";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimited = await checkRateLimit("resetPassword");
    if (rateLimited) return rateLimited;
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    const result = await verifyPasswordResetToken(token);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: result.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
