import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimited = await checkRateLimit("register");
    if (rateLimited) return rateLimited;
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const requireVerification =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: requireVerification ? null : new Date(),
      },
    });

    if (requireVerification) {
      const token = await generateVerificationToken(email);
      await sendVerificationEmail(email, token, name);
    }

    return NextResponse.json(
      {
        message: requireVerification
          ? "Check your email to verify your account."
          : "Account created.",
        userId: user.id,
        requireVerification,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
