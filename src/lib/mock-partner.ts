/**
 * Số liệu minh họa cho bảng điều khiển Đối tác (ngân hàng, bảo hiểm, nhà mạng).
 * Toàn bộ là dữ liệu giả cố định, không lấy từ hệ thống thật.
 */
export type PartnerType = "bank" | "insurance" | "telco";

export type PartnerStats = {
  label: string;
  blocked: number;
  protectedVnd: number;
  usersProtected: number;
  /** % cảnh báo mà người dùng làm theo (dừng giao dịch, không bấm link…) */
  followRate: number;
  scamTypes: { name: string; cases: number }[];
  monthly: { month: string; cases: number }[];
  skills: { label: string; before: number; after: number; unit: "%" | "điểm" }[];
};

const MONTHS = ["T5/2026", "T6/2026", "T7/2026", "T8/2026", "T9/2026", "T10/2026"];

export const PARTNER_STATS: Record<PartnerType, PartnerStats> = {
  bank: {
    label: "Ngân hàng",
    blocked: 12_480,
    protectedVnd: 38_640_000_000,
    usersProtected: 52_300,
    followRate: 87,
    scamTypes: [
      { name: "Giả danh ngân hàng, xin OTP", cases: 3_920 },
      { name: "Giả danh công an, toà án", cases: 2_870 },
      { name: "Chuyển tiền cho “người thân”", cases: 2_140 },
      { name: "Đầu tư, việc nhẹ lương cao", cases: 1_610 },
      { name: "Trúng thưởng, quà tặng", cases: 1_180 },
      { name: "Mã QR giả", cases: 760 },
    ],
    monthly: [1_420, 1_690, 1_950, 2_130, 2_480, 2_810].map((cases, i) => ({
      month: MONTHS[i] ?? "",
      cases,
    })),
    skills: [
      { label: "Điểm bài kiểm tra trung bình", before: 54, after: 82, unit: "điểm" },
      { label: "Nhận diện đúng tin nhắn lừa đảo", before: 47, after: 86, unit: "%" },
      { label: "Không đọc OTP cho người lạ", before: 61, after: 94, unit: "%" },
    ],
  },
  insurance: {
    label: "Bảo hiểm",
    blocked: 4_260,
    protectedVnd: 9_870_000_000,
    usersProtected: 18_900,
    followRate: 82,
    scamTypes: [
      { name: "Giả danh bảo hiểm, “hoàn phí”", cases: 1_480 },
      { name: "Giả danh bệnh viện, cấp cứu", cases: 940 },
      { name: "Đáo hạn hợp đồng giả", cases: 720 },
      { name: "Giả danh công an, toà án", cases: 560 },
      { name: "Trúng thưởng, quà tặng", cases: 330 },
      { name: "Mã QR giả", cases: 230 },
    ],
    monthly: [480, 560, 640, 710, 870, 1_000].map((cases, i) => ({
      month: MONTHS[i] ?? "",
      cases,
    })),
    skills: [
      { label: "Điểm bài kiểm tra trung bình", before: 51, after: 79, unit: "điểm" },
      { label: "Nhận diện đúng cuộc gọi giả danh", before: 42, after: 81, unit: "%" },
      { label: "Gọi xác minh trước khi chuyển tiền", before: 38, after: 77, unit: "%" },
    ],
  },
  telco: {
    label: "Nhà mạng",
    blocked: 21_750,
    protectedVnd: 27_310_000_000,
    usersProtected: 96_400,
    followRate: 84,
    scamTypes: [
      { name: "Cuộc gọi giả danh nhà mạng", cases: 6_210 },
      { name: "Tin nhắn link lạ", cases: 5_480 },
      { name: "Giả danh công an, toà án", cases: 3_960 },
      { name: "Đổi SIM, chiếm tài khoản", cases: 2_870 },
      { name: "Trúng thưởng, quà tặng", cases: 2_050 },
      { name: "Mã QR giả", cases: 1_180 },
    ],
    monthly: [2_640, 3_010, 3_420, 3_780, 4_250, 4_650].map((cases, i) => ({
      month: MONTHS[i] ?? "",
      cases,
    })),
    skills: [
      { label: "Điểm bài kiểm tra trung bình", before: 49, after: 80, unit: "điểm" },
      { label: "Không bấm link lạ trong tin nhắn", before: 58, after: 91, unit: "%" },
      { label: "Nhận diện cuộc gọi giả danh", before: 45, after: 83, unit: "%" },
    ],
  },
};

const nf = new Intl.NumberFormat("vi-VN");
export const formatNumber = (n: number) => nf.format(n);

/** 38.640.000.000 → "38,6 tỷ" */
export function formatVndCompact(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
  return nf.format(n);
}

/** Nội dung CSV của "báo cáo ESG" giả, có ghi chú số liệu minh họa ở đầu và cuối. */
export function buildEsgCsv(type: PartnerType, generatedAt: Date): string {
  const s = PARTNER_STATS[type];
  const rows: (string | number)[][] = [
    ["BÁO CÁO ESG — ZASA (SỐ LIỆU MINH HỌA, KHÔNG PHẢI DỮ LIỆU THẬT)"],
    ["Đối tác", s.label],
    ["Ngày tạo", generatedAt.toLocaleDateString("vi-VN")],
    [],
    ["Chỉ số", "Giá trị"],
    ["Số vụ lừa đảo đã chặn", s.blocked],
    ["Số tiền được bảo vệ (VNĐ)", s.protectedVnd],
    ["Người cao tuổi được bảo vệ", s.usersProtected],
    ["Tỷ lệ cảnh báo được làm theo (%)", s.followRate],
    [],
    ["Loại lừa đảo", "Số vụ"],
    ...s.scamTypes.map((t) => [t.name, t.cases]),
    [],
    ["Tháng", "Số vụ đã chặn"],
    ...s.monthly.map((m) => [m.month, m.cases]),
    [],
    ["Kỹ năng an toàn", "Trước khi dùng ZASA", "Sau 3 tháng", "Đơn vị"],
    ...s.skills.map((k) => [k.label, k.before, k.after, k.unit]),
    [],
    ["Ghi chú: toàn bộ số liệu trong báo cáo này là dữ liệu mẫu dùng cho bản thử nghiệm."],
  ];
  const cell = (v: string | number) => {
    const str = String(v);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  return rows.map((r) => r.map(cell).join(",")).join("\n");
}
