import { describe, it, expect } from "vitest";
import { updateItemSchema, createItemSchema } from "@/lib/validations/items";

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

const validCreate = {
  typeName: "snippet" as const,
  title: "My Snippet",
  description: null,
  content: "console.log('hi')",
  url: null,
  language: "javascript",
  tags: [],
};

describe("createItemSchema", () => {
  it("accepts valid snippet input", () => {
    const result = createItemSchema.safeParse(validCreate);
    expect(result.success).toBe(true);
    expect(result.data?.typeName).toBe("snippet");
  });

  it("accepts all valid type names", () => {
    for (const typeName of ["snippet", "prompt", "command", "note", "link"]) {
      const data = { ...validCreate, typeName, url: typeName === "link" ? "https://example.com" : null };
      const result = createItemSchema.safeParse(data);
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid type name", () => {
    const result = createItemSchema.safeParse({ ...validCreate, typeName: "invalid" });
    expect(result.success).toBe(false);
  });

  it("requires title", () => {
    const result = createItemSchema.safeParse({ ...validCreate, title: "   " });
    expect(result.success).toBe(false);
  });

  it("requires URL for link type", () => {
    const result = createItemSchema.safeParse({
      ...validCreate,
      typeName: "link",
      url: null,
    });
    expect(result.success).toBe(false);
  });

  it("accepts link type with valid URL", () => {
    const result = createItemSchema.safeParse({
      ...validCreate,
      typeName: "link",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("does not require URL for non-link types", () => {
    const result = createItemSchema.safeParse({
      ...validCreate,
      typeName: "note",
      url: null,
    });
    expect(result.success).toBe(true);
  });
});
