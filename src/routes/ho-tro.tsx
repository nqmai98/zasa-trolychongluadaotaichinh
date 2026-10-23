import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Lightbulb, Search, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HELP_CATEGORIES, articlesFor, searchHelp } from "@/lib/help-articles";
import { useAddress, useRole } from "@/lib/zasa-store";

export const Route = createFileRoute("/ho-tro")({
  head: () => ({
    meta: [
      { title: "Hỗ trợ — ZASA" },
      {
        name: "description",
        content: "Hướng dẫn sử dụng ZASA: tra cứu cách dùng từng tính năng, cài đặt và dữ liệu.",
      },
      { property: "og:title", content: "Hỗ trợ — ZASA" },
      { property: "og:description", content: "Tự tra cứu cách dùng ZASA trong vài giây." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { You, addr } = useAddress();
  const { role } = useRole();
  const articles = useMemo(() => articlesFor(role === "family" ? "family" : "elder"), [role]);
  const categories = HELP_CATEGORIES.filter((c) => articles.some((a) => a.category === c.id));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const results = useMemo(() => {
    const inCategory = category ? articles.filter((a) => a.category === category) : articles;
    return searchHelp(query, inCategory);
  }, [query, category, articles]);

  const grouped = categories
    .map((c) => ({
      ...c,
      articles: results.filter((a) => a.category === c.id),
    }))
    .filter((c) => c.articles.length);

  return (
    <AppShell title="Hỗ trợ" back="/trang-chu">
      <p className="text-lg leading-relaxed text-foreground">
        {You} cần giúp về cách dùng ZASA? Gõ điều {addr("{you}")} muốn tìm, hoặc chọn một chủ đề bên
        dưới.
      </p>

      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Search className="size-6 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ví dụ: cỡ chữ, mã QR, người thân…"
          aria-label="Tìm hướng dẫn"
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Xóa từ khóa"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      <div role="radiogroup" aria-label="Chủ đề" className="mt-4 flex flex-wrap gap-2">
        {[{ id: null, label: "Tất cả" }, ...categories].map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-4 py-2 text-base font-semibold ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-primary"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground">
          Chưa có hướng dẫn nào khớp với “{query}”. {You} thử từ khóa ngắn hơn, hoặc chọn “Tất cả”
          nhé.
        </p>
      ) : null}

      {grouped.map(({ id, label, icon: Icon, articles }) => (
        <section key={id} className="mt-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
            <Icon className="size-6" /> {label}
          </h2>
          <ul className="mt-3 space-y-2">
            {articles.map((a) => {
              const expanded = open === a.id;
              return (
                <li
                  key={a.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : a.id)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <span className="flex-1 text-lg font-bold text-foreground">
                      {addr(a.title)}
                    </span>
                    <ChevronDown
                      className={`size-6 shrink-0 text-muted-foreground transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded ? (
                    <div className="space-y-3 border-t border-border px-4 pb-4 pt-3">
                      <ol className="list-decimal space-y-2 pl-6 text-lg leading-relaxed text-foreground">
                        {a.steps.map((s) => (
                          <li key={s}>{addr(s)}</li>
                        ))}
                      </ol>
                      {a.tip ? (
                        <p className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-base text-secondary-foreground">
                          <Lightbulb className="mt-0.5 size-5 shrink-0" />
                          {addr(a.tip)}
                        </p>
                      ) : null}
                      {a.link ? (
                        <Link
                          to={a.link.to}
                          className="inline-flex items-center gap-1 text-lg font-semibold text-primary underline underline-offset-4"
                        >
                          {a.link.label} <ChevronRight className="size-5" />
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Hướng dẫn dành cho bản thử nghiệm ZASA.
        <br />
        {role === "family"
          ? "Cảnh báo của ông bà luôn hiện ở màn hình chính."
          : `Gặp tin nhắn, cuộc gọi đáng ngờ? ${You} dùng mục Kiểm tra hoặc Chat AI nhé.`}
      </p>
    </AppShell>
  );
}
