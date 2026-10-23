import {
  SAMPLE_QR_PAYLOADS,
  analyzeMessage,
  checkPhone,
  checkQr,
  checkTransfer,
  type MockVerdict,
  type RiskLevel,
} from "./mock-risk";

export type CheckType = "msg" | "phone" | "transfer" | "qr";
export const CHECK_TYPES: CheckType[] = ["msg", "phone", "transfer", "qr"];

/** Thông tin người dùng đã nhập, truyền từ màn hình Kiểm tra sang màn hình Kết quả qua URL. */
export type ResultSearch = {
  type?: CheckType | undefined;
  text?: string | undefined;
  img?: number | undefined;
  phone?: string | undefined;
  account?: string | undefined;
  bank?: string | undefined;
  amount?: number | undefined;
  reason?: string | undefined;
  qr?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export function parseResultSearch(search: Record<string, unknown>): ResultSearch {
  const type = CHECK_TYPES.find((t) => t === search["type"]);
  const amount = Number(search["amount"]);
  return {
    type,
    text: str(search["text"]),
    img: Number(search["img"]) === 1 ? 1 : undefined,
    phone: str(search["phone"]),
    account: str(search["account"]),
    bank: str(search["bank"]),
    amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    reason: str(search["reason"]),
    qr: str(search["qr"]),
  };
}

export const formatVnd = (n: number) => n.toLocaleString("vi-VN");

export function evaluateCheck(s: ResultSearch): MockVerdict {
  switch (s.type ?? "msg") {
    case "phone":
      return checkPhone(s.phone ?? "");
    case "transfer":
      return checkTransfer({
        account: s.account ?? "",
        amount: s.amount ?? 0,
        reason: s.reason ?? "",
      });
    case "qr":
      return checkQr(s.qr);
    default:
      return analyzeMessage(s.text ?? "", s.img === 1);
  }
}

/** Các dòng "Thông tin đã kiểm tra" hiển thị trên màn hình Kết quả. */
export function checkedFacts(s: ResultSearch): { label: string; value: string }[] {
  switch (s.type ?? "msg") {
    case "phone":
      return [{ label: "Số điện thoại", value: s.phone ?? "" }];
    case "transfer":
      return [
        { label: "Số tài khoản", value: s.account ?? "" },
        { label: "Ngân hàng", value: s.bank ?? "" },
        { label: "Số tiền", value: `${formatVnd(s.amount ?? 0)} đ` },
        { label: "Lý do", value: s.reason || "Không ghi" },
      ];
    case "qr": {
      const sample = SAMPLE_QR_PAYLOADS.find((q) => q.payload === s.qr);
      return s.qr
        ? [
            { label: "Mã QR", value: sample?.label ?? "Mã QR mô phỏng" },
            { label: "Nội dung", value: s.qr },
          ]
        : [{ label: "Mã QR", value: "Ảnh mã QR đã tải lên" }];
    }
    default:
      return [
        ...(s.text ? [{ label: "Tin nhắn", value: s.text }] : []),
        ...(s.img === 1 ? [{ label: "Ảnh", value: "Có ảnh chụp tin nhắn kèm theo" }] : []),
      ];
  }
}

type CheckCopy = {
  /** Tên hoạt động ghi vào lịch sử */
  activity: string;
  again: string;
  /** Các bước nên làm, theo từng cấp độ cảnh báo */
  steps: Record<RiskLevel, (you: string) => string[]>;
};

export const CHECK_COPY: Record<CheckType, CheckCopy> = {
  msg: {
    activity: "Đã kiểm tra tin nhắn",
    again: "Kiểm tra tin nhắn khác",
    steps: {
      danger: () => [
        "Không bấm vào đường link, không trả lời tin nhắn.",
        "Không đọc mã OTP hay mật khẩu cho bất kỳ ai.",
        "Không chuyển tiền theo yêu cầu trong tin nhắn.",
      ],
      warn: (you) => [
        "Chưa làm theo yêu cầu trong tin nhắn.",
        `Gọi lại người gửi bằng số ${you} đã biết từ trước để hỏi cho rõ.`,
        "Hỏi ý kiến người thân nếu còn băn khoăn.",
      ],
      safe: () => [
        "Vẫn không cung cấp mã OTP, mật khẩu qua tin nhắn.",
        "Nếu người gửi bỗng hối thúc chuyển tiền, hãy kiểm tra lại ngay.",
      ],
    },
  },
  phone: {
    activity: "Đã kiểm tra số điện thoại",
    again: "Kiểm tra số khác",
    steps: {
      danger: () => [
        "Không nghe máy, không gọi lại số này.",
        "Không làm theo bất kỳ yêu cầu nào của người gọi.",
        "Chặn số này trên điện thoại.",
      ],
      warn: () => [
        "Không đọc số tài khoản, mã OTP hay thông tin cá nhân qua điện thoại.",
        "Nếu người gọi xưng là công an, ngân hàng: cúp máy và tự gọi lại tổng đài chính thức.",
        "Hỏi ý kiến người thân nếu còn băn khoăn.",
      ],
      safe: () => ["Vẫn không cung cấp mã OTP, mật khẩu qua điện thoại."],
    },
  },
  transfer: {
    activity: "Đã kiểm tra trước khi chuyển tiền",
    again: "Kiểm tra giao dịch khác",
    steps: {
      danger: (you) => [
        "Không chuyển tiền lúc này.",
        `Gọi lại người nhận bằng số ${you} đã biết từ trước.`,
        "Công an, ngân hàng không bao giờ yêu cầu chuyển tiền qua điện thoại.",
      ],
      warn: (you) => [
        "Tạm dừng, chưa bấm chuyển.",
        `Gọi lại người nhận bằng số ${you} đã biết từ trước.`,
        "Hỏi ý kiến người thân nếu còn băn khoăn.",
      ],
      safe: () => [
        "Đối chiếu tên người nhận hiện trên ứng dụng ngân hàng trước khi bấm chuyển.",
        "Nếu có ai hối thúc, hãy dừng lại và hỏi người thân.",
      ],
    },
  },
  qr: {
    activity: "Đã quét mã QR",
    again: "Quét mã QR khác",
    steps: {
      danger: () => [
        "Không quét mã này, không chuyển tiền.",
        "Không nhập mã OTP hay mật khẩu vào trang mở ra từ mã QR.",
        "Báo lại cho nơi dán mã QR nếu đó là cửa hàng quen.",
      ],
      warn: () => [
        "Sau khi quét, đối chiếu tên người nhận có đúng không rồi mới chuyển.",
        "Không quét mã QR dán đè hoặc gửi qua tin nhắn lạ.",
        "Hỏi ý kiến người thân nếu còn băn khoăn.",
      ],
      safe: () => ["Vẫn đối chiếu tên người nhận trước khi chuyển tiền."],
    },
  },
};
