import { describe, it, expect } from "vitest";
import { updateItemSchema } from "@/lib/validations/items";

describe("updateItemSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = updateItemSchema.safeParse({
      title: "My Snippet",
      description: "A useful snippet",
      content: "console.log('hi')",
      url: null,
      language: "javascript",
      tags: ["react", "utils"],
    });
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("My Snippet");
  });

  it("trims title and rejects empty string", () => {
    const result = updateItemSchema.safeParse({
      title: "   ",
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [],
    });
    expect(result.success).toBe(false);
  });

  it("requires title field", () => {
    const result = updateItemSchema.safeParse({
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [],
    });
    expect(result.success).toBe(false);
  });

  it("allows null optional fields", () => {
    const result = updateItemSchema.safeParse({
      title: "Test",
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("validates URL format when provided", () => {
    const result = updateItemSchema.safeParse({
      title: "Link",
      description: null,
      content: null,
      url: "not-a-url",
      language: null,
      tags: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid URL", () => {
    const result = updateItemSchema.safeParse({
      title: "Link",
      description: null,
      content: null,
      url: "https://example.com",
      language: null,
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string URL (normalized to null later)", () => {
    const result = updateItemSchema.safeParse({
      title: "Link",
      description: null,
      content: null,
      url: "",
      language: null,
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("filters empty tag strings", () => {
    const result = updateItemSchema.safeParse({
      title: "Test",
      description: null,
      content: null,
      url: null,
      language: null,
      tags: ["valid", "  "],
    });
    // Empty-after-trim tag should fail min(1)
    expect(result.success).toBe(false);
  });

  it("trims tag names", () => {
    const result = updateItemSchema.safeParse({
      title: "Test",
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [" react ", " utils "],
    });
    expect(result.success).toBe(true);
    expect(result.data?.tags).toEqual(["react", "utils"]);
  });

  it("defaults tags to empty array when omitted", () => {
    const result = updateItemSchema.safeParse({
      title: "Test",
      description: null,
      content: null,
      url: null,
      language: null,
    });
    expect(result.success).toBe(true);
    expect(result.data?.tags).toEqual([]);
  });
});
