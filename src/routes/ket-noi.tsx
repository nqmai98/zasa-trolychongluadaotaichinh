import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, PhoneCall, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useActivities, useRelatives, useAddress } from "@/lib/zasa-store";

export const Route = createFileRoute("/ket-noi")({
  head: () => ({
    meta: [
      { title: "Kết nối người thân — ZASA" },
      {
        name: "description",
        content: "Ông bà và con cháu kết nối với nhau để cùng theo dõi và cảnh báo lừa đảo kịp thời.",
      },
      { property: "og:title", content: "Kết nối người thân — ZASA" },
      { property: "og:description", content: "Kết nối với con cháu để nhận cảnh báo lừa đảo kịp thời." },
    ],
  }),
  component: Connect,
});

function Connect() {
  const { relatives, add, remove } = useRelatives();
  const { log } = useActivities();
  const { you } = useAddress();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [rel, setRel] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText("ZS-4821");
      setCopied(true);
      toast.success("Đã sao chép mã ZS-4821");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Không sao chép được, ${you} ghi tay mã ZS-4821 nhé`);
    }
  };

  const addRelative = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error(`${you === "ông" ? "Ông" : "Bà"} nhập họ tên và số điện thoại nhé`);
      return;
    }
    add({ name: name.trim(), rel: rel.trim() || "Người thân", phone: phone.trim() });
    log({
      kind: "connect",
      title: "Đã kết nối với người thân",
      desc: `${name.trim()} · ${phone.trim()}`,
    });
    setName("");
    setRel("");
    setPhone("");
    setAdding(false);
    toast.success(`Đã thêm ${name.trim()} vào danh sách`);
  };

  const removeRelative = (id: string, who: string) => {
    remove(id);
    log({ kind: "connect", title: "Đã xóa kết nối người thân", desc: who });
    toast.success(`Đã xóa ${who} khỏi danh sách`);
  };

  return (
    <AppShell title="Kết nối người thân" back="/trang-chu">
      <div className="space-y-4">
        <div className="rounded-3xl bg-secondary p-6 text-center shadow-soft">
          <p className="text-lg text-secondary-foreground">Mã kết nối của {you}</p>
          <p className="mt-2 text-4xl font-extrabold tracking-[0.2em] text-primary">ZS-4821</p>
          <button
            type="button"
            onClick={copyCode}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-base font-semibold text-primary"
          >
            {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
            {copied ? "Đã sao chép" : "Sao chép mã"}
          </button>
        </div>

        <p className="text-lg leading-relaxed text-foreground">
          {you === "ông" ? "Ông" : "Bà"} đọc mã này cho con cháu để họ nhận cảnh báo khi{" "}
          {you} gặp tin nhắn đáng ngờ.
        </p>

        <h2 className="text-xl font-bold text-primary">Người thân đã kết nối</h2>
        <ul className="space-y-3">
          {relatives.length === 0 ? (
            <li className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
              Chưa có người thân nào được kết nối.
            </li>
          ) : (
            relatives.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-lg font-bold text-primary">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-primary">{p.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {p.rel} · {p.phone}
                  </p>
                </div>
                <a
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  aria-label={`Gọi ${p.name}`}
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <PhoneCall className="size-6" />
                </a>
                <button
                  type="button"
                  onClick={() => removeRelative(p.id, p.name)}
                  aria-label={`Xóa kết nối ${p.name}`}
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive"
                >
                  <Trash2 className="size-6" />
                </button>
              </li>
            ))
          )}
        </ul>

        {adding ? (
          <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-primary">Thêm người thân</p>
              <button
                type="button"
                onClick={() => setAdding(false)}
                aria-label="Đóng"
                className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ tên (VD: Cháu Hùng)"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-lg outline-none focus:border-primary"
            />
            <input
              value={rel}
              onChange={(e) => setRel(e.target.value)}
              placeholder="Quan hệ (VD: Cháu trai)"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-lg outline-none focus:border-primary"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              inputMode="tel"
              className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-lg outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={addRelative}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-bold text-primary-foreground"
            >
              <UserPlus className="size-5" /> Lưu người thân
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-xl font-bold text-primary shadow-soft"
          >
            <UserPlus className="size-6" /> Thêm người thân
          </button>
        )}
      </div>
    </AppShell>
  );
}
