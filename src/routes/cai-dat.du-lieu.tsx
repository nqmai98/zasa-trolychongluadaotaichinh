import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  History,
  Lock,
  MessageCircle,
  ShieldCheck,
  Trash2,
  UserCircle2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { SettingSection } from "@/components/SettingsUI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RISK_LEVELS } from "@/lib/risk-levels";
import { resetAllData, timeAgo, useActivities, useAddress, useRole } from "@/lib/zasa-store";

export const Route = createFileRoute("/cai-dat/du-lieu")({
  head: () => ({
    meta: [
      { title: "Quyền riêng tư & dữ liệu — ZASA" },
      {
        name: "description",
        content: "Xem ZASA lưu những gì, xóa lịch sử kiểm tra hoặc đặt lại toàn bộ dữ liệu.",
      },
      { property: "og:title", content: "Quyền riêng tư & dữ liệu — ZASA" },
      { property: "og:description", content: "Dữ liệu chỉ nằm trên máy này." },
    ],
  }),
  component: DataPage,
});

const STORED = {
  elder: [
    "Hồ sơ: họ tên, ngày sinh, số điện thoại, tỉnh thành, ảnh đại diện",
    "Danh sách người thân đã kết nối",
    "Lịch sử kiểm tra và bài học, điểm tích lũy",
    "Cài đặt hiển thị, cảnh báo và gói dịch vụ",
  ],
  family: [
    "Hồ sơ: họ tên, ngày sinh, số điện thoại, tỉnh thành, ảnh đại diện",
    "Danh sách người cao tuổi đang theo dõi (mã kết nối, quan hệ)",
    "Cài đặt hiển thị, cảnh báo và gói dịch vụ",
  ],
};

const iconFor = {
  lesson: GraduationCap,
  scan: ShieldCheck,
  connect: UserPlus,
  chat: MessageCircle,
  profile: UserCircle2,
} as const;

const btnCls =
  "flex min-h-16 w-full items-center justify-center gap-2 rounded-full border text-lg font-bold shadow-soft py-2 px-4 text-center leading-snug";

function DataPage() {
  const { activities, clear } = useActivities();
  const { you } = useAddress();
  const { role } = useRole();
  const isFamily = role === "family";
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), [activities]);

  return (
    <AppShell title="Quyền riêng tư & dữ liệu" back="/cai-dat">
      <div className="flex items-start gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft">
        <Lock className="mt-1 size-7 shrink-0 text-primary" />
        <p className="text-lg leading-relaxed text-foreground">
          Trong bản thử nghiệm, mọi dữ liệu chỉ lưu trên điện thoại này. ZASA không gửi tin nhắn,
          ảnh hay số tài khoản của {you} đi đâu cả.
        </p>
      </div>

      <div className="mt-6">
        <SettingSection title="ZASA đang lưu">
          <ul className="list-disc space-y-1 pl-6 text-lg text-foreground">
            {STORED[isFamily ? "family" : "elder"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </SettingSection>

        {isFamily ? null : (
          <SettingSection title="Hoạt động gần đây">
            {activities.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
                Chưa có hoạt động nào.
              </p>
            ) : (
              <ul className="space-y-2">
                {(showAll ? activities : activities.slice(0, 5)).map((a) => {
                  const Icon = a.risk ? RISK_LEVELS[a.risk].icon : iconFor[a.kind];
                  const color = a.risk ? RISK_LEVELS[a.risk].iconColor : "text-primary";
                  return (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
                    >
                      <Icon className={`size-7 shrink-0 ${color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{a.title}</p>
                        <p className="truncate text-sm text-muted-foreground">{a.desc}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(a.at, now)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {activities.length > 5 ? (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="w-full text-center text-base font-semibold text-primary underline underline-offset-4"
              >
                {showAll ? "Thu gọn" : `Xem tất cả ${activities.length} hoạt động`}
              </button>
            ) : null}
          </SettingSection>
        )}

        <SettingSection title="Xóa dữ liệu">
          {isFamily ? null : (
            <button
              type="button"
              disabled={!activities.length}
              onClick={() => {
                clear();
                toast.success("Đã xóa lịch sử hoạt động");
              }}
              className={`${btnCls} border-border bg-card text-primary disabled:opacity-50`}
            >
              <History className="size-6" /> Xóa lịch sử hoạt động ({activities.length})
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger className={`${btnCls} border-destructive bg-card text-destructive`}>
              <Trash2 className="size-6" /> Đặt lại toàn bộ dữ liệu
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Xóa hết dữ liệu ZASA?</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Hồ sơ, người thân, lịch sử, điểm và cài đặt sẽ bị xóa khỏi máy này. Không thể hoàn
                  tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="min-h-12 rounded-full text-base py-2 px-4 text-center leading-snug whitespace-normal">
                  Giữ lại
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    resetAllData();
                    window.location.assign("/");
                  }}
                  className="min-h-12 rounded-full bg-destructive text-base text-destructive-foreground hover:bg-destructive/90 py-2 px-4 text-center leading-snug whitespace-normal"
                >
                  Xóa hết
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingSection>
      </div>
    </AppShell>
  );
}
