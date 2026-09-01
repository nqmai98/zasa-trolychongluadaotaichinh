import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, GraduationCap, ShieldCheck, UserPlus, UserCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import logo from "@/assets/zasa-shield.png";

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
  { to: "/chat", label: "Chat AI", icon: MessageCircle, bg: "bg-accent", fg: "text-accent-foreground" },
  { to: "/bai-hoc", label: "Bài học", icon: GraduationCap, bg: "bg-secondary", fg: "text-secondary-foreground" },
  { to: "/kiem-tra", label: "Kiểm tra lừa đảo", icon: ShieldCheck, bg: "bg-secondary", fg: "text-secondary-foreground" },
  { to: "/ket-noi", label: "Kết nối người thân", icon: UserPlus, bg: "bg-secondary", fg: "text-secondary-foreground" },
] as const;

const activities = [
  { icon: GraduationCap, title: "Đã hoàn thành bài học", desc: "Nhận biết cơ bản về các chiêu trò lừa đảo", time: "5 phút trước" },
  { icon: ShieldCheck, title: "Đã kiểm tra lừa đảo", desc: "Kiểm tra tin nhắn từ nhà mạng: AN TOÀN", time: "8 giờ trước" },
  { icon: UserPlus, title: "Đã gửi kết nối với người thân", desc: "Bạn đã kết nối với liên hệ: Cháu Minh", time: "Hôm qua" },
  { icon: MessageCircle, title: "Đã trò chuyện với trợ lý ZASA", desc: "Hỏi về tin nhắn trúng thưởng", time: "2 ngày trước" },
];

function Home() {
  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4 pt-2">
        <h1 className="text-3xl font-extrabold leading-snug text-primary">
          Chào buổi sáng, 🌤️
          <br />
          Bà Hồng!
        </h1>
        <UserCircle2 className="size-11 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {tiles.map(({ to, label, icon: Icon, bg, fg }) => (
          <Link
            key={to}
            to={to}
            className={`flex aspect-square flex-col justify-between rounded-3xl ${bg} ${fg} p-5 shadow-soft transition-transform active:scale-95`}
          >
            {to === "/kiem-tra" ? (
              <img src={logo} alt="" width={768} height={768} loading="lazy" className="size-14" />
            ) : (
              <Icon className="size-14" strokeWidth={1.75} />
            )}
            <span className="text-xl font-bold leading-tight">{label}</span>
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
