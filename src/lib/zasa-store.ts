import { useCallback, useEffect, useState } from "react";
import { LOCAL_ELDER_CODE, isKnownCode, normalizeCode } from "./mock-family";

export type Gender = "ong" | "ba";
/** Xưng hô: người cao tuổi chọn ông/bà, con cháu chọn anh/chị */
export type AddressForm = Gender | "anh" | "chi";

export type Profile = {
  name: string;
  birthday: string;
  phone: string;
  province: string;
  avatar: string;
  gender: AddressForm;
};

export type Relative = { id: string; name: string; rel: string; phone: string };

export type Activity = {
  id: string;
  kind: "lesson" | "scan" | "connect" | "chat" | "profile";
  title: string;
  desc: string;
  at: number;
  risk?: "danger" | "warn" | "safe";
};

export type LessonResult = {
  lessonId: string;
  title: string;
  correct: number;
  total: number;
  at: number;
};

export type UserRole = "elder" | "family" | "partner";

/** Màn hình chính của từng vai trò */
export const ROLE_HOME = {
  elder: "/trang-chu",
  family: "/nguoi-than",
  partner: "/doi-tac",
} as const satisfies Record<UserRole, string>;

export const PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Huế",
  "Quảng Ninh",
  "Lạng Sơn",
  "Cao Bằng",
  "Tuyên Quang",
  "Lào Cai",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Quảng Ngãi",
  "Gia Lai",
  "Đắk Lắk",
  "Lâm Đồng",
  "Khánh Hòa",
  "Đồng Nai",
  "Tây Ninh",
  "Vĩnh Long",
  "Đồng Tháp",
  "An Giang",
  "Cà Mau",
  "Sơn La",
  "Điện Biên",
  "Lai Châu",
];

const PROFILE_KEY = "zasa.profile";
const POINTS_KEY = "zasa.points";
const ANSWERED_KEY = "zasa.answered";
const ACTIVITY_KEY = "zasa.activities";
const RELATIVES_KEY = "zasa.relatives";
const RESULTS_KEY = "zasa.lessonResults";
const ROLE_KEY = "zasa.role";
const FAMILY_PROFILE_KEY = "zasa.familyProfile";
const FOLLOWING_KEY = "zasa.following";

export const defaultProfile: Profile = {
  name: "Nguyễn Thị Hồng",
  birthday: "1955-03-12",
  phone: "0901 234 567",
  province: "Hà Nội",
  avatar: "",
  gender: "ba",
};

const STORE_EVENT = "zasa:store";

function emit(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: key }));
}

function readRaw<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) || typeof parsed !== "object" || parsed === null)
      return parsed as T;
    return { ...(fallback as object), ...parsed } as T;
  } catch {
    return fallback;
  }
}

function writeRaw(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
  emit(key);
}

/** Shared reactive localStorage value: updates across pages, tabs and components. */
function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setValue(readRaw(key, fallback));
    sync();
    setReady(true);
    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail === key) sync();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) sync();
    };
    window.addEventListener(STORE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(STORE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    (next: T) => {
      setValue(next);
      writeRaw(key, next);
    },
    [key],
  );

  return { value, save, ready };
}

/** Hồ sơ người cao tuổi (cũng là người được theo dõi bằng mã ZS-4821) */
export function useProfile() {
  const { value, save, ready } = useStored<Profile>(PROFILE_KEY, defaultProfile);
  return { profile: value, setProfile: save, ready };
}

export const defaultFamilyProfile: Profile = {
  name: "Lê Văn Minh",
  birthday: "1990-06-20",
  phone: "0912 888 456",
  province: "Hà Nội",
  avatar: "",
  gender: "anh",
};

/** Hồ sơ của người đang đăng nhập: người cao tuổi hoặc con cháu, tùy vai trò. */
export function useMyProfile() {
  const { role } = useRole();
  const elder = useStored<Profile>(PROFILE_KEY, defaultProfile);
  const family = useStored<Profile>(FAMILY_PROFILE_KEY, defaultFamilyProfile);
  const s = role === "family" ? family : elder;
  return { profile: s.value, setProfile: s.save, ready: s.ready, role };
}

const PRONOUN: Record<AddressForm, string> = { ong: "ông", ba: "bà", anh: "anh", chi: "chị" };

/**
 * Cách ZASA gọi người dùng theo xưng hô trong hồ sơ, không bao giờ dùng "bạn":
 * người cao tuổi là "ông"/"bà", con cháu là "anh"/"chị".
 * Tên gọi lấy chữ cuối của họ tên (Nguyễn Thị Hồng → Hồng); bỏ "Ông/Bà…" nếu người dùng gõ kèm.
 */
export function addressOf(profile: Pick<Profile, "name" | "gender">) {
  const you = PRONOUN[profile.gender] ?? "bà";
  const You = you.charAt(0).toUpperCase() + you.slice(1);
  const words = profile.name
    .trim()
    .replace(/^(ông|bà|cụ|bác|anh|chị)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  const givenName = words[words.length - 1] ?? "";
  return {
    you,
    You,
    /** "Bà Hồng" — dùng khi gọi kèm tên */
    title: givenName ? `${You} ${givenName}` : You,
    /** ZASA luôn tự xưng là "ZASA", không xưng "cháu", "tôi" hay "em" */
    me: "ZASA",
    greet: `Chào ${you} ạ!`,
    /** Thay {you}/{You} trong nội dung soạn sẵn (bài học, câu hỏi…) */
    addr: (text: string) => text.replace(/\{you\}/g, you).replace(/\{You\}/g, You),
  };
}

export function useAddress() {
  const { profile } = useMyProfile();
  return addressOf(profile);
}

export function useRole() {
  const { value, save, ready } = useStored<{ role: UserRole | null }>(ROLE_KEY, { role: null });
  return {
    role: value.role,
    setRole: (r: UserRole) => save({ role: r }),
    /** Đăng xuất: quên vai trò đã chọn, giữ nguyên hồ sơ và dữ liệu trên máy */
    logout: () => save({ role: null }),
    ready,
  };
}

export function useActivities() {
  const { value, save, ready } = useStored<Activity[]>(ACTIVITY_KEY, []);
  const log = useCallback(
    (a: Omit<Activity, "id" | "at">) => {
      const list = readRaw<Activity[]>(ACTIVITY_KEY, []);
      const next = [
        { ...a, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() },
        ...list,
      ].slice(0, 40);
      save(next);
    },
    [save],
  );
  const clear = useCallback(() => save([]), [save]);
  return { activities: value, log, clear, ready };
}

export function useRelatives() {
  const seed: Relative[] = [
    { id: "r1", name: "Cháu Minh", rel: "Cháu trai", phone: "0901 234 567" },
    { id: "r2", name: "Chị Lan", rel: "Con gái", phone: "0912 888 456" },
  ];
  const { value, save, ready } = useStored<Relative[]>(RELATIVES_KEY, seed);
  const add = useCallback(
    (r: Omit<Relative, "id">) =>
      save([...readRaw(RELATIVES_KEY, seed), { ...r, id: `${Date.now()}` }]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save],
  );
  const remove = useCallback(
    (id: string) => save(readRaw<Relative[]>(RELATIVES_KEY, seed).filter((x) => x.id !== id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save],
  );
  return { relatives: value, add, remove, ready };
}

export function useLessonResults() {
  const { value, save, ready } = useStored<LessonResult[]>(RESULTS_KEY, []);
  const record = useCallback(
    (r: Omit<LessonResult, "at">) => {
      const list = readRaw<LessonResult[]>(RESULTS_KEY, []).filter(
        (x) => x.lessonId !== r.lessonId,
      );
      save([{ ...r, at: Date.now() }, ...list]);
    },
    [save],
  );
  return { results: value, record, ready };
}

export function usePoints() {
  const points = useStored<number>(POINTS_KEY, 0);
  const answeredStore = useStored<string[]>(ANSWERED_KEY, []);

  const award = useCallback(
    (id: string, amount: number) => {
      const answered = readRaw<string[]>(ANSWERED_KEY, []);
      if (answered.includes(id)) return 0;
      answeredStore.save([...answered, id]);
      points.save(readRaw<number>(POINTS_KEY, 0) + amount);
      return amount;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answeredStore.save, points.save],
  );

  return { points: points.value, answered: answeredStore.value, award };
}

export function timeAgo(at: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 60) return "Vừa xong";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.round(h / 24);
  return d === 1 ? "Hôm qua" : `${d} ngày trước`;
}

export type Theme = "light" | "dark";
export type FontChoice = "be-vietnam" | "nunito" | "noto-serif" | "system";
export type TextSize = "md" | "lg" | "xl";
export type Language = "vi" | "en";

export type DisplaySettings = {
  /** null = theo cài đặt của điện thoại */
  theme: Theme | null;
  font: FontChoice;
  size: TextSize;
  contrast: boolean;
  reduceMotion: boolean;
  lang: Language;
};

export const DISPLAY_KEY = "zasa.display";
export const TEXT_SIZE_SCALE: Record<TextSize, string> = { md: "100%", lg: "112.5%", xl: "125%" };

export const defaultDisplay: DisplaySettings = {
  theme: null,
  font: "be-vietnam",
  size: "md",
  contrast: false,
  reduceMotion: false,
  lang: "vi",
};

const systemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export function applyDisplay(d: DisplaySettings) {
  const root = document.documentElement;
  const theme = d.theme ?? systemTheme();
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("contrast", d.contrast);
  root.classList.toggle("reduce-motion", d.reduceMotion);
  root.style.colorScheme = theme;
  root.style.fontSize = TEXT_SIZE_SCALE[d.size];
  root.setAttribute("data-font", d.font);
  root.lang = d.lang;
}

/**
 * Bản rút gọn của applyDisplay chạy trong <head> trước khi trang hiển thị,
 * để không bị nháy màu hoặc nhảy cỡ chữ khi tải lại.
 */
export const displayBootScript = `(function(){try{var d=JSON.parse(localStorage.getItem(${JSON.stringify(DISPLAY_KEY)})||"{}")||{};var r=document.documentElement;var t=d.theme==="light"||d.theme==="dark"?d.theme:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var s=${JSON.stringify(TEXT_SIZE_SCALE)};r.classList.toggle("dark",t==="dark");r.classList.toggle("contrast",!!d.contrast);r.classList.toggle("reduce-motion",!!d.reduceMotion);r.style.colorScheme=t;if(s[d.size])r.style.fontSize=s[d.size];r.dataset.font=d.font||"be-vietnam";r.lang=d.lang||"vi"}catch(e){}})()`;

export function useDisplay() {
  const { value, save, ready } = useStored<DisplaySettings>(DISPLAY_KEY, defaultDisplay);
  const [system, setSystem] = useState<Theme>("light");
  useEffect(() => setSystem(systemTheme()), []);
  useEffect(() => {
    if (ready) applyDisplay(value);
  }, [ready, value]);
  const update = useCallback(
    (patch: Partial<DisplaySettings>) =>
      save({ ...readRaw<DisplaySettings>(DISPLAY_KEY, defaultDisplay), ...patch }),
    [save],
  );
  return {
    display: value,
    theme: value.theme ?? system,
    update,
    reset: () => save(defaultDisplay),
    ready,
  };
}

export type Plan = { tier: "free" | "premium"; trialEndsAt: number | null };
const PLAN_KEY = "zasa.plan";
export const PREMIUM_PRICE = 50_000;
export const TRIAL_DAYS = 7;

/** Gói dịch vụ minh họa: chỉ lưu trên máy, không có thanh toán thật. */
export function usePlan() {
  const { value, save, ready } = useStored<Plan>(PLAN_KEY, { tier: "free", trialEndsAt: null });
  const expired =
    value.tier === "premium" && value.trialEndsAt !== null && value.trialEndsAt < Date.now();
  const plan: Plan = expired ? { tier: "free", trialEndsAt: null } : value;
  return {
    plan,
    isPremium: plan.tier === "premium",
    startTrial: () => save({ tier: "premium", trialEndsAt: Date.now() + TRIAL_DAYS * 86_400_000 }),
    cancel: () => save({ tier: "free", trialEndsAt: null }),
    ready,
  };
}

export type AlertSettings = {
  autoNotifyFamily: boolean;
  dailyLessonReminder: boolean;
  weeklyReport: boolean;
  /** Phía con cháu: nhận cảnh báo của người cao tuổi đang theo dõi */
  familyNotifyDanger: boolean;
  familyNotifyWarn: boolean;
};
const ALERTS_KEY = "zasa.alerts";

export function useAlertSettings() {
  const { value, save, ready } = useStored<AlertSettings>(ALERTS_KEY, {
    autoNotifyFamily: true,
    dailyLessonReminder: true,
    weeklyReport: false,
    familyNotifyDanger: true,
    familyNotifyWarn: true,
  });
  const update = (patch: Partial<AlertSettings>) => save({ ...value, ...patch });
  return { alerts: value, update, ready };
}

/** Xóa toàn bộ dữ liệu ZASA lưu trên máy (dùng để chạy lại bản demo từ đầu). */
export function resetAllData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("zasa."))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/** Người cao tuổi mà một người thân (Con/Cháu) đang theo dõi, thêm bằng mã kết nối. */
export type FollowedElder = { code: string; rel: string; since: number };

export function useFollowing() {
  const seed: FollowedElder[] = [{ code: LOCAL_ELDER_CODE, rel: "", since: 0 }];
  const { value, save, ready } = useStored<FollowedElder[]>(FOLLOWING_KEY, seed);
  const follow = (input: string, rel: string): "ok" | "invalid" | "unknown" | "exists" => {
    const code = normalizeCode(input);
    if (!code) return "invalid";
    if (!isKnownCode(code)) return "unknown";
    const list = readRaw<FollowedElder[]>(FOLLOWING_KEY, seed);
    if (list.some((e) => e.code === code)) return "exists";
    save([...list, { code, rel: rel.trim(), since: Date.now() }]);
    return "ok";
  };
  const unfollow = (code: string) =>
    save(readRaw<FollowedElder[]>(FOLLOWING_KEY, seed).filter((e) => e.code !== code));
  return { following: value, follow, unfollow, ready };
}
