import { describe, expect, it } from "bun:test";
import { CHECK_COPY, CHECK_TYPES, evaluateCheck, parseResultSearch } from "./check-result";

describe("ZASA result screen", () => {
  it("reads every check type from the URL and ignores unknown values", () => {
    expect(parseResultSearch({ type: "transfer", amount: "25000000" })).toMatchObject({
      type: "transfer",
      amount: 25_000_000,
    });
    expect(parseResultSearch({ type: "hack", amount: "-1" }).type).toBeUndefined();
  });

  it("evaluates each check type with its own mock rule", () => {
    expect(evaluateCheck({ type: "msg", text: "Công an yêu cầu đọc mã OTP" }).level).toBe("danger");
    expect(evaluateCheck({ type: "phone", phone: "0900000001" }).level).toBe("danger");
    expect(
      evaluateCheck({ type: "transfer", account: "555123", amount: 1_000_000, reason: "Đầu tư" })
        .level,
    ).toBe("danger");
    expect(evaluateCheck({ type: "qr" }).level).toBe("warn");
  });

  it("treats an image-only message as needing caution", () => {
    expect(evaluateCheck({ type: "msg", img: 1 }).level).toBe("warn");
  });

  it("has next steps for every check type and every risk level", () => {
    for (const type of CHECK_TYPES)
      for (const level of ["danger", "warn", "safe"] as const)
        expect(CHECK_COPY[type].steps[level]("bà").length).toBeGreaterThan(0);
  });
});
