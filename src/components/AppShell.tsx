import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ROLE_HOME, useRole } from "@/lib/zasa-store";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  back,
  backSearch,
  children,
}: {
  title?: string;
  back?: string;
  backSearch?: Record<string, string>;
  children: ReactNode;
}) {
  const { role } = useRole();
  // Các trang dùng chung (Hồ sơ, Cài đặt, Hỗ trợ) quay về đúng màn hình chính của từng vai trò;
  // thanh điều hướng dưới chỉ dành cho người cao tuổi.
  const elder = role !== "family" && role !== "partner";
  const backTo = back === "/trang-chu" && role ? ROLE_HOME[role] : back;

  return (
    <div
      className={`mx-auto flex min-h-screen max-w-lg flex-col bg-background ${elder ? "pb-24" : "pb-10"}`}
    >
      {title ? (
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
          {backTo ? (
            <Link
              to={backTo}
              {...(backSearch ? { search: backSearch } : {})}
              aria-label="Quay lại"
              className="grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
            >
              <ChevronLeft className="size-6" />
            </Link>
          ) : null}
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
        </header>
      ) : null}
      <main className="flex-1 px-4 py-5">{children}</main>
      {elder ? <BottomNav /> : null}
    </div>
  );
}
