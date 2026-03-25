import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimited = await checkRateLimit("forgotPassword");
    if (rateLimited) return rateLimited;
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.password) {
      const token = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(email, token, user.name);
    }

    return NextResponse.json({
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
