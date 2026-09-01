import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, PhoneCall, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Search = { text: string };

export const Route = createFileRoute("/ket-qua")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    text: typeof search.text === "string" ? search.text : "",
  }),
  head: () => ({
    meta: [
      { title: "Kết quả phân tích tin nhắn — ZASA" },
      {
        name: "description",
        content: "Kết quả phân tích mức độ rủi ro của tin nhắn cùng các bước xử lý an toàn.",
      },
      { property: "og:title", content: "Kết quả phân tích tin nhắn — ZASA" },
      { property: "og:description", content: "Biết ngay tin nhắn an toàn, cần cảnh giác hay là lừa đảo." },
    ],
  }),
  component: Result,
});

const dangerWords = [
  { w: /trung thuong|trúng thưởng/i, why: "Hứa hẹn trúng thưởng bất ngờ" },
  { w: /http|\.vip|\.xyz|link/i, why: "Có đường link lạ" },
  { w: /chuyen (giup|khoan)|chuyển (giúp|khoản)|so tai khoan|số tài khoản/i, why: "Yêu cầu chuyển tiền" },
  { w: /otp|mat khau|mật khẩu/i, why: "Hỏi mã OTP hoặc mật khẩu" },
  { w: /gap|gấp|ngay lap tuc|ngay lập tức/i, why: "Tạo áp lực gấp gáp" },
];

function Result() {
  const { text } = Route.useSearch();
  const flags = dangerWords.filter((d) => d.w.test(text)).map((d) => d.why);
  const level = flags.length >= 2 ? "danger" : flags.length === 1 ? "warn" : "safe";

  const meta = {
    danger: {
      title: "NGUY HIỂM — Dấu hiệu lừa đảo",
      icon: ShieldAlert,
      cls: "bg-destructive text-destructive-foreground",
    },
    warn: {
      title: "CẦN CẢNH GIÁC",
      icon: AlertTriangle,
      cls: "bg-warning text-warning-foreground",
    },
    safe: {
      title: "AN TOÀN",
      icon: CheckCircle2,
      cls: "bg-success text-success-foreground",
    },
  }[level];
  const Icon = meta.icon;

  return (
    <AppShell title="Kết quả" back="/kiem-tra">
      <div className={`flex items-center gap-4 rounded-3xl p-6 shadow-soft ${meta.cls}`}>
        <Icon className="size-14 shrink-0" />
        <p className="text-2xl font-extrabold leading-tight">{meta.title}</p>
      </div>

      {text ? (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Tin nhắn đã kiểm tra</p>
          <p className="mt-1 text-lg leading-relaxed text-foreground">{text}</p>
        </div>
      ) : null}

      <h2 className="mt-6 text-xl font-bold text-primary">Vì sao ZASA kết luận như vậy?</h2>
      <ul className="mt-2 space-y-2">
        {(flags.length ? flags : ["Không phát hiện dấu hiệu lừa đảo phổ biến nào."]).map((f) => (
          <li
            key={f}
            className="rounded-2xl border border-border bg-card p-4 text-lg text-foreground shadow-soft"
          >
            {f}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-xl font-bold text-primary">Bà nên làm gì tiếp theo?</h2>
      <ol className="mt-2 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-foreground">
        <li>Không bấm vào đường link và không chuyển tiền.</li>
        <li>Không đọc mã OTP cho bất kỳ ai.</li>
        <li>Báo cho người thân đã kết nối trong ứng dụng.</li>
      </ol>

      <div className="mt-6 space-y-3">
        <Link
          to="/ket-noi"
          className="flex h-16 items-center justify-center gap-2 rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-soft"
        >
          <PhoneCall className="size-6" /> Báo cho người thân
        </Link>
        <Link
          to="/kiem-tra"
          className="flex h-16 items-center justify-center rounded-full border border-border bg-card text-xl font-bold text-primary shadow-soft"
        >
          Kiểm tra tin nhắn khác
        </Link>
      </div>
    </AppShell>
  );
}
