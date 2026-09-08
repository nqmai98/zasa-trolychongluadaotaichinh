import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { usePoints } from "@/lib/zasa-store";

export type Question = { q: string; options: string[]; answer: number; hint: string };

const POINTS_PER_QUESTION = 10;

export function LessonQuiz({ lessonId, questions }: { lessonId: string; questions: Question[] }) {
  const { answered, award } = usePoints();
  const [picked, setPicked] = useState<Record<number, number>>({});

  const correctCount = questions.filter((q, i) => picked[i] === q.answer).length;

  const choose = (qi: number, oi: number) => {
    if (picked[qi] === questions[qi]!.answer) return;
    setPicked((p) => ({ ...p, [qi]: oi }));
    if (oi === questions[qi]!.answer) {
      const gained = award(`${lessonId}-${qi}`, POINTS_PER_QUESTION);
      toast.success(
        gained ? `Chính xác! +${gained} điểm` : "Chính xác! (câu này bạn đã được cộng điểm rồi)",
      );
    } else {
      toast.error("Chưa đúng, điểm của bạn vẫn được giữ nguyên. Hãy thử lại nhé!");
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
              Câu {qi + 1}. {q.q}
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
                    <span className="flex-1">{o}</span>
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
                {q.hint}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
