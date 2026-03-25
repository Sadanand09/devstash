import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteUserAccount } from "@/lib/db/profile";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteUserAccount(session.user.id);

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
