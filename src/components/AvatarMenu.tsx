import { Link, useNavigate } from "@tanstack/react-router";
import { LifeBuoy, LogOut, Settings, UserCircle2, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/lib/zasa-store";

const items: { to: "/ho-so" | "/cai-dat" | "/ho-tro"; label: string; icon: LucideIcon }[] = [
  { to: "/ho-so", label: "Hồ sơ", icon: UserCircle2 },
  { to: "/cai-dat", label: "Cài đặt", icon: Settings },
  { to: "/ho-tro", label: "Hỗ trợ", icon: LifeBuoy },
];

export function AvatarMenu({ avatar }: { avatar: string }) {
  const navigate = useNavigate();
  const { logout } = useRole();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label="Mở menu tài khoản"
        className="grid size-12 place-items-center overflow-hidden rounded-full bg-secondary text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {avatar ? (
          <img src={avatar} alt="Ảnh đại diện" className="size-full object-cover" />
        ) : (
          <UserCircle2 className="size-11" strokeWidth={1.5} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-52 rounded-2xl p-2 shadow-soft"
      >
        {items.map(({ to, label, icon: Icon }) => (
          <DropdownMenuItem
            key={to}
            asChild
            className="gap-3 rounded-xl px-3 py-3 text-lg font-semibold text-foreground focus:bg-secondary focus:text-secondary-foreground [&>svg]:size-6"
          >
            <Link to={to}>
              <Icon className="text-primary" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onSelect={() => {
            logout();
            navigate({ to: "/chon-vai-tro", replace: true });
          }}
          className="gap-3 rounded-xl px-3 py-3 text-lg font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:size-6"
        >
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
