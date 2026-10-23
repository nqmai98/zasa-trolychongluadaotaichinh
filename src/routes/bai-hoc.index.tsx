import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Clock, Lock, Search, ShieldCheck, Signal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LESSONS, TOPICS } from "@/lib/lessons";
import { useAddress, useLessonResults, usePoints } from "@/lib/zasa-store";

export const Route = createFileRoute("/bai-hoc/")({
  head: () => ({
    meta: [
      { title: "Bài học phòng chống lừa đảo — ZASA" },
      {
        name: "description",
        content:
          "Chủ đề an toàn tài chính, nhận diện lừa đảo, dùng Zalo an toàn và giao dịch an toàn: bài học ngắn, chữ to dễ đọc cho người cao tuổi.",
      },
      { property: "og:title", content: "Bài học phòng chống lừa đảo — ZASA" },
      {
        property: "og:description",
        content: "Chọn chủ đề và học từng bước cách phòng tránh lừa đảo.",
      },
    ],
  }),
  component: Lessons,
});

function Lessons() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const { points } = usePoints();
  const { results } = useLessonResults();
  const { you, You, addr } = useAddress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LESSONS.filter((l) => {
      const matchTopic = !topic || l.tag === topic;
      const matchText =
        !q || l.title.toLowerCase().includes(q) || addr(l.desc).toLowerCase().includes(q);
      return matchTopic && matchText;
    });
  }, [query, topic, addr]);

  return (
    <AppShell title="Bài học" back="/trang-chu">
      <p className="mb-3 rounded-2xl bg-secondary/60 px-4 py-3 text-lg font-semibold text-primary">
        Điểm tích lũy của {you}: {points} điểm — trả lời đúng mỗi câu hỏi được +10 điểm, trả lời sai
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

      <h2 className="mt-6 text-2xl font-bold text-primary">{You} muốn học về gì?</h2>
      <p className="mt-1 text-base text-muted-foreground">
        {You} chọn một chủ đề để xem các bài học phù hợp nhé.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {TOPICS.map(({ title, desc, icon: Icon, tint, tag }) => (
          <button
            key={title}
            type="button"
            aria-pressed={topic === tag}
            onClick={() => {
              setQuery("");
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
            <span className="text-sm leading-snug text-muted-foreground">{addr(desc)}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-primary">
          {topic ? TOPICS.find((t) => t.tag === topic)?.title : "Bài học nổi bật"}
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
        {filtered.map((l) => {
          const locked = l.state === "locked";
          const done = results.some((r) => r.lessonId === l.id);
          const content = (
            <>
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                {locked ? (
                  <Lock className="size-7" />
                ) : done ? (
                  <CheckCircle2 className="size-7 text-success" />
                ) : (
                  <ShieldCheck className="size-7" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-snug text-primary">{l.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                  {addr(l.desc)}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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
                  {locked ? <span className="text-muted-foreground">Sắp ra mắt</span> : null}
                  {done ? <span className="font-semibold text-success">Đã học</span> : null}
                </span>
              </span>
              {locked ? null : (
                <ChevronRight className="size-6 shrink-0 text-muted-foreground" aria-hidden />
              )}
            </>
          );
          return (
            <li key={l.id} className="rounded-2xl border border-border bg-card shadow-soft">
              {locked ? (
                <div className="flex w-full items-center gap-3 p-4 opacity-60">{content}</div>
              ) : (
                <Link
                  to="/bai-hoc/$lessonId"
                  params={{ lessonId: l.id }}
                  className="flex w-full items-center gap-3 p-4 text-left active:scale-[0.98]"
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground">
            Chưa có bài học nào trong chủ đề này. {You} bấm “Xem tất cả” để xem các bài khác nhé.
          </li>
        ) : null}
      </ul>
    </AppShell>
  );
}
