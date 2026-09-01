import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  back,
  children,
}: {
  title?: string;
  back?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background pb-24">
      {title ? (
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
          {back ? (
            <Link
              to={back}
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
      <BottomNav />
    </div>
  );
}
