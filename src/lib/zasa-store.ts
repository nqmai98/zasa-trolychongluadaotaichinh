import { useCallback, useEffect, useState } from "react";

export type Gender = "ong" | "ba";

export type Profile = {
  name: string;
  birthday: string;
  phone: string;
  province: string;
  avatar: string;
  gender: Gender;
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

export type LessonResult = { lessonId: string; title: string; correct: number; total: number; at: number };

export type UserRole = "elder" | "family";

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

export const defaultProfile: Profile = {
  name: "Bà Hồng",
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
    if (Array.isArray(fallback) || typeof parsed !== "object" || parsed === null) return parsed as T;
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

export function useProfile() {
  const { value, save, ready } = useStored<Profile>(PROFILE_KEY, defaultProfile);
  return { profile: value, setProfile: save, ready };
}

/** Cách xưng hô của trợ lý AI theo giới tính người dùng. */
export function useAddress() {
  const { profile } = useProfile();
  const you = profile.gender === "ong" ? "ông" : "bà";
  return {
    you,
    You: you === "ông" ? "Ông" : "Bà",
    me: "cháu",
    greet: `Chào ${you} ạ!`,
  };
}

export function useRole() {
  const { value, save, ready } = useStored<{ role: UserRole | null }>(ROLE_KEY, { role: null });
  return { role: value.role, setRole: (r: UserRole) => save({ role: r }), ready };
}

export function useActivities() {
  const { value, save, ready } = useStored<Activity[]>(ACTIVITY_KEY, []);
  const log = useCallback(
    (a: Omit<Activity, "id" | "at">) => {
      const list = readRaw<Activity[]>(ACTIVITY_KEY, []);
      const next = [{ ...a, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() }, ...list].slice(0, 40);
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
    (r: Omit<Relative, "id">) => save([...readRaw(RELATIVES_KEY, seed), { ...r, id: `${Date.now()}` }]),
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
      const list = readRaw<LessonResult[]>(RESULTS_KEY, []).filter((x) => x.lessonId !== r.lessonId);
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
