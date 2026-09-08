import { useCallback, useEffect, useState } from "react";

export type Profile = {
  name: string;
  birthday: string;
  phone: string;
  province: string;
  avatar: string;
};

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

export const defaultProfile: Profile = {
  name: "Bà Hồng",
  birthday: "1955-03-12",
  phone: "0901 234 567",
  province: "Hà Nội",
  avatar: "",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useProfile() {
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfileState(read(PROFILE_KEY, defaultProfile));
    setReady(true);
  }, []);

  const setProfile = useCallback((next: Profile) => {
    setProfileState(next);
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  return { profile, setProfile, ready };
}

export function usePoints() {
  const [points, setPointsState] = useState(0);
  const [answered, setAnswered] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPointsState(Number(window.localStorage.getItem(POINTS_KEY) ?? 0) || 0);
    try {
      setAnswered(JSON.parse(window.localStorage.getItem(ANSWERED_KEY) ?? "[]"));
    } catch {
      setAnswered([]);
    }
  }, []);

  const award = useCallback(
    (id: string, amount: number) => {
      if (answered.includes(id)) return 0;
      const nextAnswered = [...answered, id];
      const nextPoints = points + amount;
      setAnswered(nextAnswered);
      setPointsState(nextPoints);
      try {
        window.localStorage.setItem(POINTS_KEY, String(nextPoints));
        window.localStorage.setItem(ANSWERED_KEY, JSON.stringify(nextAnswered));
      } catch {
        /* ignore */
      }
      return amount;
    },
    [answered, points],
  );

  return { points, answered, award };
}
