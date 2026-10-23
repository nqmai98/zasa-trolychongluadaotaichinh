import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  Banknote,
  ClipboardPaste,
  ImagePlus,
  MessageSquareText,
  Phone,
  QrCode,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { CHECK_TYPES, formatVnd, type CheckType, type ResultSearch } from "@/lib/check-result";
import { REPORTED_ACCOUNTS, REPORTED_PHONE_NUMBERS, SAMPLE_QR_PAYLOADS } from "@/lib/mock-risk";
import { useAddress } from "@/lib/zasa-store";

export const Route = createFileRoute("/kiem-tra")({
  validateSearch: (search: Record<string, unknown>): { tab?: CheckType | undefined } => ({
    tab: CHECK_TYPES.find((t) => t === search["tab"]),
  }),
  head: () => ({
    meta: [
      { title: "Kiểm tra lừa đảo — ZASA" },
      {
        name: "description",
        content:
          "Kiểm tra tin nhắn, số điện thoại, giao dịch chuyển tiền và mã QR đáng ngờ trước khi làm theo.",
      },
      { property: "og:title", content: "Kiểm tra lừa đảo — ZASA" },
      {
        property: "og:description",
        content: "Kiểm tra trong vài giây, biết ngay nên tin hay không.",
      },
    ],
  }),
  component: Analyze,
});

const tabs: { id: CheckType; label: string; icon: LucideIcon }[] = [
  { id: "msg", label: "Tin nhắn / ảnh", icon: MessageSquareText },
  { id: "phone", label: "Số điện thoại", icon: Phone },
  { id: "transfer", label: "Trước khi chuyển tiền", icon: Banknote },
  { id: "qr", label: "Quét mã QR", icon: QrCode },
];

const BANKS = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MB Bank",
  "ACB",
  "VPBank",
  "Sacombank",
  "TPBank",
];

const inputCls =
  "w-full rounded-2xl border border-input bg-card p-4 text-lg outline-none focus:ring-2 focus:ring-ring";
const chipCls =
  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-base text-primary shadow-soft";
const primaryBtnCls =
  "flex min-h-16 w-full items-center justify-center gap-2 rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-soft disabled:opacity-50 py-2 px-4 text-center leading-snug";
const secondaryBtnCls =
  "flex min-h-16 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-xl font-bold text-primary shadow-soft py-2 px-4 text-center leading-snug";

function Analyze() {
  const { tab: initialTab } = Route.useSearch();
  const [tab, setTab] = useState<CheckType>(initialTab ?? "msg");

  return (
    <AppShell title="Kiểm tra lừa đảo" back="/trang-chu">
      <div role="tablist" aria-label="Loại kiểm tra" className="grid grid-cols-2 gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex min-h-16 items-center gap-2 rounded-2xl border px-3 py-2 text-left text-base font-semibold shadow-soft ${
              tab === id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-primary"
            }`}
          >
            <Icon className="size-6 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-5">
        {tab === "msg" ? <MessageTab /> : null}
        {tab === "phone" ? <PhoneTab /> : null}
        {tab === "transfer" ? <TransferTab /> : null}
        {tab === "qr" ? <QrTab /> : null}
      </div>
    </AppShell>
  );
}

/** Chờ một nhịp như đang phân tích rồi mở màn hình Kết quả. */
function useShowResult() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const show = (search: ResultSearch) => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/ket-qua", search }), 900);
  };
  return { show, loading };
}

function SubmitButton({
  onClick,
  disabled,
  loading,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`mt-6 ${primaryBtnCls}`}
    >
      <ShieldCheck className="size-7" />
      {loading ? "Đang phân tích…" : children}
    </button>
  );
}

function Samples({
  items,
  onPick,
}: {
  items: { label: string; value: string }[];
  onPick: (v: string) => void;
}) {
  return (
    <>
      <p className="mt-6 font-semibold text-primary">Hoặc thử một ví dụ:</p>
      <ul className="mt-2 space-y-2">
        {items.map((s) => (
          <li key={s.value}>
            <button
              type="button"
              onClick={() => onPick(s.value)}
              className="w-full rounded-2xl border border-border bg-card p-3 text-left text-base text-foreground shadow-soft"
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function useImagePicker(onPicked: (dataUrl: string) => void) {
  const { you } = useAddress();
  const fileRef = useRef<HTMLInputElement>(null);
  const pick = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(`Đây không phải ảnh, ${you} chọn giúp một tấm ảnh nhé`);
      return;
    }
    if (file.size > 5_000_000) {
      toast.error(`Ảnh hơi lớn, ${you} chọn giúp ảnh nhỏ hơn 5MB nhé`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onPicked(String(reader.result));
    reader.readAsDataURL(file);
  };
  const input = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        pick(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );
  return { open: () => fileRef.current?.click(), input };
}

function ImagePreview({ src, alt, onRemove }: { src: string; alt: string; onRemove: () => void }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <img src={src} alt={alt} className="max-h-80 w-full object-contain" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Xóa ảnh"
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-destructive text-destructive-foreground"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

function Intro({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-relaxed text-foreground">{children}</p>;
}

const messageSamples = [
  "Chuc mung ban da trung thuong 500 trieu. Truy cap http://qua-tang.vip de nhan.",
  "Day la cong an quan 1. Tai khoan cua ban se bi khoa, doc ma OTP de xac minh.",
  "Ngan hang thong bao: lich su dich vu thang 9 da duoc gui den email cua quy khach.",
];

function MessageTab() {
  const { you, You } = useAddress();
  const { show, loading } = useShowResult();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const picker = useImagePicker((src) => {
    setImage(src);
    toast.success(`Đã tải ảnh lên, ${you} bấm Kiểm tra ngay nhé`);
  });

  return (
    <>
      <Intro>
        {You} hãy dán tin nhắn đáng ngờ vào ô bên dưới, hoặc tải ảnh chụp màn hình tin nhắn. ZASA sẽ
        phân tích giúp {you}.
      </Intro>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
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
              toast.error(`Không đọc được bộ nhớ tạm, ${you} dán tay vào ô bên dưới nhé`);
            }
          }}
          className={chipCls}
        >
          <ClipboardPaste className="size-5" /> Dán từ bộ nhớ tạm
        </button>
        <button type="button" onClick={picker.open} className={chipCls}>
          <ImagePlus className="size-5" /> Tải ảnh tin nhắn
        </button>
        {picker.input}
      </div>

      {image ? (
        <ImagePreview src={image} alt="Ảnh tin nhắn đã tải lên" onRemove={() => setImage(null)} />
      ) : null}

      <Samples items={messageSamples.map((s) => ({ label: s, value: s }))} onPick={setText} />

      <SubmitButton
        onClick={() =>
          show({ type: "msg", text: text.trim() || undefined, img: image ? 1 : undefined })
        }
        disabled={!text.trim() && !image}
        loading={loading}
      >
        Kiểm tra ngay
      </SubmitButton>
    </>
  );
}

function PhoneTab() {
  const { You } = useAddress();
  const { show, loading } = useShowResult();
  const [phone, setPhone] = useState("");

  const ready = phone.replace(/\D/g, "").length >= 9;
  const submit = () => ready && show({ type: "phone", phone: phone.trim() });

  return (
    <>
      <Intro>
        {You} nhập số điện thoại vừa gọi hoặc nhắn tin đáng ngờ. ZASA sẽ đối chiếu với danh sách số
        bị báo cáo.
      </Intro>

      <input
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        aria-label="Số điện thoại"
        placeholder="Ví dụ: 0900 000 001"
        className={`mt-4 ${inputCls}`}
      />

      <Samples
        items={Object.keys(REPORTED_PHONE_NUMBERS).map((n) => ({
          label: `Số mẫu bị báo cáo: ${n}`,
          value: n,
        }))}
        onPick={setPhone}
      />

      <SubmitButton onClick={submit} disabled={!ready} loading={loading}>
        Kiểm tra số này
      </SubmitButton>
    </>
  );
}

function TransferTab() {
  const { you } = useAddress();
  const { show, loading } = useShowResult();
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  const ready = account.replace(/\D/g, "").length >= 6 && !!bank && amount > 0;

  return (
    <>
      <Intro>
        Trước khi bấm chuyển tiền, {you} hãy nhập thông tin giao dịch. ZASA sẽ giúp {you} dừng lại
        một nhịp để kiểm tra.
      </Intro>

      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="text-base font-semibold text-primary">Số tài khoản nhận</span>
          <input
            inputMode="numeric"
            value={account}
            onChange={(e) => setAccount(e.target.value.replace(/[^\d\s]/g, ""))}
            placeholder="Ví dụ: 0123 456 789"
            className={`mt-1 ${inputCls}`}
          />
        </label>

        <label className="block">
          <span className="text-base font-semibold text-primary">Ngân hàng</span>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className={`mt-1 ${inputCls}`}
          >
            <option value="" disabled>
              Chọn ngân hàng…
            </option>
            {BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-base font-semibold text-primary">Số tiền (đồng)</span>
          <input
            inputMode="numeric"
            value={amount ? formatVnd(amount) : ""}
            onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "").slice(0, 13)) || 0)}
            placeholder="Ví dụ: 5.000.000"
            className={`mt-1 ${inputCls}`}
          />
        </label>

        <label className="block">
          <span className="text-base font-semibold text-primary">Lý do chuyển</span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Trả tiền điện tháng 10"
            className={`mt-1 ${inputCls}`}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          setAccount(REPORTED_ACCOUNTS[0] ?? "");
          setBank("BIDV");
          setAmount(50_000_000);
          setReason("Nộp tiền phục vụ điều tra theo yêu cầu công an");
        }}
        className={`mt-4 ${chipCls}`}
      >
        Điền thử một giao dịch đáng ngờ
      </button>

      <SubmitButton
        onClick={() =>
          show({
            type: "transfer",
            account: account.trim(),
            bank,
            amount,
            reason: reason.trim() || undefined,
          })
        }
        disabled={!ready}
        loading={loading}
      >
        Kiểm tra trước khi chuyển
      </SubmitButton>
    </>
  );
}

function QrTab() {
  const { you, You } = useAddress();
  const { show, loading } = useShowResult();
  const [image, setImage] = useState<string | null>(null);
  const [sample, setSample] = useState<string | null>(null);

  const picker = useImagePicker((src) => {
    setImage(src);
    setSample(null);
  });

  return (
    <>
      <Intro>
        {You} tải ảnh mã QR lên, hoặc chọn một mã QR mô phỏng. ZASA sẽ cho {you} biết có nên quét
        hay không.
      </Intro>

      <button type="button" onClick={picker.open} className={`mt-4 ${secondaryBtnCls}`}>
        <ImagePlus className="size-6" /> Tải ảnh mã QR
      </button>
      {picker.input}

      {image ? (
        <ImagePreview src={image} alt="Ảnh mã QR đã tải lên" onRemove={() => setImage(null)} />
      ) : null}

      <p className="mt-6 font-semibold text-primary">Hoặc mô phỏng một mã QR:</p>
      <div role="radiogroup" aria-label="Mã QR mô phỏng" className="mt-2 space-y-2">
        {SAMPLE_QR_PAYLOADS.map((s) => (
          <button
            key={s.payload}
            type="button"
            role="radio"
            aria-checked={sample === s.payload}
            onClick={() => {
              setImage(null);
              setSample(s.payload);
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left text-base text-foreground shadow-soft ${
              sample === s.payload ? "border-primary ring-2 ring-primary" : "border-border"
            }`}
          >
            <QrCode className="size-8 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">{s.label}</span>
              <span className="block text-sm text-muted-foreground">Nội dung: {s.payload}</span>
            </span>
          </button>
        ))}
      </div>

      <SubmitButton
        onClick={() => show({ type: "qr", qr: sample ?? undefined })}
        disabled={!image && !sample}
        loading={loading}
      >
        Kiểm tra mã QR
      </SubmitButton>
    </>
  );
}
