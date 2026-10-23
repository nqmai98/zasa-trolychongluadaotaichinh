import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BellRing,
  CalendarCheck,
  Crown,
  GraduationCap,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVnd } from "@/lib/check-result";
import { PREMIUM_PRICE, TRIAL_DAYS, useActivities, useAddress, usePlan } from "@/lib/zasa-store";

export const Route = createFileRoute("/cai-dat/goi-dich-vu")({
  head: () => ({
    meta: [
      { title: "Gói dịch vụ — ZASA" },
      {
        name: "description",
        content: "So sánh gói Miễn phí và Premium của ZASA, dùng thử Premium không cần thanh toán.",
      },
      { property: "og:title", content: "Gói dịch vụ — ZASA" },
      { property: "og:description", content: "Bảo vệ cả gia đình với ZASA Premium." },
    ],
  }),
  component: PlanPage,
});

type Feature = { icon: LucideIcon; label: string };

const FREE_FEATURES: Feature[] = [
  { icon: ShieldCheck, label: "Kiểm tra tin nhắn, số điện thoại, mã QR" },
  { icon: WalletCards, label: "Kiểm tra trước khi chuyển tiền" },
  { icon: GraduationCap, label: "Bài học phòng chống lừa đảo" },
  { icon: BellRing, label: "Cảnh báo tới 1 người thân" },
];

const PREMIUM_FEATURES: Feature[] = [
  { icon: Sparkles, label: "Mọi tính năng của gói Miễn phí" },
  { icon: Users, label: "Cảnh báo tới nhiều người thân cùng lúc" },
  { icon: CalendarCheck, label: "Báo cáo an toàn gia đình hằng tuần" },
  { icon: Mic, label: "Phân tích ghi âm giọng nói cuộc gọi" },
];

const DAY = 86_400_000;
const formatDate = (at: number) => new Date(at).toLocaleDateString("vi-VN");

function PlanPage() {
  const { plan, isPremium, startTrial, cancel } = usePlan();
  const { log } = useActivities();
  const { You } = useAddress();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const daysLeft = plan.trialEndsAt
    ? Math.max(1, Math.ceil((plan.trialEndsAt - Date.now()) / DAY))
    : 0;

  const confirmTrial = () => {
    startTrial();
    log({
      kind: "profile",
      title: "Bắt đầu dùng thử Premium",
      desc: `${TRIAL_DAYS} ngày, không thanh toán`,
    });
    setInvoiceOpen(false);
    toast.success(`Đã bật Premium dùng thử ${TRIAL_DAYS} ngày`);
  };

  return (
    <AppShell title="Gói dịch vụ" back="/cai-dat">
      <h2 className="text-center text-2xl font-extrabold text-primary">Chọn gói cho gia đình</h2>
      <p className="mt-1 text-center text-base text-muted-foreground">
        Một gói dùng chung cho cả hộ gia đình
      </p>

      <div className="mt-5 space-y-4">
        <PlanCard
          name="Miễn phí"
          headline="Bảo vệ cơ bản"
          desc="Tự kiểm tra tin nhắn, cuộc gọi, giao dịch và học cách phòng tránh lừa đảo."
          price="0đ"
          priceNote="Mãi mãi"
          features={FREE_FEATURES}
          action={
            <button
              type="button"
              disabled
              className="flex h-14 w-full items-center justify-center rounded-full border border-border bg-card text-lg font-semibold text-muted-foreground"
            >
              {isPremium ? "Gói cơ bản" : "Gói hiện tại"}
            </button>
          }
        />

        <PlanCard
          highlight
          name="Premium"
          headline="Bảo vệ cả gia đình"
          desc="Con cháu cùng nhận cảnh báo và nắm tình hình an toàn của cả nhà mỗi tuần."
          price={`${formatVnd(PREMIUM_PRICE)}đ`}
          priceNote="Mỗi hộ / tháng (đã gồm VAT)"
          features={PREMIUM_FEATURES}
          action={
            isPremium ? (
              <div className="space-y-2">
                <p className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-lg font-bold text-accent-foreground">
                  <Crown className="size-5" /> Đang dùng thử · còn {daysLeft} ngày
                </p>
                <button
                  type="button"
                  onClick={() => {
                    cancel();
                    toast.success("Đã quay về gói Miễn phí");
                  }}
                  className="w-full text-center text-base font-semibold text-primary underline underline-offset-4"
                >
                  Dừng dùng thử
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setInvoiceOpen(true)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-soft"
              >
                <Sparkles className="size-5" /> Dùng thử miễn phí {TRIAL_DAYS} ngày
              </button>
            )
          }
        />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Bản thử nghiệm: không thu tiền, không cần thẻ ngân hàng.
      </p>

      <TrialInvoice open={invoiceOpen} onOpenChange={setInvoiceOpen} onConfirm={confirmTrial} />
    </AppShell>
  );
}

function PlanCard({
  name,
  headline,
  desc,
  price,
  priceNote,
  features,
  action,
  highlight,
}: {
  name: string;
  headline: string;
  desc: string;
  price: string;
  priceNote: string;
  features: Feature[];
  action: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      className={`rounded-3xl border p-5 shadow-soft ${
        highlight ? "border-primary bg-secondary/50" : "border-border bg-card"
      }`}
    >
      <p className="flex items-center gap-1.5 text-lg font-bold text-foreground">
        {highlight ? <Crown className="size-5 text-primary" /> : null}
        {name}
      </p>
      <h3 className="mt-3 text-2xl font-extrabold text-primary">{headline}</h3>
      <p className="mt-1 text-base leading-relaxed text-muted-foreground">{desc}</p>

      <div className="mt-4">{action}</div>

      <p className="mt-5 text-4xl font-extrabold text-foreground">{price}</p>
      <p className="text-base text-muted-foreground">{priceNote}</p>

      <ul className="mt-5 space-y-3">
        {features.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-lg text-foreground">
            <Icon className="size-6 shrink-0 text-primary" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrialInvoice({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const { you } = useAddress();
  const trialEnd = Date.now() + TRIAL_DAYS * DAY;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            Xác nhận dùng thử
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {`Gia đình ${you} sẽ dùng thử ZASA Premium ${TRIAL_DAYS} ngày. Hôm nay không mất tiền.`}
          </DialogDescription>
        </DialogHeader>

        <dl className="space-y-4 text-base">
          <InvoiceRow
            label="ZASA Premium"
            note="Tính theo tháng, cho cả hộ gia đình"
            value={`${formatVnd(PREMIUM_PRICE)}đ`}
          />
          <InvoiceRow
            label={`Ưu đãi dùng thử ${TRIAL_DAYS} ngày`}
            note={`Miễn phí từ hôm nay đến hết ngày ${formatDate(trialEnd)}`}
            value={`-${formatVnd(PREMIUM_PRICE)}đ`}
          />
          <div className="space-y-2 border-t border-border pt-4">
            <InvoiceRow label="Tạm tính" value="0đ" muted />
            <InvoiceRow label="Thuế VAT" value="0đ" muted />
            <InvoiceRow label="Tổng thanh toán hôm nay" value="0đ" strong />
          </div>
        </dl>

        <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted p-4">
          <WalletCards className="mt-0.5 size-6 shrink-0 text-primary" />
          <p className="text-base leading-relaxed text-foreground">
            Không cần thẻ ngân hàng. Hết {TRIAL_DAYS} ngày, ZASA tự quay về gói Miễn phí và không tự
            trừ tiền.
          </p>
        </div>

        <DialogFooter className="flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-12 flex-1 rounded-full text-lg font-semibold text-muted-foreground sm:flex-none sm:px-6"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-full bg-primary text-lg font-bold text-primary-foreground sm:flex-none sm:px-6"
          >
            Bắt đầu dùng thử
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InvoiceRow({
  label,
  note,
  value,
  muted,
  strong,
}: {
  label: string;
  note?: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <dt
          className={
            strong
              ? "text-lg font-bold text-foreground"
              : muted
                ? "text-muted-foreground"
                : "font-semibold text-foreground"
          }
        >
          {label}
        </dt>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </div>
      <dd
        className={`shrink-0 ${strong ? "text-lg font-bold" : muted ? "" : "font-semibold"} ${
          muted ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
