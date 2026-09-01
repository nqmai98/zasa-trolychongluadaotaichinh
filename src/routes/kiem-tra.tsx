import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardPaste, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/kiem-tra")({
  head: () => ({
    meta: [
      { title: "Phân tích tin nhắn đáng ngờ — ZASA" },
      {
        name: "description",
        content: "Dán nội dung tin nhắn vào ZASA để được phân tích mức độ rủi ro lừa đảo tài chính.",
      },
      { property: "og:title", content: "Phân tích tin nhắn đáng ngờ — ZASA" },
      { property: "og:description", content: "Kiểm tra tin nhắn trong vài giây, biết ngay nên tin hay không." },
    ],
  }),
  component: Analyze,
});

const samples = [
  "Chuc mung ban da trung thuong 500 trieu. Truy cap http://qua-tang.vip de nhan.",
  "Con dang gap chuyen gap, me chuyen giup con 20 trieu vao so tai khoan nay.",
  "Ngan hang thong bao: lich su dich vu thang 9 da duoc gui den email cua quy khach.",
];

function Analyze() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/ket-qua", search: { text: text.trim() } });
    }, 900);
  }

  return (
    <AppShell title="Kiểm tra lừa đảo" back="/trang-chu">
      <p className="text-lg leading-relaxed text-foreground">
        Bà hãy sao chép tin nhắn đáng ngờ và dán vào ô bên dưới. ZASA sẽ phân tích giúp bà.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        aria-label="Nội dung tin nhắn"
        placeholder="Dán nội dung tin nhắn tại đây…"
        className="mt-4 w-full rounded-3xl border border-input bg-card p-4 text-lg leading-relaxed outline-none focus:ring-2 focus:ring-ring"
      />

      <button
        type="button"
        onClick={async () => {
          try {
            setText(await navigator.clipboard.readText());
          } catch {
            /* người dùng có thể dán thủ công */
          }
        }}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-base text-primary shadow-soft"
      >
        <ClipboardPaste className="size-5" /> Dán từ bộ nhớ tạm
      </button>

      <p className="mt-6 font-semibold text-primary">Hoặc thử một ví dụ:</p>
      <ul className="mt-2 space-y-2">
        {samples.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setText(s)}
              className="w-full rounded-2xl border border-border bg-card p-3 text-left text-base text-foreground shadow-soft"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={submit}
        disabled={loading || !text.trim()}
        className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-soft disabled:opacity-50"
      >
        <ShieldCheck className="size-7" />
        {loading ? "Đang phân tích…" : "Kiểm tra ngay"}
      </button>
    </AppShell>
  );
}
