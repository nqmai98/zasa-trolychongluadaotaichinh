import { describe, expect, it } from "bun:test";
import { analyzeMessage, checkPhone, checkQr, checkTransfer } from "./mock-risk";

describe("ZASA demo risk rules", () => {
  it("flags OTP and fake police wording in messages", () => {
    expect(analyzeMessage("Công an yêu cầu đọc mã OTP").level).toBe("danger");
  });

  it("marks the sample reported phone as high risk", () => {
    expect(checkPhone("0900 000 001").level).toBe("danger");
  });

  it("raises risk only when a transfer amount is over 20 million", () => {
    expect(checkTransfer({ account: "555123", amount: 20_000_001, reason: "Mua đồ" }).level).toBe("danger");
    expect(checkTransfer({ account: "555123", amount: 20_000_000, reason: "Mua đồ" }).level).toBe("safe");
  });

  it("flags the sample blacklisted account and scam-related transfer reasons", () => {
    expect(checkTransfer({ account: "999888777666", amount: 1_000_000, reason: "Mua đồ" }).level).toBe("danger");
    expect(checkTransfer({ account: "555123", amount: 1_000_000, reason: "Đầu tư" }).level).toBe("danger");
  });

  it("never labels an unverified QR code as safe", () => {
    expect(checkQr().level).toBe("warn");
  });
});