"use server";

import { auth } from "@/auth";
import { updateItem as updateItemQuery } from "@/lib/db/items";
import { updateItemSchema } from "@/lib/validations/items";

export type { UpdateItemInput } from "@/lib/validations/items";

export async function updateItem(
  itemId: string,
  data: unknown
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  const parsed = updateItemSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // Normalize empty URL string to null
    const normalizedData = {
      ...parsed.data,
      url: parsed.data.url || null,
    };

    const item = await updateItemQuery(
      itemId,
      session.user.id,
      normalizedData
    );
    return { success: true as const, data: item };
  } catch {
    return { success: false as const, error: "Failed to update item" };
  }
}
