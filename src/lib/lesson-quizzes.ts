import type { Question } from "@/components/LessonQuiz";

export const quizzes: Record<string, Question[]> = {
  l4: [
    {
      q: "Ai được phép biết mã OTP của bạn?",
      options: ["Nhân viên ngân hàng", "Con cháu trong nhà", "Không ai cả"],
      answer: 2,
      hint: "OTP chỉ dành riêng cho bạn, không đọc cho bất kỳ ai.",
    },
    {
      q: "Người lạ xin ảnh chụp CCCD để “làm hồ sơ nhận quà”, bạn nên làm gì?",
      options: ["Gửi ngay cho nhanh", "Từ chối và chặn liên hệ", "Gửi nhưng che ngày sinh"],
      answer: 1,
      hint: "Ảnh CCCD có thể bị dùng để vay tiền, mở tài khoản giả mạo.",
    },
    {
      q: "Đăng số điện thoại và ngày sinh công khai trên mạng xã hội có rủi ro gì?",
      options: ["Không sao cả", "Kẻ gian dễ giả mạo, dò mật khẩu", "Giúp bạn bè tìm mình"],
      answer: 1,
      hint: "Thông tin cá nhân càng ít lộ, kẻ gian càng khó lừa.",
    },
    {
      q: "Một người tự xưng công an gọi hỏi số tài khoản ngân hàng, bạn nên?",
      options: ["Đọc số tài khoản", "Tắt máy và gọi cho con cháu", "Nhắn qua Zalo cho họ"],
      answer: 1,
      hint: "Cơ quan chức năng không làm việc qua điện thoại như vậy.",
    },
    {
      q: "Mật khẩu nào an toàn hơn?",
      options: ["123456", "Ngày sinh của mình", "Chuỗi chữ và số riêng, khó đoán"],
      answer: 2,
      hint: "Không dùng ngày sinh hay dãy số dễ đoán làm mật khẩu.",
    },
  ],
  l1: [
    {
      q: "Tin nhắn báo “tài khoản sẽ bị khoá trong 2 giờ” là dấu hiệu gì?",
      options: ["Ngân hàng chăm sóc khách hàng", "Hối thúc — dấu hiệu lừa đảo", "Tin nhắn bình thường"],
      answer: 1,
      hint: "Kẻ gian luôn tạo áp lực thời gian để bạn không kịp suy nghĩ.",
    },
    {
      q: "Đường link “vietcom-bank.xyz” có đáng tin không?",
      options: ["Có, vì có chữ bank", "Không, tên miền lạ và sai", "Tuỳ số tiền"],
      answer: 1,
      hint: "Ngân hàng thật không dùng tên miền lạ như .xyz.",
    },
    {
      q: "Người lạ xin mã OTP để “xác minh giúp”, bạn nên làm gì?",
      options: ["Đọc mã cho họ", "Tuyệt đối không đưa", "Chụp màn hình gửi"],
      answer: 1,
      hint: "OTP là chìa khoá tài khoản, không đưa cho bất kỳ ai.",
    },
    {
      q: "Tin nhắn nhiều lỗi chính tả, xưng hô lạ cho thấy điều gì?",
      options: ["Nhân viên viết vội", "Nhiều khả năng là giả mạo", "Không nói lên điều gì"],
      answer: 1,
      hint: "Tin nhắn chính thức thường chuẩn chính tả và có tên ngân hàng rõ ràng.",
    },
    {
      q: "Cách kiểm tra an toàn nhất khi nhận tin nhắn đáng ngờ?",
      options: [
        "Bấm link trong tin nhắn để xem",
        "Gọi tổng đài in trên thẻ hoặc hỏi con cháu",
        "Trả lời tin nhắn để hỏi lại",
      ],
      answer: 1,
      hint: "Luôn xác minh bằng kênh chính thức bạn tự tìm, không dùng số trong tin nhắn.",
    },
  ],
  l2: [
    {
      q: "Mật khẩu Zalo nên đặt thế nào?",
      options: ["Giống mật khẩu ngân hàng", "Riêng biệt và khó đoán", "Ngày sinh cho dễ nhớ"],
      answer: 1,
      hint: "Mỗi tài khoản một mật khẩu riêng để hạn chế rủi ro.",
    },
    {
      q: "Xác thực 2 lớp giúp gì?",
      options: ["Đăng nhập nhanh hơn", "Chặn người lạ dù biết mật khẩu", "Tăng dung lượng"],
      answer: 1,
      hint: "Kẻ gian cần thêm mã xác thực nên khó chiếm tài khoản hơn.",
    },
    {
      q: "Có nên đăng nhập Zalo trên điện thoại người lạ?",
      options: ["Có nếu chỉ dùng 5 phút", "Không nên", "Có nếu họ đứng cạnh"],
      answer: 1,
      hint: "Phiên đăng nhập có thể còn lưu trên máy đó.",
    },
    {
      q: "Bạn bè nhắn mượn tiền gấp qua Zalo, việc đầu tiên nên làm?",
      options: ["Chuyển ngay cho kịp", "Gọi điện thoại xác nhận", "Hỏi thêm qua tin nhắn"],
      answer: 1,
      hint: "Tài khoản Zalo có thể bị chiếm; gọi trực tiếp để kiểm chứng.",
    },
    {
      q: "Nên chia sẻ ảnh chụp CCCD lên nhóm Zalo không?",
      options: ["Không bao giờ", "Được, nếu nhóm gia đình", "Được, nếu xoá sau"],
      answer: 0,
      hint: "Ảnh CCCD có thể bị dùng để mở tài khoản, vay tiền giả mạo.",
    },
  ],
  l3: [
    {
      q: "Trước khi chuyển tiền cho “con cháu” nhắn tin, cần làm gì?",
      options: ["Gọi video hoặc gọi thoại xác nhận", "Chuyển trước rồi hỏi", "Nhắn lại hỏi mật khẩu"],
      answer: 0,
      hint: "Xác nhận trực tiếp là cách chắc chắn nhất.",
    },
    {
      q: "Ai đó yêu cầu nộp “phí nhận thưởng” 500.000đ. Bạn nên?",
      options: ["Nộp để nhận thưởng lớn", "Từ chối, đây là lừa đảo", "Nộp một nửa"],
      answer: 1,
      hint: "Giải thưởng thật không bao giờ bắt nộp phí trước.",
    },
    {
      q: "Nên chuyển tiền qua đâu?",
      options: ["Ứng dụng ngân hàng chính thức", "Link lạ gửi qua tin nhắn", "Người trung gian trên mạng"],
      answer: 0,
      hint: "Chỉ dùng ứng dụng bạn tự cài từ kho ứng dụng chính thức.",
    },
    {
      q: "Kiểm tra tên người nhận trước khi bấm xác nhận là?",
      options: ["Không cần thiết", "Rất cần thiết", "Chỉ khi số tiền lớn"],
      answer: 1,
      hint: "Sai một số tài khoản là tiền đi mất, rất khó lấy lại.",
    },
    {
      q: "Nếu lỡ chuyển tiền cho kẻ lừa đảo, việc đầu tiên?",
      options: ["Chờ xem sao", "Báo ngân hàng và công an ngay", "Nhắn xin lại tiền"],
      answer: 1,
      hint: "Báo càng sớm càng có cơ hội phong toả giao dịch.",
    },
  ],
};
