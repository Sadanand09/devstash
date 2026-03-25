import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const rateLimited = await checkRateLimit("resendVerification", email);
    if (rateLimited) return rateLimited;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) {
      // Don't reveal whether the user exists
      return NextResponse.json({
        message: "If that email exists, a verification link has been sent.",
      });
    }

    const token = await generateVerificationToken(email);
    await sendVerificationEmail(email, token, user.name);

    return NextResponse.json({
      message: "If that email exists, a verification link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
