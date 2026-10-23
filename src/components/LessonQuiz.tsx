import { useEffect, useRef, useState } from "react";
import { CheckCircle2, PartyPopper, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useActivities, useAddress, useLessonResults, usePoints } from "@/lib/zasa-store";

export type Question = { q: string; options: string[]; answer: number; hint: string };

const POINTS_PER_QUESTION = 10;

export function LessonQuiz({
  lessonId,
  lessonTitle,
  questions,
}: {
  lessonId: string;
  lessonTitle: string;
  questions: Question[];
}) {
  const { answered, award } = usePoints();
  const { record } = useLessonResults();
  const { log } = useActivities();
  const { You, addr } = useAddress();
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const recorded = useRef(false);

  const correctCount = questions.filter((q, i) => picked[i] === q.answer).length;
  const firstTryCorrect = questions.filter((q, i) => picked[i] === q.answer && attempts[i] === 1).length;
  const finished = correctCount === questions.length;

  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    record({ lessonId, title: lessonTitle, correct: firstTryCorrect, total: questions.length });
    log({
      kind: "lesson",
      title: "Đã hoàn thành bài học",
      desc: `${lessonTitle} — đúng ${firstTryCorrect}/${questions.length} câu ngay lần đầu`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const choose = (qi: number, oi: number) => {
    if (picked[qi] === questions[qi]!.answer) return;
    setPicked((p) => ({ ...p, [qi]: oi }));
    setAttempts((a) => ({ ...a, [qi]: (a[qi] ?? 0) + 1 }));
    if (oi === questions[qi]!.answer) {
      const gained = award(`${lessonId}-${qi}`, POINTS_PER_QUESTION);
      toast.success(
        gained ? `Chính xác! +${gained} điểm` : `Chính xác! (câu này ${addr("{you}")} đã được cộng điểm rồi)`,
      );
    } else {
      toast.error(`Chưa đúng, điểm của ${addr("{you}")} vẫn được giữ nguyên. ${You} thử lại nhé!`);
    }
  };

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-primary">Câu hỏi tương tác</p>
        <p className="text-base font-semibold text-success">
          Đúng {correctCount}/{questions.length}
        </p>
      </div>

      {questions.map((q, qi) => {
        const chosen = picked[qi];
        const isCorrect = chosen === q.answer;
        const already = answered.includes(`${lessonId}-${qi}`);
        return (
          <div key={q.q} className="rounded-2xl bg-secondary/40 p-4">
            <p className="text-lg font-semibold leading-snug text-primary">
              Câu {qi + 1}. {addr(q.q)}
              {already ? <span className="ml-2 text-sm text-success">(đã cộng điểm)</span> : null}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((o, oi) => {
                const selected = chosen === oi;
                const tone = !selected
                  ? "bg-card"
                  : oi === q.answer
                    ? "bg-success/15 border-success"
                    : "bg-destructive/10 border-destructive";
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    className={`flex w-full items-center gap-2 rounded-xl border border-border ${tone} px-4 py-3 text-left text-lg active:scale-[0.98]`}
                  >
                    <span className="flex-1">{addr(o)}</span>
                    {selected ? (
                      oi === q.answer ? (
                        <CheckCircle2 className="size-6 shrink-0 text-success" />
                      ) : (
                        <XCircle className="size-6 shrink-0 text-destructive" />
                      )
                    ) : null}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined ? (
              <p className={`mt-2 text-base ${isCorrect ? "text-success" : "text-warning"}`}>
                {isCorrect ? `Đúng rồi! +${POINTS_PER_QUESTION} điểm. ` : "Chưa đúng. "}
                {addr(q.hint)}
              </p>
            ) : null}
          </div>
        );
      })}

      {finished ? (
        <div className="rounded-3xl border border-success/40 bg-success/10 p-5 text-center">
          <PartyPopper className="mx-auto size-10 text-success" />
          <p className="mt-2 text-2xl font-extrabold text-primary">Hoàn thành bài học!</p>
          <p className="mt-1 text-lg text-foreground">
            {You} trả lời đúng ngay lần đầu{" "}
            <strong className="text-success">
              {firstTryCorrect}/{questions.length}
            </strong>{" "}
            câu.
          </p>
          <p className="mt-1 text-base text-muted-foreground">
            Điểm đã được cộng và con cháu của {addr("{you}")} cũng thấy kết quả này.
          </p>
        </div>
      ) : null}
    </div>
  );
}
