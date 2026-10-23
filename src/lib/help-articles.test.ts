import { describe, expect, it } from "bun:test";
import { HELP_ARTICLES, HELP_CATEGORIES, searchHelp } from "./help-articles";

describe("ZASA help center", () => {
  it("finds articles without needing Vietnamese accents", () => {
    expect(searchHelp("co chu").map((a) => a.id)).toContain("text-size");
    expect(searchHelp("mã QR").map((a) => a.id)).toContain("check-qr");
  });

  it("returns nothing for unrelated words and everything for an empty query", () => {
    expect(searchHelp("xyzabc")).toHaveLength(0);
    expect(searchHelp("  ")).toHaveLength(HELP_ARTICLES.length);
  });

  it("files every article under a known category", () => {
    const ids = new Set(HELP_CATEGORIES.map((c) => c.id));
    for (const a of HELP_ARTICLES) expect(ids.has(a.category)).toBe(true);
  });
});

describe("Help articles per role", () => {
  it("shows family members only what applies to them", async () => {
    const { articlesFor } = await import("./help-articles");
    const family = articlesFor("family").map((a) => a.id);
    expect(family).toContain("f-add");
    expect(family).toContain("text-size");
    expect(family).not.toContain("check-msg");
    expect(articlesFor("elder").map((a) => a.id)).not.toContain("f-add");
  });
});
