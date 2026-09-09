import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Award,
  Check,
  Copy,
  GraduationCap,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/zasa-shield.png";
import { Progress } from "@/components/ui/progress";
import {
  timeAgo,
  useActivities,
  useLessonResults,
  usePoints,
  useProfile,
  useRelatives,
} from "@/lib/zasa-store";

export const Route = createFileRoute("/nguoi-than")({
  head: () => ({
    meta: [
      { title: "Giao diện Con/Cháu — ZASA" },
      {
        name: "description",
        content:
          "Kết nối với ông bà, nhận cảnh báo khi ông bà gặp tin nhắn rủi ro cao và theo dõi tình hình học tập phòng chống lừa đảo.",
      },
      { property: "og:title", content: "Giao diện Con/Cháu — ZASA" },
      {
        property: "og:description",
        content: "Theo dõi và bảo vệ ông bà khỏi lừa đảo tài chính từ xa.",
      },
    ],
  }),
  component: FamilyDashboard,
});

const TOTAL_LESSONS = 5;

function FamilyDashboard() {
  const { profile } = useProfile();
  const { activities } = useActivities();
  const { results } = useLessonResults();
  const { points } = usePoints();
  const { relatives } = useRelatives();
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 20_000);
    return () => clearInterval(t);
  }, []);

  const alerts = activities.filter((a) => a.risk === "danger" || a.risk === "warn");
  const correct = results.reduce((s, r) => s + r.correct, 0);
  const total = results.reduce((s, r) => s + r.total, 0);
  const donePercent = Math.round((results.length / TOTAL_LESSONS) * 100);
  const elderName = profile.name;
  const elderTitle = profile.gender === "ong" ? "Ông" : "Bà";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText("ZS-4821");
      setCopied(true);
      toast.success("Đã sao chép mã kết nối ZS-4821");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không sao chép được, bạn ghi tay mã ZS-4821 nhé");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
        <img src={logo} alt="" width={768} height={768} className="size-10" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Người thân</h1>
          <p className="text-sm text-muted-foreground">Bạn đang theo dõi: {elderName}</p>
        </div>
        <Link
          to="/chon-vai-tro"
          aria-label="Đổi vai trò"
          className="grid size-11 place-items-center rounded-full bg-secondary text-primary"
        >
          <RefreshCw className="size-5" />
        </Link>
      </header>

      <main className="flex-1 space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-secondary p-5 text-center shadow-soft">
          <p className="text-base text-secondary-foreground">
            Mã kết nối của {elderTitle} {elderName}
          </p>
          <p className="mt-1 text-4xl font-extrabold tracking-[0.2em] text-primary">ZS-4821</p>
          <button
            type="button"
            onClick={copyCode}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-base font-semibold text-primary"
          >
            {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
            {copied ? "Đã sao chép" : "Sao chép mã"}
          </button>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <AlertTriangle className="size-6 text-warning" /> Cảnh báo rủi ro
          </h2>
          {alerts.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
              Chưa có cảnh báo nào. {elderTitle} {elderName} vẫn an toàn.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className={`rounded-2xl border p-4 shadow-soft ${
                    a.risk === "danger"
                      ? "border-destructive/40 bg-destructive/10"
                      : "border-warning/40 bg-warning/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-primary">
                      {a.risk === "danger" ? "Rủi ro cao" : "Cần cảnh giác"}
                    </p>
                    <span className="text-xs text-muted-foreground">{timeAgo(a.at, now)}</span>
                  </div>
                  <p className="mt-1 text-base leading-snug text-foreground">{a.desc}</p>
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-base font-semibold text-primary-foreground"
                  >
                    <PhoneCall className="size-5" /> Gọi ngay cho {elderTitle} {elderName}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <GraduationCap className="size-6" /> Tình hình học tập
          </h2>
          <div className="mt-3 space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Award className="size-8 text-primary" />
              <div>
                <p className="text-base text-muted-foreground">Điểm tích lũy</p>
                <p className="text-3xl font-extrabold text-primary">{points} điểm</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">Bài học đã hoàn thành</span>
                <span className="font-semibold text-primary">
                  {results.length}/{TOTAL_LESSONS}
                </span>
              </div>
              <Progress value={donePercent} className="mt-2 h-3" />
            </div>
            <p className="text-base text-foreground">
              Trả lời đúng <strong className="text-success">{correct}</strong>/{total || 0} câu hỏi.
            </p>
            <ul className="space-y-2">
              {results.length === 0 ? (
                <li className="text-base text-muted-foreground">
                  {elderTitle} {elderName} chưa hoàn thành bài học nào.
                </li>
              ) : (
                results.map((r) => (
                  <li
                    key={r.lessonId}
                    className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-base text-primary">{r.title}</span>
                    <span className="ml-2 shrink-0 text-base font-bold text-success">
                      {r.correct}/{r.total}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ShieldCheck className="size-6" /> Hoạt động gần đây của {elderTitle} {elderName}
          </h2>
          <ul className="mt-3 space-y-3">
            {activities.length === 0 ? (
              <li className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
                Chưa có hoạt động nào.
              </li>
            ) : (
              activities.slice(0, 8).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <UserRound className="size-6 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary">{a.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at, now)}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary">Người thân cùng theo dõi</h2>
          <ul className="mt-3 space-y-3">
            {relatives.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-lg font-bold text-primary">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-primary">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.rel} · {p.phone}
                  </p>
                </div>
                <a
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  aria-label={`Gọi ${p.name}`}
                  className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <PhoneCall className="size-6" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
