import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, GraduationCap, ShieldCheck, UserPlus, UserCircle2, Award } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useProfile, usePoints } from "@/lib/zasa-store";

export const Route = createFileRoute("/trang-chu")({
  head: () => ({
    meta: [
      { title: "Trang chủ — ZASA" },
      {
        name: "description",
        content: "Bảng điều khiển ZASA: chat AI, bài học, kiểm tra lừa đảo và kết nối người thân.",
      },
      { property: "og:title", content: "Trang chủ — ZASA" },
      { property: "og:description", content: "Mọi công cụ phòng chống lừa đảo trong một màn hình." },
    ],
  }),
  component: Home,
});

const tiles = [
  {
    to: "/chat",
    label: "Chat AI",
    desc: "Hỏi trợ lý bất cứ điều gì đáng ngờ",
    icon: MessageCircle,
  },
  {
    to: "/bai-hoc",
    label: "Bài học",
    desc: "Bài ngắn 3-7 phút, chữ to dễ đọc",
    icon: GraduationCap,
  },
  {
    to: "/kiem-tra",
    label: "Kiểm tra lừa đảo",
    desc: "Dán tin nhắn để quét dấu hiệu lừa đảo",
    icon: ShieldCheck,
  },
  {
    to: "/ket-noi",
    label: "Kết nối người thân",
    desc: "Con cháu nhận cảnh báo giúp ông bà",
    icon: UserPlus,
  },
] as const;

const activities = [
  { icon: GraduationCap, title: "Đã hoàn thành bài học", desc: "Nhận biết cơ bản về các chiêu trò lừa đảo", time: "5 phút trước" },
  { icon: ShieldCheck, title: "Đã kiểm tra lừa đảo", desc: "Kiểm tra tin nhắn từ nhà mạng: AN TOÀN", time: "8 giờ trước" },
  { icon: UserPlus, title: "Đã gửi kết nối với người thân", desc: "Bạn đã kết nối với liên hệ: Cháu Minh", time: "Hôm qua" },
  { icon: MessageCircle, title: "Đã trò chuyện với trợ lý ZASA", desc: "Hỏi về tin nhắn trúng thưởng", time: "2 ngày trước" },
];

function greeting(hour: number) {
  if (hour < 11) return { text: "Chào buổi sáng", emoji: "🌤️" };
  if (hour < 14) return { text: "Chào buổi trưa", emoji: "☀️" };
  if (hour < 18) return { text: "Chào buổi chiều", emoji: "🌇" };
  return { text: "Chào buổi tối", emoji: "🌙" };
}

function Home() {
  const { profile } = useProfile();
  const { points } = usePoints();
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  const g = hour === null ? { text: "Xin chào", emoji: "👋" } : greeting(hour);

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4 pt-2">
        <h1 className="text-3xl font-extrabold leading-snug text-primary">
          {g.text}, {g.emoji}
          <br />
          {profile.name}!
        </h1>
        <Link
          to="/ho-so"
          aria-label="Mở hồ sơ của tôi"
          className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-primary"
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="Ảnh đại diện" className="size-full object-cover" />
          ) : (
            <UserCircle2 className="size-11" strokeWidth={1.5} />
          )}
        </Link>
      </div>

      <Link
        to="/ho-so"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4 shadow-soft active:scale-95"
      >
        <Award className="size-8 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-base text-muted-foreground">Điểm tích lũy khi học</p>
          <p className="text-2xl font-extrabold text-primary">{points} điểm</p>
        </div>
        <span className="text-base font-semibold text-primary">Xem hồ sơ ▸</span>
      </Link>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {tiles.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft transition-transform active:scale-95"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <Icon className="size-8" strokeWidth={1.75} />
            </span>
            <span className="text-xl font-bold leading-tight text-primary">{label}</span>
            <span className="text-sm leading-snug text-muted-foreground">{desc}</span>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-2xl font-bold text-primary">
        Hoạt động gần đây <span aria-hidden>▶</span>
      </h2>
      <ul className="mt-3 space-y-3">
        {activities.map(({ icon: Icon, title, desc, time }) => (
          <li
            key={title}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <Icon className="size-7 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-primary">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{desc}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
