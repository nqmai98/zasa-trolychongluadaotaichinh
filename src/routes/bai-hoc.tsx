import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Clock,
  Lock,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Users,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { LessonQuiz } from "@/components/LessonQuiz";
import { quizzes } from "@/lib/lesson-quizzes";
import { usePoints } from "@/lib/zasa-store";

export const Route = createFileRoute("/bai-hoc")({
  head: () => ({
    meta: [
      { title: "Bài học phòng chống lừa đảo — ZASA" },
      {
        name: "description",
        content:
          "Chủ đề an toàn tài chính, nhận diện lừa đảo, dùng Zalo an toàn và giao dịch an toàn: bài học ngắn, chữ to dễ đọc cho người cao tuổi.",
      },
      { property: "og:title", content: "Bài học phòng chống lừa đảo — ZASA" },
      { property: "og:description", content: "Chọn chủ đề và học từng bước cách phòng tránh lừa đảo." },
    ],
  }),
  component: Lessons,
});

const topics = [
  {
    title: "An toàn tài chính",
    desc: "Bảo vệ tiền và tài khoản của bạn",
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
] as const;

const lessons = [
  {
    id: "l1",
    tag: "nhan-dien",
    title: "1. Nhận biết tin nhắn lừa đảo",
    desc: "Học cách nhận biết các tin nhắn giả mạo từ ngân hàng, cơ quan, bạn bè…",
    level: "Dễ",
    mins: 5,
    state: "open",
    body: [
      "Tin nhắn lừa đảo thường hối thúc bà làm ngay: “tài khoản bị khoá”, “cần xác minh trong 2 giờ”.",
      "Số gửi lạ, đường link viết sai tên ngân hàng, sai chính tả tiếng Việt là dấu hiệu rõ nhất.",
    ],
  },
  {
    id: "l2",
    tag: "zalo",
    title: "2. Bảo mật tài khoản cá nhân",
    desc: "Những cách đơn giản để bảo vệ tài khoản Zalo và thông tin cá nhân của bạn.",
    level: "Dễ",
    mins: 6,
    state: "open",
    body: [
      "Đặt mật khẩu riêng cho Zalo, bật xác thực 2 lớp và không dùng chung mật khẩu với ngân hàng.",
      "Không đăng nhập Zalo trên điện thoại của người lạ.",
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
  },
] as const;


const inProgress = {
  title: "4. Không chia sẻ thông tin cá nhân",
  desc: "Vì sao không nên chia sẻ CCCD, mã OTP cho người khác?",
  percent: 60,
};

function Lessons() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const { points } = usePoints();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((l) => {
      const matchTopic = !topic || l.tag === topic;
      const matchText = !q || l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q);
      return matchTopic && matchText;
    });
  }, [query, topic]);

  return (
    <AppShell title="Bài học" back="/trang-chu">
      <p className="mb-3 rounded-2xl bg-secondary/60 px-4 py-3 text-lg font-semibold text-primary">
        Điểm tích lũy của bạn: {points} điểm — trả lời đúng mỗi câu hỏi được +10 điểm, trả lời sai
        không bị trừ.
      </p>
      <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">

        <Search className="size-6 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm bài học..."
          aria-label="Tìm bài học"
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
        />
      </label>

      <h2 className="mt-6 text-2xl font-bold text-primary">Bạn muốn học về gì?</h2>
      <p className="mt-1 text-base text-muted-foreground">
        Chọn chủ đề để khám phá các bài học phù hợp với bạn.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {topics.map(({ title, desc, icon: Icon, tint, tag }) => (
          <button
            key={title}
            type="button"
            aria-pressed={topic === tag}
            onClick={() => {
              setQuery("");
              setOpen(null);
              setTopic(topic === tag ? null : tag);
            }}
            className={`flex flex-col gap-3 rounded-3xl ${tint} p-4 text-left shadow-soft transition-transform active:scale-95 ${
              topic === tag ? "ring-2 ring-primary" : ""
            }`}
          >
            <span className="grid size-12 place-items-center rounded-full bg-card text-primary">
              <Icon className="size-7" strokeWidth={1.75} />
            </span>
            <span className="text-lg font-bold leading-tight text-primary">{title}</span>
            <span className="text-sm leading-snug text-muted-foreground">{desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-primary">
          {topic ? topics.find((t) => t.tag === topic)?.title : "Bài học nổi bật"}
        </h2>
        {topic ? (
          <button
            type="button"
            onClick={() => setTopic(null)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary"
          >
            Xem tất cả
          </button>
        ) : null}
      </div>
      <ul className="mt-3 space-y-3">
        {filtered.map((l, i) => (
          <li key={l.title} className="rounded-2xl border border-border bg-card shadow-soft">
            <button
              type="button"
              disabled={l.state === "locked"}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center gap-3 p-4 text-left disabled:opacity-60"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                {l.state === "locked" ? (
                  <Lock className="size-7" />
                ) : (
                  <ShieldCheck className="size-7" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-snug text-primary">{l.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                  {l.desc}
                </span>
                <span className="mt-2 flex items-center gap-4 text-sm">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      l.level === "Dễ" ? "text-success" : "text-warning"
                    }`}
                  >
                    <Signal className="size-4" aria-hidden /> {l.level}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-4" aria-hidden /> {l.mins} phút
                  </span>
                </span>
              </span>
              <ChevronRight className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            </button>
            {open === i && l.state !== "locked" ? (
              <div className="space-y-3 border-t border-border px-4 py-4 text-lg leading-relaxed">
                {l.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="font-semibold text-primary">3 việc cần làm:</p>
                <ol className="list-decimal space-y-1 pl-6">
                  <li>Không bấm vào đường link lạ.</li>
                  <li>Không chuyển tiền, không đọc mã OTP.</li>
                  <li>Gọi cho con cháu hoặc hỏi trợ lý ZASA.</li>
                </ol>
                {quizzes[l.id] ? (
                  <LessonQuiz lessonId={l.id} lessonTitle={l.title} questions={quizzes[l.id]!} />
                ) : null}
              </div>

            ) : null}
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground">
            Chưa có bài học nào trong chủ đề này. Bà bấm “Xem tất cả” để xem các bài khác nhé.
          </li>
        ) : null}
      </ul>

      <h2 className="mt-8 text-2xl font-bold text-primary">Bạn đang học dở</h2>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
          <ShieldAlert className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-snug text-primary">{inProgress.title}</p>
          <p className="text-sm leading-snug text-muted-foreground">{inProgress.desc}</p>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={inProgress.percent} className="h-3 flex-1" />
            <span className="shrink-0 text-sm font-semibold text-primary">
              Đã học {inProgress.percent}%
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
