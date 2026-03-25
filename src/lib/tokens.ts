import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

const VERIFICATION_EXPIRY_HOURS = 24;
const RESET_EXPIRY_HOURS = 1;

export async function generateVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return { error: "Invalid verification link." };
  if (record.expires < new Date()) return { error: "Verification link has expired." };

  // Mark user as verified
  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // Clean up token
  await prisma.verificationToken.delete({
    where: { token },
  });

  return { success: true, email: record.identifier };
}

export async function generatePasswordResetToken(email: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any existing reset tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return { error: "Invalid or expired reset link." };
  if (record.expires < new Date()) return { error: "Reset link has expired." };

  // Clean up token
  await prisma.verificationToken.delete({
    where: { token },
  });

  return { success: true, email: record.identifier };
}
