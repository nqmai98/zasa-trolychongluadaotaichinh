export type RiskLevel = "danger" | "warn" | "safe";
export type MockVerdict = { level: RiskLevel; reasons: string[]; note: string };

export const REPORTED_PHONE_NUMBERS: Record<string, RiskLevel> = {
  "0900000001": "danger",
  "0900000002": "warn",
};

export const REPORTED_ACCOUNTS = ["999888777666", "123456789012"];

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

export function analyzeMessage(text: string, hasImage = false): MockVerdict {
  const source = normalize(text);
  const reasons: string[] = [];
  const rules: Array<[RegExp, string]> = [
    [/\botp\b|ma xac thuc/, "Yêu cầu cung cấp mã OTP hoặc mã xác thực"],
    [/cong an|dieu tra|toa an/, "Tự xưng công an, điều tra hoặc tòa án"],
    [/https?:\/\/|link la|duong link/, "Có đường dẫn lạ"],
    [/trung thuong|nhan thuong/, "Hứa hẹn trúng thưởng bất ngờ"],
    [/khoa tai khoan|dong bang tai khoan/, "Dọa khóa hoặc đóng băng tài khoản"],
    [/chuyen khoan gap|chuyen tien gap|chuyen gap/, "Thúc giục chuyển tiền gấp"],
  ];
  for (const [pattern, reason] of rules) if (pattern.test(source)) reasons.push(reason);
  if (hasImage && !text.trim()) {
    return {
      level: "warn",
      reasons: ["Ảnh tin nhắn chưa rõ nội dung — cần đọc kỹ trước khi làm theo."],
      note: "Bản demo chưa đọc được chữ trong ảnh; ZASA không xác minh người gửi hay nội dung thật.",
    };
  }
  return {
    level: reasons.length >= 2 ? "danger" : reasons.length === 1 ? "warn" : "safe",
    reasons: reasons.length ? reasons : ["Không phát hiện từ khóa lừa đảo phổ biến nào."],
    note: "Kết quả minh họa theo từ khóa; ZASA không xác minh người gửi hay nội dung thật.",
  };
}

export function checkPhone(phone: string): MockVerdict {
  const digits = phone.replace(/\D/g, "");
  const listed = REPORTED_PHONE_NUMBERS[digits];
  if (listed === "danger") {
    return {
      level: "danger",
      reasons: ["Số này nằm trong danh sách số điện thoại bị báo cáo mẫu."],
      note: "Danh sách chỉ dùng để minh họa, không phải dữ liệu xác minh thực tế.",
    };
  }
  if (listed === "warn") {
    return {
      level: "warn",
      reasons: ["Số này có báo cáo cần thận trọng trong dữ liệu mẫu."],
      note: "Danh sách chỉ dùng để minh họa, không phải dữ liệu xác minh thực tế.",
    };
  }
  return {
    level: "warn",
    reasons: ["Không tìm thấy số này trong danh sách mẫu; điều đó không có nghĩa là số an toàn."],
    note: "Danh sách chỉ dùng để minh họa, không phải dữ liệu xác minh thực tế.",
  };
}

export function checkTransfer(input: {
  account: string;
  amount: number;
  reason: string;
}): MockVerdict {
  const reasons: string[] = [];
  const account = input.account.replace(/\D/g, "");
  const reason = normalize(input.reason);
  if (REPORTED_ACCOUNTS.includes(account))
    reasons.push("Số tài khoản có trong danh sách cảnh báo minh họa.");
  if (input.amount > 20_000_000) reasons.push("Số tiền chuyển trên 20 triệu đồng.");
  if (/cong an|dieu tra|dau tu|cong tac vien/.test(reason))
    reasons.push("Nội dung chuyển tiền có từ khóa thường gặp trong tình huống lừa đảo.");
  return {
    level: reasons.length ? "danger" : "safe",
    reasons: reasons.length
      ? reasons
      : ["Chưa thấy dấu hiệu theo các quy tắc minh họa; vẫn cần tự xác minh người nhận."],
    note: "Quy tắc chỉ dùng cho bản demo; hãy gọi người nhận qua số đã biết trước khi chuyển.",
  };
}

export const SAMPLE_QR_PAYLOADS = [
  { label: "QR dán ở quầy hàng quen", payload: "STK 555123 - Tạp hóa Cô Lan" },
  { label: "QR nhận quà tri ân", payload: "http://qua-tang.vip/nhan-qua?otp=1" },
  { label: "QR nộp phạt nguội", payload: "STK 999888777666 - Nop phat cong an" },
];

export function checkQr(payload?: string): MockVerdict {
  const note = "Không quét hoặc chuyển tiền nếu không biết rõ nguồn của mã QR.";
  if (!payload) {
    return {
      level: "warn",
      reasons: ["Mã QR chưa được giải mã trong bản demo; đường dẫn đích chưa được xác minh."],
      note,
    };
  }
  const source = normalize(payload);
  const reasons: string[] = [];
  if (REPORTED_ACCOUNTS.some((account) => source.replace(/\D/g, "").includes(account)))
    reasons.push("Mã QR dẫn tới số tài khoản trong danh sách cảnh báo minh họa.");
  if (/https?:\/\/|\.vip|\.xyz/.test(source)) reasons.push("Mã QR mở ra đường dẫn lạ.");
  if (/otp|cong an|nop phat|trung thuong|qua tang/.test(source))
    reasons.push("Nội dung mã QR có từ khóa thường gặp trong tình huống lừa đảo.");
  return {
    level: reasons.length ? "danger" : "warn",
    reasons: reasons.length
      ? reasons
      : [
          "Chưa thấy dấu hiệu theo quy tắc minh họa; hãy đối chiếu tên người nhận trước khi chuyển.",
        ],
    note,
  };
}
