import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SettingSection, ToggleRow } from "@/components/SettingsUI";
import {
  useAddress,
  useAlertSettings,
  useFollowing,
  usePlan,
  useRelatives,
  useRole,
} from "@/lib/zasa-store";

export const Route = createFileRoute("/cai-dat/canh-bao")({
  head: () => ({
    meta: [
      { title: "Cảnh báo & thông báo — ZASA" },
      {
        name: "description",
        content: "Chọn khi nào ZASA báo cho người thân và nhắc học bài.",
      },
      { property: "og:title", content: "Cảnh báo & thông báo — ZASA" },
      { property: "og:description", content: "Người thân luôn biết khi có rủi ro." },
    ],
  }),
  component: AlertSettingsPage,
});

function AlertSettingsPage() {
  const { role } = useRole();
  return role === "family" ? <FamilyAlertSettings /> : <ElderAlertSettings />;
}

function FamilyAlertSettings() {
  const { alerts, update } = useAlertSettings();
  const { isPremium } = usePlan();
  const { following } = useFollowing();

  return (
    <AppShell title="Cảnh báo & thông báo" back="/cai-dat">
      <SettingSection title="Khi người cao tuổi gặp rủi ro">
        <ToggleRow
          label="Cảnh báo mức Nguy hiểm"
          desc={`Báo ngay khi có dấu hiệu lừa đảo · ${following.length} người đang theo dõi`}
          checked={alerts.familyNotifyDanger}
          onChange={(familyNotifyDanger) => update({ familyNotifyDanger })}
        />
        <ToggleRow
          label="Cảnh báo mức Cần cảnh giác"
          desc="Báo khi kết quả kiểm tra chưa chắc chắn an toàn"
          checked={alerts.familyNotifyWarn}
          onChange={(familyNotifyWarn) => update({ familyNotifyWarn })}
        />
      </SettingSection>

      <SettingSection title="Báo cáo">
        <ToggleRow
          label="Báo cáo an toàn gia đình hằng tuần"
          desc={
            isPremium ? (
              "Tóm tắt số lần kiểm tra, cảnh báo và bài học của từng người vào sáng thứ Hai"
            ) : (
              <span className="inline-flex items-center gap-1">
                <Crown className="size-4" /> Cần gói Premium
              </span>
            )
          }
          checked={isPremium && alerts.weeklyReport}
          onChange={(weeklyReport) => update({ weeklyReport })}
          disabled={!isPremium}
        />
        {!isPremium ? (
          <Link
            to="/cai-dat/goi-dich-vu"
            className="block text-center text-base font-semibold text-primary underline underline-offset-4"
          >
            Xem gói Premium
          </Link>
        ) : null}
      </SettingSection>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Bản thử nghiệm chưa gửi thông báo thật; các lựa chọn được lưu để minh họa.
      </p>
    </AppShell>
  );
}

function ElderAlertSettings() {
  const { alerts, update } = useAlertSettings();
  const { isPremium } = usePlan();
  const { relatives } = useRelatives();
  const { you } = useAddress();

  const first = relatives[0];
  const notifyDesc = !relatives.length
    ? "Chưa kết nối người thân nào"
    : isPremium
      ? `Gửi tới cả ${relatives.length} người thân`
      : `Gửi tới ${first?.name ?? "1 người thân"} (Premium: tất cả người thân)`;

  return (
    <AppShell title="Cảnh báo & thông báo" back="/cai-dat">
      <SettingSection title="Khi có rủi ro cao">
        <ToggleRow
          label="Tự động báo người thân"
          desc={notifyDesc}
          checked={alerts.autoNotifyFamily}
          onChange={(autoNotifyFamily) => update({ autoNotifyFamily })}
        />
      </SettingSection>

      <SettingSection title="Nhắc nhở">
        <ToggleRow
          label="Nhắc học bài mỗi ngày"
          desc={`Một bài ngắn để ${you} nhớ các mánh lừa mới`}
          checked={alerts.dailyLessonReminder}
          onChange={(dailyLessonReminder) => update({ dailyLessonReminder })}
        />
        <ToggleRow
          label="Báo cáo an toàn gia đình hằng tuần"
          desc={
            isPremium ? (
              "Gửi tóm tắt số lần kiểm tra, cảnh báo vào sáng thứ Hai"
            ) : (
              <span className="inline-flex items-center gap-1">
                <Crown className="size-4" /> Cần gói Premium
              </span>
            )
          }
          checked={isPremium && alerts.weeklyReport}
          onChange={(weeklyReport) => update({ weeklyReport })}
          disabled={!isPremium}
        />
        {!isPremium ? (
          <Link
            to="/cai-dat/goi-dich-vu"
            className="block text-center text-base font-semibold text-primary underline underline-offset-4"
          >
            Xem gói Premium
          </Link>
        ) : null}
      </SettingSection>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Bản thử nghiệm chưa gửi tin nhắn thật; các lựa chọn được lưu để minh họa.
      </p>
    </AppShell>
  );
}
