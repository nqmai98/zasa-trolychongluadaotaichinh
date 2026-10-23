import { createFileRoute } from "@tanstack/react-router";
import { Moon, RotateCcw, Smartphone, Sun } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ChoiceGroup, SettingSection, ToggleRow } from "@/components/SettingsUI";
import {
  useAddress,
  useDisplay,
  type FontChoice,
  type Language,
  type TextSize,
} from "@/lib/zasa-store";

export const Route = createFileRoute("/cai-dat/chung")({
  head: () => ({
    meta: [
      { title: "Cài đặt chung — ZASA" },
      {
        name: "description",
        content: "Chọn ngôn ngữ, phông chữ, cỡ chữ và chế độ sáng tối cho ZASA.",
      },
      { property: "og:title", content: "Cài đặt chung — ZASA" },
      { property: "og:description", content: "Chỉnh màn hình ZASA cho dễ nhìn." },
    ],
  }),
  component: GeneralSettings,
});

const fonts: { id: FontChoice; label: string; family: string }[] = [
  { id: "be-vietnam", label: "Be Vietnam Pro", family: '"Be Vietnam Pro", sans-serif' },
  { id: "nunito", label: "Nunito", family: '"Nunito", sans-serif' },
  { id: "noto-serif", label: "Noto Serif", family: '"Noto Serif", serif' },
  { id: "system", label: "Phông của máy", family: "system-ui, sans-serif" },
];

const sizes: { id: TextSize; label: string; desc: string; px: number }[] = [
  { id: "md", label: "Vừa", desc: "Mặc định", px: 16 },
  { id: "lg", label: "Lớn", desc: "Dễ đọc hơn", px: 18 },
  { id: "xl", label: "Rất lớn", desc: "Chữ to nhất", px: 20 },
];

function GeneralSettings() {
  const { display, update, reset } = useDisplay();
  const { title, You } = useAddress();

  return (
    <AppShell title="Cài đặt chung" back="/cai-dat">
      <div className="rounded-3xl border border-border bg-card p-4 shadow-soft">
        <p className="text-sm font-semibold text-muted-foreground">Xem trước</p>
        <p className="mt-1 text-xl font-bold text-primary">Chào {title} ạ!</p>
        <p className="mt-1 text-lg leading-relaxed text-foreground">
          {You} đừng bao giờ đọc mã OTP cho người lạ, kể cả khi họ xưng là công an hay ngân hàng.
        </p>
      </div>

      <div className="mt-6">
        <SettingSection title="Chế độ màn hình">
          <ChoiceGroup
            label="Chế độ màn hình"
            columns={3}
            value={display.theme ?? "auto"}
            onChange={(v) => update({ theme: v === "auto" ? null : v })}
            options={[
              { id: "light", label: <Mode icon={Sun} text="Sáng" /> },
              { id: "dark", label: <Mode icon={Moon} text="Tối" /> },
              { id: "auto", label: <Mode icon={Smartphone} text="Theo máy" /> },
            ]}
          />
        </SettingSection>

        <SettingSection title="Cỡ chữ">
          <ChoiceGroup
            label="Cỡ chữ"
            columns={3}
            value={display.size}
            onChange={(size) => update({ size })}
            options={sizes.map((s) => ({
              id: s.id,
              label: <span style={{ fontSize: s.px * 1.15 }}>{s.label}</span>,
              desc: s.desc,
            }))}
          />
        </SettingSection>

        <SettingSection title="Phông chữ">
          <ChoiceGroup
            label="Phông chữ"
            value={display.font}
            onChange={(font) => update({ font })}
            options={fonts.map((f) => ({
              id: f.id,
              label: <span style={{ fontFamily: f.family }}>{f.label}</span>,
              desc: "Aa Ăă Ơơ Ưư",
            }))}
          />
        </SettingSection>

        <SettingSection title="Ngôn ngữ">
          <ChoiceGroup<Language>
            label="Ngôn ngữ"
            value={display.lang}
            onChange={(lang) => update({ lang })}
            options={[
              { id: "vi", label: "Tiếng Việt" },
              { id: "en", label: "English", desc: "Sắp có", disabled: true },
            ]}
          />
        </SettingSection>

        <SettingSection title="Dễ nhìn hơn">
          <ToggleRow
            label="Tăng độ tương phản"
            desc="Chữ phụ đậm hơn, viền rõ hơn"
            checked={display.contrast}
            onChange={(contrast) => update({ contrast })}
          />
          <ToggleRow
            label="Giảm chuyển động"
            desc="Tắt hiệu ứng trượt, phóng to thu nhỏ"
            checked={display.reduceMotion}
            onChange={(reduceMotion) => update({ reduceMotion })}
          />
        </SettingSection>
      </div>

      <button
        type="button"
        onClick={() => {
          reset();
          toast.success("Đã đưa hiển thị về mặc định");
        }}
        className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-lg font-bold text-primary shadow-soft py-2 px-4 text-center leading-snug"
      >
        <RotateCcw className="size-5" /> Khôi phục mặc định
      </button>
    </AppShell>
  );
}

function Mode({ icon: Icon, text }: { icon: typeof Sun; text: string }) {
  return (
    <span className="flex flex-col items-start gap-1">
      <Icon className="size-6 text-primary" />
      {text}
    </span>
  );
}
