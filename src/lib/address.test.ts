import { describe, expect, it } from "bun:test";
import { addressOf } from "./zasa-store";

describe("ZASA addresses the user as ông/bà", () => {
  it("follows the chosen form of address, not the name", () => {
    expect(addressOf({ name: "Bà Hồng", gender: "ong" }).title).toBe("Ông Hồng");
    expect(addressOf({ name: "Nguyễn Văn Nam", gender: "ong" }).title).toBe("Ông Nam");
    expect(addressOf({ name: "Nguyễn Thị Hồng", gender: "ba" }).title).toBe("Bà Hồng");
    expect(addressOf({ name: "  ", gender: "ba" }).title).toBe("Bà");
  });

  it("fills {you}/{You} placeholders in prepared content", () => {
    expect(addressOf({ name: "Nam", gender: "ong" }).addr("{You} nhớ giữ OTP của {you}.")).toBe(
      "Ông nhớ giữ OTP của ông.",
    );
  });
});

describe("ZASA addresses family members as anh/chị", () => {
  it("uses the family member's chosen form", () => {
    expect(addressOf({ name: "Lê Văn Minh", gender: "anh" }).title).toBe("Anh Minh");
    expect(addressOf({ name: "Chị Lan", gender: "chi" }).title).toBe("Chị Lan");
  });
});
