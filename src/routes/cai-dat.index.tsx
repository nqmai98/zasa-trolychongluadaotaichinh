import { createFileRoute } from "@tanstack/react-router";
import { Bell, Crown, LifeBuoy, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SettingLink, SettingSection } from "@/components/SettingsUI";
import { usePlan } from "@/lib/zasa-store";

export const Route = createFileRoute("/cai-dat/")({
  head: () => ({
    meta: [
      { title: "Cài đặt — ZASA" },
      {
        name: "description",
        content: "Tùy chỉnh hiển thị, gói dịch vụ, cảnh báo và dữ liệu của ZASA.",
      },
      { property: "og:title", content: "Cài đặt — ZASA" },
      { property: "og:description", content: "Tùy chỉnh ZASA cho dễ nhìn, dễ dùng." },
    ],
  }),
  component: SettingsHome,
});

function SettingsHome() {
  const { plan, isPremium } = usePlan();
  const daysLeft = plan.trialEndsAt
    ? Math.max(1, Math.ceil((plan.trialEndsAt - Date.now()) / 86_400_000))
    : 0;

  return (
    <AppShell title="Cài đặt" back="/trang-chu">
      <SettingSection title="Ứng dụng">
        <SettingLink
          to="/cai-dat/chung"
          icon={SlidersHorizontal}
          label="Cài đặt chung"
          desc="Ngôn ngữ, phông chữ, cỡ chữ, sáng/tối"
        />
        <SettingLink
          to="/cai-dat/goi-dich-vu"
          icon={Crown}
          label="Gói dịch vụ"
          desc="So sánh Miễn phí và Premium"
          badge={
            <span
              className={`rounded-full px-2 py-0.5 text-sm font-semibold ${
                isPremium
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {isPremium ? `Dùng thử · còn ${daysLeft} ngày` : "Miễn phí"}
            </span>
          }
        />
      </SettingSection>

      <SettingSection title="An toàn">
        <SettingLink
          to="/cai-dat/canh-bao"
          icon={Bell}
          label="Cảnh báo & thông báo"
          desc="Báo người thân, nhắc học bài, báo cáo tuần"
        />
        <SettingLink
          to="/cai-dat/du-lieu"
          icon={ShieldCheck}
          label="Quyền riêng tư & dữ liệu"
          desc="Hoạt động gần đây, dữ liệu được lưu"
        />
      </SettingSection>

      <SettingSection title="Khác">
        <SettingLink to="/ho-tro" icon={LifeBuoy} label="Hỗ trợ" desc="Hướng dẫn sử dụng ZASA" />
      </SettingSection>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ZASA · Bản thử nghiệm
        <br />
        Mọi kết quả kiểm tra chỉ mang tính minh họa, dùng dữ liệu mẫu.
      </p>
    </AppShell>
  );
}
