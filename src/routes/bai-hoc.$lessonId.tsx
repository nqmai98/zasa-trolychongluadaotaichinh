import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  MessageCircle,
  ShieldCheck,
  Signal,
  Square,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LessonQuiz } from "@/components/LessonQuiz";
import { quizzes } from "@/lib/lesson-quizzes";
import { LESSONS, TOPICS, findLesson, type Lesson } from "@/lib/lessons";
import { RISK_LEVELS } from "@/lib/risk-levels";
import { useAddress, useLessonResults } from "@/lib/zasa-store";

export const Route = createFileRoute("/bai-hoc/$lessonId")({
  head: ({ params }) => {
    const lesson = findLesson(params.lessonId);
    const title = `${lesson ? lesson.title.replace(/^\d+\.\s*/, "") : "Bài học"} — ZASA`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Bài học ngắn, chữ to dễ đọc về cách phòng tránh lừa đảo tài chính.",
        },
        { property: "og:title", content: title },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = findLesson(lessonId);

  if (!lesson || lesson.state === "locked") {
    return (
      <AppShell title="Bài học" back="/bai-hoc">
        <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
          <Lock className="size-12 text-muted-foreground" />
          <p className="mt-3 text-xl font-bold text-primary">
            {lesson ? "Bài học này sắp ra mắt" : "Không tìm thấy bài học"}
          </p>
          <Link
            to="/bai-hoc"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
          >
            Xem các bài học khác
          </Link>
        </div>
      </AppShell>
    );
  }
  // key: làm mới câu hỏi và giọng đọc khi chuyển sang bài khác
  return <LessonContent key={lesson.id} lesson={lesson} />;
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  const { You, addr } = useAddress();
  const { results } = useLessonResults();
  const topic = TOPICS.find((t) => t.tag === lesson.tag);
  const questions = quizzes[lesson.id] ?? [];
  const result = results.find((r) => r.lessonId === lesson.id);
  const danger = RISK_LEVELS.danger;
  const FlagIcon = danger.icon;

  const open = LESSONS.filter((l) => l.state === "open");
  const index = LESSONS.indexOf(lesson);
  const prev = LESSONS.slice(0, index)
    .reverse()
    .find((l) => l.state === "open");
  const next = LESSONS[index + 1];

  const speech = [
    lesson.title,
    ...lesson.body,
    ...(lesson.example ? ["Ví dụ.", lesson.example.text, ...lesson.example.flags] : []),
    "Việc cần làm.",
    ...lesson.actions,
  ]
    .map(addr)
    .join(" ");

  return (
    <AppShell title="Bài học" back="/bai-hoc">
      {/* Đầu bài */}
      <div
        className="rounded-3xl p-5 text-primary-foreground shadow-soft"
        style={{ background: "var(--gradient-brand)" }}
      >
        {topic ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            <topic.icon className="size-4" /> {topic.title}
          </span>
        ) : null}
        <h2 className="mt-3 text-2xl font-extrabold leading-snug">{lesson.title}</h2>
        <p className="mt-1 text-base leading-snug opacity-90">{addr(lesson.desc)}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
          <span className="flex items-center gap-1">
            <Signal className="size-4" /> {lesson.level}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" /> {lesson.mins} phút
          </span>
          <span>
            Bài {open.indexOf(lesson) + 1}/{open.length}
          </span>
        </p>
        {result ? (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            <CheckCircle2 className="size-4" /> Đã học · đúng {result.correct}/{result.total} câu
            ngay lần đầu
          </p>
        ) : null}
      </div>

      <ReadAloud text={speech} />

      {/* 1. Điều cần biết */}
      <Section n={1} title="Điều cần biết">
        <ul className="space-y-3">
          {lesson.body.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-lg leading-relaxed text-foreground shadow-soft"
            >
              <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />
              {addr(p)}
            </li>
          ))}
        </ul>
      </Section>

      {/* 2. Ví dụ thực tế */}
      {lesson.example ? (
        <Section n={2} title="Ví dụ thực tế">
          <div className="rounded-3xl border border-border bg-muted p-4">
            <p className="text-sm font-semibold text-muted-foreground">{lesson.example.from}</p>
            <p className="mt-2 rounded-2xl rounded-tl-md bg-card p-4 text-lg leading-relaxed text-foreground shadow-soft">
              {lesson.example.text}
            </p>
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">Dấu hiệu lừa đảo:</p>
          <ul className="mt-2 space-y-2">
            {lesson.example.flags.map((f) => (
              <li
                key={f}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-lg text-foreground ${danger.soft}`}
              >
                <FlagIcon className={`mt-0.5 size-6 shrink-0 ${danger.iconColor}`} />
                {addr(f)}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* 3. Việc cần làm */}
      <Section
        n={lesson.example ? 3 : 2}
        title={`${lesson.actions.length} việc ${addr("{you}")} cần nhớ`}
      >
        <ol className="space-y-3">
          {lesson.actions.map((a, i) => (
            <li
              key={a}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-lg leading-snug text-foreground">{addr(a)}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Câu hỏi */}
      {questions.length ? (
        <Section n={lesson.example ? 4 : 3} title="Kiểm tra hiểu bài">
          <LessonQuiz lessonId={lesson.id} lessonTitle={lesson.title} questions={questions} />
        </Section>
      ) : null}

      {/* Thực hành */}
      <div className="mt-8 rounded-3xl border border-border bg-secondary/60 p-4">
        <p className="text-lg font-bold text-primary">{You} muốn thực hành ngay?</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            to="/kiem-tra"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground"
          >
            <ShieldCheck className="size-5" /> Kiểm tra
          </Link>
          <Link
            to="/chat"
            className="flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-card text-base font-bold text-primary"
          >
            <MessageCircle className="size-5" /> Hỏi ZASA
          </Link>
        </div>
      </div>

      {/* Chuyển bài */}
      <nav aria-label="Chuyển bài học" className="mt-6 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            to="/bai-hoc/$lessonId"
            params={{ lessonId: prev.id }}
            className="flex min-h-16 items-center gap-2 rounded-2xl border border-border bg-card p-3 text-left shadow-soft"
          >
            <ChevronLeft className="size-6 shrink-0 text-primary" />
            <span className="text-sm">
              <span className="block text-muted-foreground">Bài trước</span>
              <span className="font-semibold text-primary">
                {prev.title.replace(/^\d+\.\s*/, "")}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          next.state === "open" ? (
            <Link
              to="/bai-hoc/$lessonId"
              params={{ lessonId: next.id }}
              className="flex min-h-16 items-center justify-end gap-2 rounded-2xl border border-border bg-card p-3 text-right shadow-soft"
            >
              <span className="text-sm">
                <span className="block text-muted-foreground">Bài tiếp theo</span>
                <span className="font-semibold text-primary">
                  {next.title.replace(/^\d+\.\s*/, "")}
                </span>
              </span>
              <ChevronRight className="size-6 shrink-0 text-primary" />
            </Link>
          ) : (
            <span className="flex min-h-16 items-center justify-end gap-2 rounded-2xl border border-border bg-card p-3 text-right text-sm text-muted-foreground opacity-70">
              <span>
                <span className="block">Bài tiếp theo</span>
                <span className="font-semibold">Sắp ra mắt</span>
              </span>
              <Lock className="size-5 shrink-0" />
            </span>
          )
        ) : null}
      </nav>
    </AppShell>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-3 text-xl font-bold text-primary">
        <span className="grid size-8 place-items-center rounded-full bg-secondary text-base text-secondary-foreground">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Đọc to bài học bằng giọng đọc có sẵn của máy (nếu máy hỗ trợ tiếng Việt). */
function ReadAloud({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    u.rate = 0.9;
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("vi"));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-lg font-bold text-primary shadow-soft"
    >
      {speaking ? <Square className="size-5" /> : <Volume2 className="size-6" />}
      {speaking ? "Dừng đọc" : "Nghe đọc bài học"}
    </button>
  );
}
