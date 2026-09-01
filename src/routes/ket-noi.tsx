import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, Copy, PhoneCall, ShieldCheck, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/ket-noi")({
  head: () => ({
    meta: [
      { title: "Kết nối người thân — ZASA" },
      {
        name: "description",
        content: "Ông bà và con cháu kết nối với nhau để cùng theo dõi và cảnh báo lừa đảo kịp thời.",
      },
      { property: "og:title", content: "Kết nối người thân — ZASA" },
      { property: "og:description", content: "Hai giao diện: dành cho ông bà và dành cho người thân." },
    ],
  }),
  component: Connect,
});

function Connect() {
  const [tab, setTab] = useState<"ongba" | "nguoithan">("ongba");

  return (
    <AppShell title="Kết nối người thân" back="/trang-chu">
      <div className="grid grid-cols-2 gap-2 rounded-full bg-secondary p-1.5">
        {(
          [
            ["ongba", "Ông bà"],
            ["nguoithan", "Người thân"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`h-12 rounded-full text-lg font-bold transition-colors ${
              tab === key ? "bg-primary text-primary-foreground shadow-soft" : "text-secondary-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "ongba" ? <GrandparentView /> : <RelativeView />}
    </AppShell>
  );
}

function GrandparentView() {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-3xl bg-secondary p-6 text-center shadow-soft">
        <p className="text-lg text-secondary-foreground">Mã kết nối của bà</p>
        <p className="mt-2 text-4xl font-extrabold tracking-[0.2em] text-primary">ZS-4821</p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-base font-semibold text-primary"
        >
          <Copy className="size-5" /> Sao chép mã
        </button>
      </div>

      <p className="text-lg leading-relaxed text-foreground">
        Bà đọc mã này cho con cháu để họ nhận cảnh báo khi bà gặp tin nhắn đáng ngờ.
      </p>

      <h2 className="text-xl font-bold text-primary">Người thân đã kết nối</h2>
      <ul className="space-y-3">
        {[
          { name: "Cháu Minh", rel: "Cháu trai", phone: "0901 234 567" },
          { name: "Chị Lan", rel: "Con gái", phone: "0912 888 456" },
        ].map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-lg font-bold text-primary">
              {p.name.charAt(0)}
            </div>
            <div className="flex-1">
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

      <button
        type="button"
        className="flex h-16 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-xl font-bold text-primary shadow-soft"
      >
        <UserPlus className="size-6" /> Thêm người thân
      </button>
    </div>
  );
}

function RelativeView() {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <p className="text-sm text-muted-foreground">Đang theo dõi</p>
        <p className="text-2xl font-extrabold text-primary">Bà Nguyễn Thị Hồng</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            ["12", "Tin đã kiểm tra"],
            ["2", "Cảnh báo"],
            ["5", "Bài học"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-secondary p-3">
              <p className="text-2xl font-bold text-primary">{n}</p>
              <p className="text-xs text-secondary-foreground">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary">Cảnh báo gần đây</h2>
      <ul className="space-y-3">
        <li className="rounded-2xl border border-destructive/40 bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 font-bold text-destructive">
            <BellRing className="size-5" /> Tin nhắn nguy hiểm
          </p>
          <p className="mt-1 text-base text-foreground">
            “Chúc mừng bà trúng thưởng 500 triệu…” — bà Hồng đã được cảnh báo kịp thời.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Hôm nay, 09:12</p>
        </li>
        <li className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 font-bold text-success">
            <ShieldCheck className="size-5" /> Tin nhắn an toàn
          </p>
          <p className="mt-1 text-base text-foreground">Thông báo dịch vụ từ nhà mạng.</p>
          <p className="mt-1 text-xs text-muted-foreground">Hôm qua, 18:40</p>
        </li>
      </ul>

      <button
        type="button"
        className="flex h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-soft"
      >
        <PhoneCall className="size-6" /> Gọi cho bà ngay
      </button>
    </div>
  );
}
