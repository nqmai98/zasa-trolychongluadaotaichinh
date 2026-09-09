import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ClipboardPaste, ImagePlus, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAddress } from "@/lib/zasa-store";

export const Route = createFileRoute("/kiem-tra")({
  head: () => ({
    meta: [
      { title: "Phân tích tin nhắn đáng ngờ — ZASA" },
      {
        name: "description",
        content:
          "Dán nội dung tin nhắn hoặc tải ảnh chụp màn hình vào ZASA để được phân tích mức độ rủi ro lừa đảo tài chính.",
      },
      { property: "og:title", content: "Phân tích tin nhắn đáng ngờ — ZASA" },
      { property: "og:description", content: "Kiểm tra tin nhắn trong vài giây, biết ngay nên tin hay không." },
    ],
  }),
  component: Analyze,
});

const samples = [
  "Chuc mung ban da trung thuong 500 trieu. Truy cap http://qua-tang.vip de nhan.",
  "Con dang gap chuyen gap, me chuyen giup con 20 trieu vao so tai khoan nay.",
  "Ngan hang thong bao: lich su dich vu thang 9 da duoc gui den email cua quy khach.",
];

function Analyze() {
  const navigate = useNavigate();
  const { you, You } = useAddress();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickImage = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn một tấm ảnh");
      return;
    }
    if (file.size > 5_000_000) {
      toast.error("Ảnh quá lớn, hãy chọn ảnh nhỏ hơn 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      toast.success("Đã tải ảnh lên, bấm Kiểm tra ngay nhé");
    };
    reader.readAsDataURL(file);
  };

  function submit() {
    if (!text.trim() && !image) return;
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/ket-qua", search: { text: text.trim(), img: image ? 1 : 0 } });
    }, 900);
  }

  return (
    <AppShell title="Kiểm tra lừa đảo" back="/trang-chu">
      <p className="text-lg leading-relaxed text-foreground">
        {You} hãy dán tin nhắn đáng ngờ vào ô bên dưới, hoặc tải ảnh chụp màn hình tin nhắn. ZASA sẽ
        phân tích giúp {you}.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        aria-label="Nội dung tin nhắn"
        placeholder="Dán nội dung tin nhắn tại đây…"
        className="mt-4 w-full rounded-3xl border border-input bg-card p-4 text-lg leading-relaxed outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={async () => {
            try {
              setText(await navigator.clipboard.readText());
            } catch {
              toast.error("Không đọc được bộ nhớ tạm, bạn dán thủ công nhé");
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-base text-primary shadow-soft"
        >
          <ClipboardPaste className="size-5" /> Dán từ bộ nhớ tạm
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-base text-primary shadow-soft"
        >
          <ImagePlus className="size-5" /> Tải ảnh tin nhắn
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickImage(e.target.files?.[0])}
        />
      </div>

      {image ? (
        <div className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <img src={image} alt="Ảnh tin nhắn đã tải lên" className="max-h-80 w-full object-contain" />
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label="Xóa ảnh"
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-destructive text-destructive-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
      ) : null}

      <p className="mt-6 font-semibold text-primary">Hoặc thử một ví dụ:</p>
      <ul className="mt-2 space-y-2">
        {samples.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setText(s)}
              className="w-full rounded-2xl border border-border bg-card p-3 text-left text-base text-foreground shadow-soft"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={submit}
        disabled={loading || (!text.trim() && !image)}
        className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-soft disabled:opacity-50"
      >
        <ShieldCheck className="size-7" />
        {loading ? "Đang phân tích…" : "Kiểm tra ngay"}
      </button>
    </AppShell>
  );
}
