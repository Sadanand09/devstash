"use server";

import { auth } from "@/auth";
import { updateItem as updateItemQuery, deleteItem as deleteItemQuery, createItem as createItemQuery } from "@/lib/db/items";
import { updateItemSchema, createItemSchema } from "@/lib/validations/items";

export type { UpdateItemInput, CreateItemInput } from "@/lib/validations/items";

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

export async function createItem(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  const parsed = createItemSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const normalizedData = {
      ...parsed.data,
      url: parsed.data.url || null,
    };

    const item = await createItemQuery(session.user.id, normalizedData);
    return { success: true as const, data: item };
  } catch {
    return { success: false as const, error: "Failed to create item" };
  }
}

export async function deleteItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    await deleteItemQuery(itemId, session.user.id);
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to delete item" };
  }
}
