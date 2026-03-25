import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfile, getProfileStats } from "@/lib/db/profile";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [profile, stats] = await Promise.all([
    getUserProfile(session.user.id),
    getProfileStats(session.user.id),
  ]);

  if (!profile) {
    redirect("/sign-in");
  }

  const hasPassword = !!profile.password;
  const isOAuthUser = profile.accounts.some((a) => a.provider !== "credentials");

  return (
    <ProfileClient
      user={{
        name: profile.name,
        email: profile.email,
        image: profile.image,
        createdAt: profile.createdAt.toISOString(),
        hasPassword,
        isOAuthUser,
      }}
      stats={stats}
    />
  );
}
