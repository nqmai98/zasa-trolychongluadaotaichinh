import { Link } from "@tanstack/react-router";
import { Home, MessageCircle, GraduationCap, ShieldCheck, Users } from "lucide-react";

const items = [
  { to: "/trang-chu", label: "Trang chủ", icon: Home },
  { to: "/chat", label: "Chat AI", icon: MessageCircle },
  { to: "/bai-hoc", label: "Bài học", icon: GraduationCap },
  { to: "/kiem-tra", label: "Kiểm tra", icon: ShieldCheck },
  { to: "/ket-noi", label: "Kết nối", icon: Users },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg justify-between border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-soft">
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors"
          activeProps={{ className: "text-primary font-semibold" }}
        >
          <Icon className="size-6" aria-hidden />
          <span className="text-[11px] leading-tight">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
