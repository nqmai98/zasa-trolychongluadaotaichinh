import {
  Crown,
  HeartHandshake,
  Lock,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Kho hướng dẫn sử dụng ZASA (trang Hỗ trợ). Chỉ nói về cách dùng ứng dụng;
 * cách xử lý khi gặp lừa đảo thuộc luồng chính (Kiểm tra, Chat AI, Bài học).
 * {you}/{You} được thay bằng "ông"/"bà" khi hiển thị.
 */
export type HelpCategory = { id: string; label: string; icon: LucideIcon };

/** Vai trò được xem bài; bỏ trống = chỉ người cao tuổi */
export type HelpRole = "elder" | "family";

export type HelpArticle = {
  id: string;
  category: string;
  roles?: HelpRole[];
  title: string;
  steps: string[];
  tip?: string;
  link?: { to: string; label: string };
};

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "start", label: "Bắt đầu", icon: Rocket },
  { id: "follow", label: "Theo dõi người cao tuổi", icon: HeartHandshake },
  { id: "check", label: "Dùng tính năng Kiểm tra", icon: ShieldCheck },
  { id: "family", label: "Người thân", icon: Users },
  { id: "profile", label: "Hồ sơ & điểm", icon: UserCircle2 },
  { id: "display", label: "Hiển thị", icon: SlidersHorizontal },
  { id: "plan", label: "Gói dịch vụ", icon: Crown },
  { id: "data", label: "Dữ liệu & quyền riêng tư", icon: Lock },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "tour",
    category: "start",
    title: "ZASA có những phần nào?",
    steps: [
      "Trang chủ có 4 ô lớn: Chat AI, Bài học, Kiểm tra lừa đảo và Kết nối người thân.",
      "Thanh dưới cùng luôn hiện để {you} chuyển nhanh giữa các phần.",
      "Bấm ảnh đại diện ở góc trên bên phải Trang chủ để mở Hồ sơ, Cài đặt, Hỗ trợ hoặc Đăng xuất.",
    ],
    link: { to: "/trang-chu", label: "Về Trang chủ" },
  },
  {
    id: "role",
    roles: ["elder", "family"],
    category: "start",
    title: "Đăng xuất hoặc đổi vai trò Ông/Bà, Con/Cháu",
    steps: [
      "Bấm ảnh đại diện ở góc trên bên phải màn hình chính, rồi chọn “Đăng xuất”.",
      "Màn hình chọn vai trò hiện ra: chọn “Tôi là Ông / Bà” hoặc “Tôi là Con / Cháu”.",
      "Hồ sơ, điểm và lịch sử vẫn được giữ nguyên trên máy sau khi đăng xuất.",
    ],
  },
  {
    id: "check-msg",
    category: "check",
    title: "Kiểm tra tin nhắn hoặc ảnh chụp",
    steps: [
      "Mở Kiểm tra, chọn ô “Tin nhắn / ảnh”.",
      "Dán nội dung tin nhắn vào ô trống, hoặc bấm “Tải ảnh tin nhắn” để chọn ảnh chụp màn hình.",
      "Bấm “Kiểm tra ngay” và chờ màn hình Kết quả.",
    ],
    tip: "Bản thử nghiệm chưa đọc được chữ trong ảnh. Nếu được, {you} dán thêm nội dung chữ để kết quả rõ hơn.",
    link: { to: "/kiem-tra", label: "Mở Kiểm tra" },
  },
  {
    id: "check-phone",
    category: "check",
    title: "Kiểm tra một số điện thoại",
    steps: [
      "Mở Kiểm tra, chọn ô “Số điện thoại”.",
      "Nhập số cần kiểm tra (ít nhất 9 chữ số, có hoặc không có dấu cách đều được).",
      "Bấm “Kiểm tra số này”.",
    ],
    link: { to: "/kiem-tra", label: "Mở Kiểm tra" },
  },
  {
    id: "check-transfer",
    category: "check",
    title: "Kiểm tra trước khi chuyển tiền",
    steps: [
      "Mở Kiểm tra, chọn ô “Trước khi chuyển tiền”.",
      "Nhập số tài khoản nhận, chọn ngân hàng, nhập số tiền và lý do chuyển.",
      "Bấm “Kiểm tra trước khi chuyển”. Nút chỉ bấm được khi đã có số tài khoản, ngân hàng và số tiền.",
    ],
    tip: "ZASA không chuyển tiền và không kết nối với ngân hàng; đây chỉ là bước dừng lại để kiểm tra.",
    link: { to: "/kiem-tra", label: "Mở Kiểm tra" },
  },
  {
    id: "check-qr",
    category: "check",
    title: "Kiểm tra mã QR",
    steps: [
      "Mở Kiểm tra, chọn ô “Quét mã QR”.",
      "Bấm “Tải ảnh mã QR” để chọn ảnh, hoặc chọn một mã QR mô phỏng trong danh sách.",
      "Bấm “Kiểm tra mã QR”.",
    ],
    link: { to: "/kiem-tra", label: "Mở Kiểm tra" },
  },
  {
    id: "read-result",
    category: "check",
    title: "Đọc màn hình Kết quả",
    steps: [
      "Băng màu trên cùng cho biết mức cảnh báo: đỏ là Nguy hiểm, vàng là Cần cảnh giác, xanh lá là Chưa thấy dấu hiệu.",
      "Bên dưới là thông tin {you} vừa nhập, lý do ZASA kết luận và các việc nên làm.",
      "Khi có cảnh báo, {you} có thể bấm “Hỏi trợ lý AI” để hỏi thêm, hoặc báo cho người thân.",
    ],
  },
  {
    id: "paste",
    category: "check",
    title: "Không dán được từ bộ nhớ tạm",
    steps: [
      "Một số trình duyệt chặn ZASA đọc bộ nhớ tạm, khi đó sẽ hiện thông báo không đọc được.",
      "{You} nhấn giữ vào ô nhập tin nhắn cho tới khi hiện chữ “Dán”, rồi bấm “Dán”.",
      "Nếu trình duyệt hỏi quyền truy cập bộ nhớ tạm, {you} chọn “Cho phép”.",
    ],
  },
  {
    id: "image",
    category: "check",
    title: "Không tải được ảnh lên",
    steps: [
      "Chỉ chọn được tệp ảnh (ảnh chụp màn hình, ảnh trong thư viện).",
      "Ảnh cần nhỏ hơn 5MB. Ảnh chụp màn hình thường đã đủ nhỏ.",
      "Nếu vẫn không được, {you} chụp lại màn hình rồi thử tải lại.",
    ],
  },
  {
    id: "connect",
    category: "family",
    title: "Kết nối với con cháu",
    steps: [
      "Mở “Kết nối” ở thanh dưới cùng.",
      "Đọc hoặc gửi mã kết nối cho con cháu để họ nhập vào máy của họ.",
      "Hoặc bấm “Thêm người thân”, nhập họ tên, quan hệ, số điện thoại rồi bấm “Lưu người thân”.",
    ],
    link: { to: "/ket-noi", label: "Mở Kết nối" },
  },
  {
    id: "auto-notify",
    category: "family",
    title: "Bật hoặc tắt tự động báo người thân",
    steps: [
      "Bấm ảnh đại diện ở Trang chủ, chọn “Cài đặt”.",
      "Chọn “Cảnh báo & thông báo”.",
      "Bật hoặc tắt “Tự động báo người thân”.",
    ],
    tip: "Gói Miễn phí báo cho 1 người thân; gói Premium báo cho tất cả người thân đã kết nối.",
    link: { to: "/cai-dat/canh-bao", label: "Mở Cảnh báo & thông báo" },
  },
  {
    id: "edit-profile",
    category: "profile",
    title: "Đổi tên, ảnh đại diện hoặc xưng hô",
    steps: [
      "Bấm ảnh đại diện ở Trang chủ, chọn “Hồ sơ”.",
      "Bấm vào ảnh để đổi ảnh đại diện (ảnh nhỏ hơn 3MB).",
      "Sửa họ tên, chọn xưng hô Ông hoặc Bà, rồi bấm “Lưu thông tin”.",
    ],
    tip: "ZASA gọi {you} kèm tên cuối trong họ tên, ví dụ Nguyễn Văn Nam sẽ được gọi là Ông Nam.",
    link: { to: "/ho-so", label: "Mở Hồ sơ" },
  },
  {
    id: "points",
    category: "profile",
    title: "Điểm tích lũy được tính thế nào?",
    steps: [
      "Mỗi câu hỏi trong Bài học trả lời đúng được cộng 10 điểm.",
      "Trả lời sai không bị trừ điểm, {you} có thể thử lại.",
      "Mỗi câu chỉ được cộng điểm một lần.",
    ],
    link: { to: "/bai-hoc", label: "Mở Bài học" },
  },
  {
    id: "text-size",
    roles: ["elder", "family"],
    category: "display",
    title: "Chữ nhỏ quá, khó đọc",
    steps: [
      "Bấm ảnh đại diện ở góc trên bên phải, chọn “Cài đặt”, rồi “Cài đặt chung”.",
      "Ở mục “Cỡ chữ”, chọn Lớn hoặc Rất lớn.",
      "Nếu chữ vẫn mờ, bật “Tăng độ tương phản”.",
    ],
    link: { to: "/cai-dat/chung", label: "Mở Cài đặt chung" },
  },
  {
    id: "dark",
    roles: ["elder", "family"],
    category: "display",
    title: "Đổi chế độ sáng hoặc tối",
    steps: [
      "Mở Cài đặt, chọn “Cài đặt chung”.",
      "Ở mục “Chế độ màn hình”, chọn Sáng, Tối hoặc Theo máy.",
    ],
    link: { to: "/cai-dat/chung", label: "Mở Cài đặt chung" },
  },
  {
    id: "font",
    roles: ["elder", "family"],
    category: "display",
    title: "Đổi phông chữ hoặc tắt hiệu ứng chuyển động",
    steps: [
      "Mở Cài đặt, chọn “Cài đặt chung”.",
      "Chọn phông chữ dễ đọc nhất với {you} ở mục “Phông chữ”.",
      "Bật “Giảm chuyển động” nếu {you} thấy chóng mặt khi màn hình trượt.",
      "Bấm “Khôi phục mặc định” nếu muốn quay về như ban đầu.",
    ],
    link: { to: "/cai-dat/chung", label: "Mở Cài đặt chung" },
  },
  {
    id: "trial",
    roles: ["elder", "family"],
    category: "plan",
    title: "Dùng thử gói Premium",
    steps: [
      "Mở Cài đặt, chọn “Gói dịch vụ”.",
      "Bấm “Dùng thử 7 ngày”. Không cần thẻ ngân hàng, không mất tiền.",
      "Hết 7 ngày, ZASA tự quay về gói Miễn phí. {You} cũng có thể bấm “Dừng dùng thử” bất cứ lúc nào.",
    ],
    link: { to: "/cai-dat/goi-dich-vu", label: "Mở Gói dịch vụ" },
  },
  {
    id: "plan-compare",
    roles: ["elder", "family"],
    category: "plan",
    title: "Gói Miễn phí và Premium khác nhau thế nào?",
    steps: [
      "Miễn phí: dùng đủ các tính năng kiểm tra và bài học.",
      "Premium (50.000đ/hộ/tháng): thêm cảnh báo tới nhiều người thân, báo cáo an toàn gia đình hằng tuần và phân tích ghi âm giọng nói.",
    ],
    link: { to: "/cai-dat/goi-dich-vu", label: "Xem bảng so sánh" },
  },
  {
    id: "where-data",
    roles: ["elder", "family"],
    category: "data",
    title: "Dữ liệu của {you} được lưu ở đâu?",
    steps: [
      "Trong bản thử nghiệm, mọi dữ liệu chỉ lưu trên chính điện thoại hoặc trình duyệt này.",
      "ZASA không gửi tin nhắn, ảnh hay số tài khoản {you} nhập đi đâu cả.",
      "Vì vậy khi đổi máy, đổi trình duyệt hoặc xóa dữ liệu trình duyệt, lịch sử và cài đặt sẽ không còn.",
    ],
    link: { to: "/cai-dat/du-lieu", label: "Mở Quyền riêng tư & dữ liệu" },
  },
  {
    id: "clear",
    category: "data",
    title: "Xóa lịch sử hoặc đặt lại toàn bộ dữ liệu",
    steps: [
      "Mở Cài đặt, chọn “Quyền riêng tư & dữ liệu”.",
      "Bấm “Xóa lịch sử hoạt động” để xóa các lần kiểm tra, bài học đã làm.",
      "Bấm “Đặt lại toàn bộ dữ liệu” để xóa hết hồ sơ, người thân, điểm và cài đặt. Việc này không thể hoàn tác.",
    ],
    link: { to: "/cai-dat/du-lieu", label: "Mở Quyền riêng tư & dữ liệu" },
  },
  {
    id: "f-add",
    category: "follow",
    roles: ["family"],
    title: "Thêm người cao tuổi cần theo dõi",
    steps: [
      "Nhờ ông bà mở mục “Kết nối” trên máy của họ để xem mã kết nối (dạng ZS-1234).",
      "Trên màn hình chính, bấm “Thêm người cao tuổi”.",
      "Nhập mã kết nối và quan hệ (ví dụ Ông nội), rồi bấm “Kết nối”.",
    ],
    tip: "Một tài khoản có thể theo dõi nhiều người cao tuổi cùng lúc.",
  },
  {
    id: "f-switch",
    category: "follow",
    roles: ["family"],
    title: "Xem thông tin của từng người",
    steps: [
      "Bấm vào thẻ tên trong danh sách “Người đang theo dõi”.",
      "Phần bên dưới sẽ hiện cảnh báo, tình hình học tập và hoạt động gần đây của người đó.",
      "Số màu đỏ trên thẻ là số cảnh báo; chữ “Ổn” màu xanh nghĩa là chưa có cảnh báo.",
    ],
  },
  {
    id: "f-alert",
    category: "follow",
    roles: ["family"],
    title: "Đọc cảnh báo của người cao tuổi",
    steps: [
      "Cảnh báo màu đỏ là Nguy hiểm, màu vàng là Cần cảnh giác.",
      "Mỗi cảnh báo ghi rõ loại kiểm tra và nội dung ông bà vừa kiểm tra.",
      "Bấm “Gọi ngay” để gọi cho ông bà bằng số điện thoại trong hồ sơ của họ.",
    ],
  },
  {
    id: "f-remove",
    category: "follow",
    roles: ["family"],
    title: "Ngừng theo dõi một người",
    steps: [
      "Chọn người đó trong danh sách “Người đang theo dõi”.",
      "Bấm “Ngừng theo dõi” rồi xác nhận.",
      "Muốn theo dõi lại, chỉ cần thêm lại bằng mã kết nối.",
    ],
  },
  {
    id: "f-notify",
    category: "follow",
    roles: ["family"],
    title: "Bật hoặc tắt thông báo cảnh báo",
    steps: [
      "Bấm ảnh đại diện, chọn “Cài đặt”, rồi “Cảnh báo & thông báo”.",
      "Bật hoặc tắt cảnh báo mức Nguy hiểm và mức Cần cảnh giác.",
      "Báo cáo an toàn hằng tuần cần gói Premium.",
    ],
    link: { to: "/cai-dat/canh-bao", label: "Mở Cảnh báo & thông báo" },
  },
  {
    id: "f-profile",
    category: "profile",
    roles: ["family"],
    title: "Đổi tên, ảnh đại diện hoặc xưng hô",
    steps: [
      "Bấm ảnh đại diện, chọn “Hồ sơ”.",
      "Bấm vào ảnh để đổi ảnh đại diện (ảnh nhỏ hơn 3MB).",
      "Sửa họ tên, chọn xưng hô Anh hoặc Chị, rồi bấm “Lưu thông tin”.",
    ],
    link: { to: "/ho-so", label: "Mở Hồ sơ" },
  },
  {
    id: "f-reset",
    category: "data",
    roles: ["family"],
    title: "Đặt lại toàn bộ dữ liệu trên máy",
    steps: [
      "Mở Cài đặt, chọn “Quyền riêng tư & dữ liệu”.",
      "Bấm “Đặt lại toàn bộ dữ liệu” rồi xác nhận.",
      "Hồ sơ, danh sách người đang theo dõi và cài đặt sẽ bị xóa; việc này không thể hoàn tác.",
    ],
    link: { to: "/cai-dat/du-lieu", label: "Mở Quyền riêng tư & dữ liệu" },
  },
];

/** Các bài một vai trò được xem */
export const articlesFor = (role: HelpRole) =>
  HELP_ARTICLES.filter((a) => (a.roles ?? ["elder"]).includes(role));

const fold = (s: string) =>
  s.toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

/** Tìm bài hướng dẫn theo từ khóa, không phân biệt dấu. */
export function searchHelp(query: string, articles = HELP_ARTICLES): HelpArticle[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return articles;
  return articles.filter((a) => {
    const text = fold([a.title, ...a.steps, a.tip ?? ""].join(" "));
    return words.every((w) => text.includes(w));
  });
}
