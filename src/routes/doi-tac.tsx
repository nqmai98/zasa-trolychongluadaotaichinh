import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { Download, FlaskConical, LogOut, ShieldBan, TrendingUp, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/zasa-shield.png";
import {
  PARTNER_STATS,
  buildEsgCsv,
  formatNumber,
  formatVndCompact,
  type PartnerType,
} from "@/lib/mock-partner";
import { useRole } from "@/lib/zasa-store";

export const Route = createFileRoute("/doi-tac")({
  head: () => ({
    meta: [
      { title: "Bảng điều khiển Đối tác — ZASA" },
      {
        name: "description",
        content:
          "Bảng điều khiển dành cho ngân hàng, bảo hiểm, nhà mạng: số vụ lừa đảo đã chặn, số tiền được bảo vệ và mức cải thiện kỹ năng an toàn (số liệu minh họa).",
      },
      { property: "og:title", content: "Bảng điều khiển Đối tác — ZASA" },
    ],
  }),
  component: PartnerDashboard,
});

const TYPES: PartnerType[] = ["bank", "insurance", "telco"];
const SAMPLE_NOTE = "Số liệu minh họa";

function PartnerDashboard() {
  const navigate = useNavigate();
  const { logout } = useRole();
  const [type, setType] = useState<PartnerType>("bank");
  const s = PARTNER_STATS[type];
  const topCase = s.scamTypes[0];
  const growth = Math.round(
    ((s.monthly.at(-1)!.cases - s.monthly[0]!.cases) / s.monthly[0]!.cases) * 100,
  );

  const exportEsg = () => {
    const csv = buildEsgCsv(type, new Date());
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bao-cao-esg-zasa-${type}-so-lieu-minh-hoa.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất báo cáo ESG (số liệu minh họa)");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col bg-background pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
        <img src={logo} alt="" width={768} height={768} className="size-10" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Đối tác</h1>
          <p className="text-sm text-muted-foreground">Bảng điều khiển tác động của ZASA</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/chon-vai-tro", replace: true });
          }}
          aria-label="Đăng xuất"
          className="grid size-11 place-items-center rounded-full bg-secondary text-primary"
        >
          <LogOut className="size-5" />
        </button>
      </header>

      <main className="flex-1 space-y-6 px-4 py-5">
        <p className="flex items-start gap-3 rounded-2xl border border-warning/50 bg-warning/15 p-4 text-base text-foreground">
          <FlaskConical className="mt-0.5 size-5 shrink-0 text-warning-foreground dark:text-warning" />
          <span>
            <strong>{SAMPLE_NOTE}.</strong> Mọi con số trên trang này là dữ liệu mẫu cho bản thử
            nghiệm, không phải dữ liệu thật của người dùng hay đối tác.
          </span>
        </p>

        {/* Bộ lọc: một hàng phía trên toàn bộ biểu đồ */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="radiogroup"
            aria-label="Loại đối tác"
            className="inline-flex rounded-full border border-border bg-muted p-1"
          >
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`rounded-full px-4 py-2 text-base font-semibold ${
                  type === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
                }`}
              >
                {PARTNER_STATS[t].label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportEsg}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-base font-bold text-primary-foreground shadow-soft"
          >
            <Download className="size-5" /> Xuất báo cáo ESG
          </button>
        </div>
        <p className="-mt-3 text-sm text-muted-foreground">
          Giai đoạn: 6 tháng gần nhất (T5–T10/2026)
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile icon={ShieldBan} label="Vụ lừa đảo đã chặn" value={formatNumber(s.blocked)} />
          <StatTile
            icon={Wallet}
            label="Số tiền được bảo vệ"
            value={`${formatVndCompact(s.protectedVnd)} ₫`}
            hint={`${formatNumber(s.protectedVnd)} VNĐ`}
          />
          <StatTile
            icon={Users}
            label="Người cao tuổi được bảo vệ"
            value={formatNumber(s.usersProtected)}
          />
          <StatTile icon={TrendingUp} label="Cảnh báo được làm theo" value={`${s.followRate}%`} />
        </div>

        <ChartCard
          title="Các loại lừa đảo phổ biến nhất"
          subtitle={`Số vụ đã chặn theo loại · nhiều nhất: ${topCase?.name}`}
          table={{
            head: ["Loại lừa đảo", "Số vụ"],
            rows: s.scamTypes.map((t) => [t.name, formatNumber(t.cases)]),
          }}
        >
          <ResponsiveContainer width="100%" height={s.scamTypes.length * 52 + 24}>
            <BarChart
              data={s.scamTypes}
              layout="vertical"
              margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
              barCategoryGap={10}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis
                type="number"
                tickFormatter={formatNumber}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={<WrappedTick />}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                content={<ChartTooltip unit="vụ" />}
              />
              <Bar dataKey="cases" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Xu hướng theo tháng"
          subtitle={`Số vụ lừa đảo đã chặn mỗi tháng · tăng ${growth}% sau 6 tháng`}
          table={{
            head: ["Tháng", "Số vụ đã chặn"],
            rows: s.monthly.map((m) => [m.month, formatNumber(m.cases)]),
          }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={s.monthly} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="month"
                tickFormatter={(m: string) => m.replace("/2026", "")}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                content={<ChartTooltip unit="vụ" />}
              />
              <Bar
                dataKey="cases"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">Mức cải thiện kỹ năng an toàn</h2>
              <p className="text-sm text-muted-foreground">
                So sánh trước khi dùng ZASA và sau 3 tháng học, kiểm tra
              </p>
            </div>
            <SampleBadge />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground" aria-hidden>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-muted-foreground/40" /> Trước khi dùng ZASA
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-primary" /> Sau 3 tháng
            </span>
          </div>

          <ul className="mt-4 space-y-5">
            {s.skills.map((k) => {
              return (
                <li key={k.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-base font-semibold text-foreground">{k.label}</p>
                    <p className="shrink-0 text-sm font-bold text-success">
                      +{k.after - k.before} {k.unit === "%" ? "điểm %" : "điểm"}
                    </p>
                  </div>
                  <SkillBar
                    label="Trước"
                    value={k.before}
                    unit={k.unit}
                    className="bg-muted-foreground/40"
                  />
                  <SkillBar label="Sau" value={k.after} unit={k.unit} className="bg-primary" />
                </li>
              );
            })}
          </ul>
        </section>

        <p className="text-center text-sm text-muted-foreground">
          {SAMPLE_NOTE} · ZASA bản thử nghiệm
        </p>
      </main>
    </div>
  );
}

function SampleBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-foreground">
      <FlaskConical className="size-3.5" /> {SAMPLE_NOTE}
    </span>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-soft" title={hint}>
      <Icon className="size-6 text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint ?? SAMPLE_NOTE}</p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  table,
  children,
}: {
  title: string;
  subtitle: string;
  table: { head: string[]; rows: string[][] };
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <SampleBadge />
      </div>
      <div className="mt-4">{children}</div>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-primary">
          Xem dạng bảng
        </summary>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {table.head.map((h, i) => (
                <th key={h} className={`py-2 font-semibold ${i ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r[0]} className="border-b border-border last:border-0">
                {r.map((c, i) => (
                  <td
                    key={i}
                    className={`py-2 text-foreground ${i ? "text-right tabular-nums" : ""}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  const value = payload?.[0]?.value;
  if (!active || value === undefined) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm shadow-soft">
      <p className="font-semibold text-popover-foreground">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-bold text-popover-foreground tabular-nums">
          {formatNumber(Number(value))}
        </span>{" "}
        {unit}
      </p>
    </div>
  );
}

/** Nhãn trục danh mục tự xuống dòng (tên loại lừa đảo khá dài trên điện thoại). */
function WrappedTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const words = (payload?.value ?? "").split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 18 && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 2);
  return (
    <text x={x - 6} y={y} textAnchor="end" fill="var(--color-foreground)" fontSize={12}>
      {shown.map((l, i) => (
        <tspan key={i} x={x - 6} dy={i === 0 ? (shown.length > 1 ? -4 : 4) : 14}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

function SkillBar({
  label,
  value,
  unit,
  className,
}: {
  label: string;
  value: number;
  unit: string;
  className: string;
}) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <span className="w-10 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
        {value}
        {unit === "%" ? "%" : " điểm"}
      </span>
    </div>
  );
}
