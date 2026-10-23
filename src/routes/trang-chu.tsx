import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, GraduationCap, ShieldCheck, UserPlus, Award } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AvatarMenu } from "@/components/AvatarMenu";
import { useAddress, useProfile, usePoints } from "@/lib/zasa-store";

export const Route = createFileRoute("/trang-chu")({
  head: () => ({
    meta: [
      { title: "Trang chủ — ZASA" },
      {
        name: "description",
        content: "Bảng điều khiển ZASA: chat AI, bài học, kiểm tra lừa đảo và kết nối người thân.",
      },
      { property: "og:title", content: "Trang chủ — ZASA" },
      {
        property: "og:description",
        content: "Mọi công cụ phòng chống lừa đảo trong một màn hình.",
      },
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
    desc: "Dán tin nhắn hoặc tải ảnh để quét",
    icon: ShieldCheck,
  },
  {
    to: "/ket-noi",
    label: "Kết nối người thân",
    desc: "Con cháu cùng nhận cảnh báo",
    icon: UserPlus,
  },
] as const;

function greeting(hour: number) {
  if (hour < 11) return { text: "Chào buổi sáng", emoji: "🌤️" };
  if (hour < 14) return { text: "Chào buổi trưa", emoji: "☀️" };
  if (hour < 18) return { text: "Chào buổi chiều", emoji: "🌇" };
  return { text: "Chào buổi tối", emoji: "🌙" };
}

function Home() {
  const { profile } = useProfile();
  const { title } = useAddress();
  const { points } = usePoints();
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setHour(new Date().getHours());
    update();
    const t = setInterval(update, 15_000);
    return () => clearInterval(t);
  }, []);

  const g = hour === null ? { text: "Xin chào", emoji: "👋" } : greeting(hour);

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4 pt-2">
        <h1 className="text-3xl font-extrabold leading-snug text-primary">
          {g.text}, {g.emoji}
          <br />
          {title}!
        </h1>
        <AvatarMenu avatar={profile.avatar} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4 shadow-soft">
        <Award className="size-8 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-base text-muted-foreground">Điểm tích lũy khi học</p>
          <p className="text-2xl font-extrabold text-primary">{points} điểm</p>
        </div>
      </div>

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
    </AppShell>
  );
}
