import type { Activity, Gender, LessonResult } from "./zasa-store";

/**
 * Danh bạ mã kết nối giả lập cho giao diện Con/Cháu.
 * "ZS-4821" là người cao tuổi đang dùng ZASA trên chính máy này (đọc dữ liệu thật trên máy);
 * các mã còn lại là người cao tuổi mẫu với hoạt động cố định, chỉ để minh họa.
 */
export const LOCAL_ELDER_CODE = "ZS-4821";

export type DemoElder = {
  code: string;
  name: string;
  gender: Gender;
  phone: string;
  points: number;
  results: Omit<LessonResult, "at">[];
  /** minutesAgo thay cho thời điểm tuyệt đối để dữ liệu mẫu luôn "mới" */
  activities: (Omit<Activity, "id" | "at"> & { minutesAgo: number })[];
};

export const DEMO_ELDERS: DemoElder[] = [
  {
    code: "ZS-1357",
    name: "Nguyễn Văn Nam",
    gender: "ong",
    phone: "0903 135 700",
    points: 70,
    results: [
      { lessonId: "l1", title: "1. Nhận biết tin nhắn lừa đảo", correct: 3, total: 3 },
      { lessonId: "l3", title: "3. Giao dịch tài chính an toàn", correct: 2, total: 3 },
    ],
    activities: [
      {
        kind: "scan",
        risk: "danger",
        title: "Đã kiểm tra trước khi chuyển tiền",
        desc: "Nguy hiểm: 9998 8877 7666 · BIDV · 50.000.000 đ",
        minutesAgo: 42,
      },
      {
        kind: "lesson",
        title: "Đã hoàn thành bài học",
        desc: "3. Giao dịch tài chính an toàn — đúng 2/3 câu ngay lần đầu",
        minutesAgo: 60 * 26,
      },
      {
        kind: "scan",
        risk: "safe",
        title: "Đã kiểm tra số điện thoại",
        desc: "Chưa thấy dấu hiệu: 0912 888 456",
        minutesAgo: 60 * 50,
      },
    ],
  },
  {
    code: "ZS-2468",
    name: "Trần Thị Mai",
    gender: "ba",
    phone: "0988 246 800",
    points: 120,
    results: [
      { lessonId: "l1", title: "1. Nhận biết tin nhắn lừa đảo", correct: 3, total: 3 },
      { lessonId: "l2", title: "2. Bảo mật tài khoản cá nhân", correct: 3, total: 3 },
      { lessonId: "l4", title: "4. Không chia sẻ thông tin cá nhân", correct: 4, total: 4 },
    ],
    activities: [
      {
        kind: "scan",
        risk: "warn",
        title: "Đã kiểm tra tin nhắn",
        desc: "Cần cảnh giác: Tai khoan cua ban se bi khoa, vui long xac minh",
        minutesAgo: 60 * 5,
      },
      {
        kind: "chat",
        title: "Đã trò chuyện với trợ lý ZASA",
        desc: "Có nên đọc mã OTP cho người khác?",
        minutesAgo: 60 * 30,
      },
    ],
  },
];

/** Chuẩn hóa mã người dùng gõ ("zs 1357", "ZS1357") về dạng "ZS-1357"; sai định dạng trả về null. */
export function normalizeCode(input: string): string | null {
  const m = input
    .toUpperCase()
    .replace(/\s/g, "")
    .match(/^ZS-?(\d{4})$/);
  return m ? `ZS-${m[1]}` : null;
}

export const isKnownCode = (code: string) =>
  code === LOCAL_ELDER_CODE || DEMO_ELDERS.some((e) => e.code === code);

export const findDemoElder = (code: string) => DEMO_ELDERS.find((e) => e.code === code);
