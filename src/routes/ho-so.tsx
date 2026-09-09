import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Award, Camera, Save, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PROVINCES, useProfile, usePoints, useActivities, type Profile } from "@/lib/zasa-store";

export const Route = createFileRoute("/ho-so")({
  head: () => ({
    meta: [
      { title: "Hồ sơ của tôi — ZASA" },
      {
        name: "description",
        content:
          "Chỉnh sửa họ tên, ngày sinh, số điện thoại, tỉnh thành, đổi ảnh đại diện và xem điểm tích lũy khi học.",
      },
      { property: "og:title", content: "Hồ sơ của tôi — ZASA" },
      { property: "og:description", content: "Thông tin cá nhân và điểm tích lũy của bạn trên ZASA." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile, ready } = useProfile();
  const { points } = usePoints();
  const { log } = useActivities();
  const [form, setForm] = useState<Profile>(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready) setForm(profile);
  }, [ready, profile]);

  const set = (k: keyof Profile, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const pickAvatar = (file?: File | null) => {
    if (!file) return;
    if (file.size > 3_000_000) {
      toast.error("Ảnh quá lớn, hãy chọn ảnh nhỏ hơn 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...form, avatar: String(reader.result) };
      setForm(next);
      setProfile(next);
      toast.success("Đã đổi ảnh đại diện");
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    setProfile({ ...form, name: form.name.trim(), phone: form.phone.trim() });
    log({ kind: "profile", title: "Đã cập nhật hồ sơ", desc: `${form.name.trim()} · ${form.province}` });
    toast.success("Đã lưu thông tin cá nhân");
  };

  const level = points >= 300 ? "Chuyên gia" : points >= 150 ? "Khá vững" : "Người mới";

  return (
    <AppShell title="Hồ sơ của tôi" back="/trang-chu">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative grid size-28 place-items-center overflow-hidden rounded-full bg-secondary text-primary"
          aria-label="Thay đổi ảnh đại diện"
        >
          {form.avatar ? (
            <img src={form.avatar} alt="Ảnh đại diện" className="size-full object-cover" />
          ) : (
            <UserCircle2 className="size-20" strokeWidth={1.5} />
          )}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/85 py-1 text-xs font-semibold text-primary-foreground">
            <Camera className="size-4" /> Đổi ảnh
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pickAvatar(e.target.files?.[0])}
        />
        <p className="text-2xl font-bold text-primary">{form.name || "Chưa có tên"}</p>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-3xl border border-border bg-secondary/60 p-5 shadow-soft">
        <span className="grid size-14 place-items-center rounded-2xl bg-card text-primary">
          <Award className="size-8" />
        </span>
        <div>
          <p className="text-lg text-muted-foreground">Điểm tích lũy khi học</p>
          <p className="text-3xl font-extrabold text-primary">{points} điểm</p>
          <p className="text-base text-muted-foreground">Cấp độ: {level}</p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-primary">Thông tin cá nhân</h2>
      <div className="mt-3 space-y-4">
        <Field label="Họ và tên">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input-zasa"
            maxLength={80}
          />
        </Field>
        <Field label="Giới tính (trợ lý sẽ xưng hô theo lựa chọn này)">
          <div className="flex gap-3">
            {([
              { v: "ba", label: "Bà" },
              { v: "ong", label: "Ông" },
            ] as const).map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => set("gender", o.v)}
                className={`h-14 flex-1 rounded-2xl border text-lg font-bold ${
                  form.gender === o.v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-primary"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Trợ lý ZASA sẽ gọi bạn là “{form.gender === "ong" ? "ông" : "bà"}”.
          </p>
        </Field>
        <Field label="Ngày tháng năm sinh">
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => set("birthday", e.target.value)}
            className="input-zasa"
          />
        </Field>
        <Field label="Số điện thoại">
          <input
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="input-zasa"
            maxLength={20}
          />
        </Field>
        <Field label="Nơi ở hiện tại (tỉnh/thành phố)">
          <select
            value={form.province}
            onChange={(e) => set("province", e.target.value)}
            className="input-zasa"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-xl font-bold text-primary-foreground shadow-soft active:scale-95"
      >
        <Save className="size-6" /> Lưu thông tin
      </button>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-semibold text-primary">{label}</span>
      {children}
    </label>
  );
}
