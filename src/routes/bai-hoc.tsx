import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/bai-hoc")({
  head: () => ({
    meta: [
      { title: "Bài học phòng chống lừa đảo — ZASA" },
      {
        name: "description",
        content: "Các bài học ngắn, chữ to dễ đọc giúp người cao tuổi nhận biết chiêu trò lừa đảo.",
      },
      { property: "og:title", content: "Bài học phòng chống lừa đảo — ZASA" },
      { property: "og:description", content: "Học từng bước cách nhận biết và phòng tránh lừa đảo." },
    ],
  }),
  component: Lessons,
});

const lessons = [
  { title: "Nhận biết tin nhắn giả mạo ngân hàng", mins: 4, state: "done" },
  { title: "Cuộc gọi giả danh công an, toà án", mins: 5, state: "done" },
  { title: "Bẫy trúng thưởng và quà tặng miễn phí", mins: 3, state: "current" },
  { title: "Không bao giờ chia sẻ mã OTP", mins: 4, state: "locked" },
  { title: "Đầu tư lãi cao — dấu hiệu lừa đảo", mins: 6, state: "locked" },
] as const;

function Lessons() {
  const [open, setOpen] = useState<number | null>(2);

  return (
    <AppShell title="Bài học">
      <div className="rounded-3xl bg-secondary p-5 shadow-soft">
        <p className="text-lg font-semibold text-secondary-foreground">Tiến độ của bà</p>
        <Progress value={40} className="mt-3 h-3" />
        <p className="mt-2 text-sm text-secondary-foreground">Đã hoàn thành 2 / 5 bài học</p>
      </div>

      <ul className="mt-5 space-y-3">
        {lessons.map((l, i) => (
          <li key={l.title} className="rounded-2xl border border-border bg-card shadow-soft">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              disabled={l.state === "locked"}
              className="flex w-full items-center gap-3 p-4 text-left disabled:opacity-60"
            >
              {l.state === "done" ? (
                <CheckCircle2 className="size-8 shrink-0 text-success" />
              ) : l.state === "locked" ? (
                <Lock className="size-8 shrink-0 text-muted-foreground" />
              ) : (
                <PlayCircle className="size-8 shrink-0 text-primary" />
              )}
              <span className="flex-1">
                <span className="block text-lg font-bold text-primary">{l.title}</span>
                <span className="text-sm text-muted-foreground">{l.mins} phút</span>
              </span>
            </button>
            {open === i && l.state !== "locked" ? (
              <div className="border-t border-border px-4 py-4 text-lg leading-relaxed text-foreground">
                <p>
                  Kẻ gian thường nhắn tin báo bà trúng thưởng lớn, rồi yêu cầu chuyển “phí nhận
                  quà”. Hãy nhớ: không ai bắt bà trả tiền để nhận quà.
                </p>
                <p className="mt-3 font-semibold text-primary">3 việc cần làm:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  <li>Không bấm vào đường link lạ.</li>
                  <li>Không chuyển tiền, không đọc mã OTP.</li>
                  <li>Gọi cho con cháu hoặc hỏi trợ lý ZASA.</li>
                </ol>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
