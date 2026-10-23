import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { BellRing, Hand, MessageCircle, PhoneCall, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CHECK_COPY, checkedFacts, evaluateCheck, parseResultSearch } from "@/lib/check-result";
import { RISK_LEVELS } from "@/lib/risk-levels";
import { useActivities, useAddress, useAlertSettings } from "@/lib/zasa-store";

export const Route = createFileRoute("/ket-qua")({
  validateSearch: parseResultSearch,
  head: () => ({
    meta: [
      { title: "Kết quả kiểm tra — ZASA" },
      {
        name: "description",
        content: "Mức độ rủi ro lừa đảo của nội dung vừa kiểm tra cùng các bước xử lý an toàn.",
      },
      { property: "og:title", content: "Kết quả kiểm tra — ZASA" },
      {
        property: "og:description",
        content: "Biết ngay nên tin, cần cảnh giác hay là lừa đảo.",
      },
    ],
  }),
  component: Result,
});

function Result() {
  const search = Route.useSearch();
  const type = search.type ?? "msg";
  const { log } = useActivities();
  const { you, You } = useAddress();
  const { alerts } = useAlertSettings();
  const logged = useRef(false);

  const verdict = evaluateCheck(search);
  const facts = checkedFacts(search);
  const copy = CHECK_COPY[type];
  const level = RISK_LEVELS[verdict.level];
  const Icon = level.icon;
  const action = copy.activity.replace(/^Đã /, "");
  const reasons = verdict.reasons.map((r) => r.replace(/\.$/, "")).join("; ");
  const askAi = `ZASA báo "${level.short}" khi tôi ${action.charAt(0).toLowerCase()}${action.slice(1)}. Lý do: ${reasons}. Tôi nên làm gì?`;

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    log({
      kind: "scan",
      risk: verdict.level,
      title: copy.activity,
      desc: `${level.short}: ${facts
        .map((f) => f.value)
        .join(" · ")
        .slice(0, 90)}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell title="Kết quả" back="/kiem-tra" backSearch={{ tab: type }}>
      {/* 1. Mức cảnh báo */}
      <div
        role="status"
        className={`flex items-center gap-4 rounded-3xl p-5 shadow-soft ${level.banner}`}
      >
        <Icon className="size-14 shrink-0" />
        <div>
          <p className="text-2xl font-extrabold leading-tight">{level.label}</p>
          <p className="mt-1 text-lg font-semibold leading-snug">{level.headline}</p>
        </div>
      </div>

      {/* 2. Thông tin đã kiểm tra */}
      {facts.length ? (
        <dl className="mt-5 space-y-2 rounded-2xl border border-border bg-card p-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-sm font-semibold text-muted-foreground">{f.label}</dt>
              <dd className="break-words text-lg leading-relaxed text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* 3. Lý do */}
      <h2 className="mt-6 text-xl font-bold text-primary">Vì sao ZASA kết luận như vậy?</h2>
      <ul className="mt-2 space-y-2">
        {verdict.reasons.map((r) => (
          <li
            key={r}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-lg text-foreground ${level.soft}`}
          >
            <Icon className={`mt-0.5 size-6 shrink-0 ${level.iconColor}`} />
            {r}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">{verdict.note}</p>

      {/* 4. Việc nên làm */}
      <h2 className="mt-6 text-xl font-bold text-primary">{You} nên làm gì tiếp theo?</h2>
      <ol className="mt-2 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-foreground">
        {copy.steps[verdict.level](you).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      {verdict.level === "danger" ? (
        <p
          className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-base text-foreground ${level.soft}`}
        >
          <BellRing className={`mt-0.5 size-6 shrink-0 ${level.iconColor}`} />
          {alerts.autoNotifyFamily
            ? `Con cháu đã kết nối với ${you} đã nhận được cảnh báo này.`
            : `${You} đang tắt tự động báo người thân, hãy bấm nút bên dưới để báo.`}
        </p>
      ) : null}

      <p className="mt-6 flex items-start gap-3 text-lg font-semibold leading-snug text-foreground">
        <Hand className="mt-0.5 size-6 shrink-0 text-primary" />
        ZASA giúp {you} dừng lại và kiểm tra, quyết định cuối cùng là của {you}.
      </p>

      {/* 5. Hành động */}
      <div className="mt-6 space-y-3">
        {verdict.level === "danger" ? (
          <Link
            to="/ket-noi"
            className={`flex min-h-16 items-center justify-center gap-2 rounded-full text-xl font-bold shadow-soft ${level.banner} py-2 px-4 text-center leading-snug`}
          >
            <PhoneCall className="size-6" /> Báo cho người thân
          </Link>
        ) : null}
        {verdict.level === "warn" ? (
          <Link
            to="/ket-noi"
            className="flex min-h-16 items-center justify-center gap-2 rounded-full border-2 border-primary bg-card text-xl font-bold text-primary shadow-soft py-2 px-4 text-center leading-snug"
          >
            <PhoneCall className="size-6" /> Hỏi ý kiến người thân
          </Link>
        ) : null}
        {verdict.level !== "safe" ? (
          <Link
            to="/chat"
            search={{ q: askAi }}
            className="flex min-h-16 items-center justify-center gap-2 rounded-full border border-border bg-card text-xl font-bold text-primary shadow-soft py-2 px-4 text-center leading-snug"
          >
            <MessageCircle className="size-6" /> Hỏi trợ lý AI
          </Link>
        ) : null}
        <Link
          to="/kiem-tra"
          search={{ tab: type }}
          className={`flex min-h-16 items-center justify-center gap-2 rounded-full px-4 py-2 text-center text-xl font-bold leading-snug shadow-soft ${
            verdict.level === "safe"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-primary"
          }`}
        >
          <RotateCcw className="size-6" /> {copy.again}
        </Link>
      </div>
    </AppShell>
  );
}
