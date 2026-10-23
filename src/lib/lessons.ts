import { MessageSquareWarning, ShieldAlert, Users, Wallet, type LucideIcon } from "lucide-react";

/** Nội dung bài học. {you}/{You} được thay bằng "ông"/"bà" khi hiển thị. */
export type LessonTopic = {
  tag: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
};

export type Lesson = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  level: "Dễ" | "Trung bình";
  mins: number;
  state: "open" | "locked";
  /** Những điều cần biết */
  body: string[];
  /** Một tin nhắn/cuộc gọi mẫu để nhận diện dấu hiệu */
  example?: { from: string; text: string; flags: string[] };
  /** 3 việc cần làm */
  actions: string[];
};

export const TOPICS: LessonTopic[] = [
  {
    title: "An toàn tài chính",
    desc: "Bảo vệ tiền và tài khoản của {you}",
    icon: Wallet,
    tag: "tai-chinh",
    tint: "bg-secondary/60",
  },
  {
    title: "Nhận diện lừa đảo",
    desc: "Nhận biết tin nhắn, cuộc gọi và đường link giả mạo",
    icon: ShieldAlert,
    tag: "nhan-dien",
    tint: "bg-success/10",
  },
  {
    title: "Sử dụng Zalo an toàn",
    desc: "Học cách dùng Zalo hiệu quả và an toàn",
    icon: MessageSquareWarning,
    tag: "zalo",
    tint: "bg-muted",
  },
  {
    title: "Giao dịch an toàn",
    desc: "Chuyển tiền, thanh toán an toàn trên mạng",
    icon: Users,
    tag: "giao-dich",
    tint: "bg-accent/25",
  },
];

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    tag: "nhan-dien",
    title: "1. Nhận biết tin nhắn lừa đảo",
    desc: "Học cách nhận biết các tin nhắn giả mạo từ ngân hàng, cơ quan, bạn bè…",
    level: "Dễ",
    mins: 5,
    state: "open",
    body: [
      "Tin nhắn lừa đảo thường hối thúc {you} làm ngay: “tài khoản bị khoá”, “cần xác minh trong 2 giờ”.",
      "Số gửi lạ, đường link viết sai tên ngân hàng, sai chính tả tiếng Việt là dấu hiệu rõ nhất.",
    ],
    example: {
      from: "Số lạ 0868 xxx xxx",
      text: "VCB thong bao: Tai khoan cua quy khach bi tam khoa. Xac minh ngay trong 2 gio tai http://vietcombank-xacminh.com",
      flags: [
        "Gửi từ số điện thoại lạ, không phải tên ngân hàng",
        "Hối thúc “trong 2 giờ” để {you} không kịp suy nghĩ",
        "Đường link không phải trang chính thức của ngân hàng",
      ],
    },
    actions: [
      "Không bấm vào đường link trong tin nhắn.",
      "Gọi tổng đài in sau thẻ ngân hàng để hỏi lại.",
      "Dán tin nhắn vào mục Kiểm tra để ZASA xem giúp.",
    ],
  },
  {
    id: "l2",
    tag: "zalo",
    title: "2. Bảo mật tài khoản cá nhân",
    desc: "Những cách đơn giản để bảo vệ tài khoản Zalo và thông tin cá nhân của {you}.",
    level: "Dễ",
    mins: 6,
    state: "open",
    body: [
      "Đặt mật khẩu riêng cho Zalo, bật xác thực 2 lớp và không dùng chung mật khẩu với ngân hàng.",
      "Không đăng nhập Zalo trên điện thoại của người lạ.",
    ],
    example: {
      from: "Tài khoản lạ tự xưng “Hỗ trợ Zalo”",
      text: "Tài khoản của bác sắp bị khóa. Bác gửi cháu mã 6 số vừa nhận được để cháu mở khóa giúp nhé.",
      flags: [
        "Zalo không bao giờ nhắn tin xin mã",
        "Mã 6 số chính là mã đăng nhập tài khoản của {you}",
      ],
    },
    actions: [
      "Đặt mật khẩu Zalo riêng, khác mật khẩu ngân hàng.",
      "Bật xác thực 2 lớp trong phần cài đặt của Zalo.",
      "Không gửi mã đăng nhập cho bất kỳ ai.",
    ],
  },
  {
    id: "l3",
    tag: "giao-dich",
    title: "3. Giao dịch tài chính an toàn",
    desc: "Các nguyên tắc vàng khi chuyển tiền, thanh toán online.",
    level: "Trung bình",
    mins: 7,
    state: "open",
    body: [
      "Luôn gọi điện xác nhận trực tiếp trước khi chuyển tiền, kể cả khi người nhắn xưng là con cháu.",
      "Không chuyển “phí nhận thưởng”, “phí giải ngân” cho bất kỳ ai.",
    ],
    example: {
      from: "Tài khoản Zalo mang tên con trai",
      text: "Bố ơi con đang kẹt, chuyển giúp con 15 triệu vào số 9998 8877 7666 nhé, tối con trả. Đừng gọi, con đang họp.",
      flags: [
        "Đòi chuyển tiền gấp",
        "Ngăn không cho gọi điện xác minh",
        "Số tài khoản lạ, không mang tên người thân",
      ],
    },
    actions: [
      "Gọi điện cho người thân bằng số đã lưu sẵn trong máy.",
      "Dùng “Kiểm tra trước khi chuyển tiền” của ZASA.",
      "Không chuyển “phí” để nhận thưởng hay giải ngân.",
    ],
  },
  {
    id: "l4",
    tag: "tai-chinh",
    title: "4. Không chia sẻ thông tin cá nhân",
    desc: "Vì sao không nên chia sẻ CCCD, mã OTP hay số tài khoản cho người khác?",
    level: "Dễ",
    mins: 5,
    state: "open",
    body: [
      "Số CCCD, ảnh chụp CCCD và mã OTP là chìa khoá tài khoản ngân hàng của {you} — kẻ gian có thể vay tiền, mở tài khoản bằng thông tin đó.",
      "Không gửi ảnh CCCD qua Zalo, kể cả cho người xưng là nhân viên ngân hàng hay cán bộ phường.",
    ],
    example: {
      from: "Người xưng là cán bộ phường",
      text: "Phường đang cập nhật dữ liệu dân cư, ông bà chụp hai mặt căn cước gửi qua Zalo cho cán bộ trong hôm nay nhé.",
      flags: [
        "Cơ quan nhà nước không thu thập căn cước qua Zalo",
        "Ảnh căn cước có thể bị dùng để vay tiền, mở tài khoản giả",
      ],
    },
    actions: [
      "Không gửi ảnh căn cước qua mạng.",
      "Không đọc mã OTP cho bất kỳ ai.",
      "Cần cập nhật giấy tờ thì đến thẳng trụ sở phường.",
    ],
  },
  {
    id: "l5",
    tag: "nhan-dien",
    title: "5. Cuộc gọi giả danh công an, toà án",
    desc: "Vì sao công an không bao giờ làm việc qua Zalo hay điện thoại.",
    level: "Trung bình",
    mins: 6,
    state: "locked",
    body: [],
    actions: [],
  },
];

export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
