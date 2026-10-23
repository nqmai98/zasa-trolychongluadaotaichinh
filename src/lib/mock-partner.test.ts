import { describe, expect, it } from "bun:test";
import { DEMO_ELDERS, LOCAL_ELDER_CODE, isKnownCode, normalizeCode } from "./mock-family";
import { PARTNER_STATS, buildEsgCsv, formatVndCompact } from "./mock-partner";

describe("Family connection codes", () => {
  it("accepts loosely typed codes and rejects malformed ones", () => {
    expect(normalizeCode("zs 1357")).toBe("ZS-1357");
    expect(normalizeCode("ZS1357")).toBe("ZS-1357");
    expect(normalizeCode("1357")).toBeNull();
    expect(normalizeCode("ZS-12")).toBeNull();
  });

  it("only knows the local elder and the demo elders", () => {
    expect(isKnownCode(LOCAL_ELDER_CODE)).toBe(true);
    for (const e of DEMO_ELDERS) expect(isKnownCode(e.code)).toBe(true);
    expect(isKnownCode("ZS-0000")).toBe(false);
  });
});

describe("Partner dashboard sample data", () => {
  it("labels the exported ESG report as sample data", () => {
    const csv = buildEsgCsv("bank", new Date(2026, 9, 23));
    expect(csv.split("\n")[0]).toContain("SỐ LIỆU MINH HỌA");
    expect(csv).toContain("dữ liệu mẫu");
  });

  it("keeps monthly totals consistent with the blocked count", () => {
    for (const s of Object.values(PARTNER_STATS)) {
      expect(s.monthly.reduce((sum, m) => sum + m.cases, 0)).toBe(s.blocked);
      expect(s.scamTypes.reduce((sum, t) => sum + t.cases, 0)).toBe(s.blocked);
    }
  });

  it("formats large VND amounts compactly", () => {
    expect(formatVndCompact(38_640_000_000)).toBe("38,6 tỷ");
  });
});
