import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Award,
  GraduationCap,
  PhoneCall,
  ShieldCheck,
  UserMinus,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/zasa-shield.png";
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
import { AvatarMenu } from "@/components/AvatarMenu";
import { Progress } from "@/components/ui/progress";
import { LESSONS } from "@/lib/lessons";
import { DEMO_ELDERS, LOCAL_ELDER_CODE, findDemoElder } from "@/lib/mock-family";
import { RISK_LEVELS } from "@/lib/risk-levels";
import {
  addressOf,
  timeAgo,
  useActivities,
  useFollowing,
  useLessonResults,
  usePoints,
  useProfile,
  useMyProfile,
  type Activity,
  type FollowedElder,
  type LessonResult,
} from "@/lib/zasa-store";

export const Route = createFileRoute("/nguoi-than")({
  head: () => ({
    meta: [
      { title: "Giao diện Con/Cháu — ZASA" },
      {
        name: "description",
        content:
          "Theo dõi nhiều người cao tuổi cùng lúc: nhận cảnh báo rủi ro và xem tình hình học tập phòng chống lừa đảo.",
      },
      { property: "og:title", content: "Giao diện Con/Cháu — ZASA" },
      {
        property: "og:description",
        content: "Theo dõi và bảo vệ ông bà khỏi lừa đảo tài chính từ xa.",
      },
    ],
  }),
  component: FamilyDashboard,
});

const TOTAL_LESSONS = LESSONS.filter((l) => l.state === "open").length;

type ElderView = {
  code: string;
  rel: string;
  title: string;
  phone: string;
  points: number;
  results: Omit<LessonResult, "at">[];
  activities: Activity[];
};

/** Gộp dữ liệu của từng người được theo dõi: người trên máy này dùng dữ liệu thật, người mẫu dùng dữ liệu giả. */
function useElderViews(following: FollowedElder[], now: number): ElderView[] {
  const { profile } = useProfile();
  const { activities } = useActivities();
  const { results } = useLessonResults();
  const { points } = usePoints();

  return following.flatMap((f): ElderView[] => {
    if (f.code === LOCAL_ELDER_CODE) {
      return [
        {
          code: f.code,
          rel: f.rel,
          title: addressOf(profile).title,
          phone: profile.phone,
          points,
          results,
          activities,
        },
      ];
    }
    const demo = findDemoElder(f.code);
    if (!demo) return [];
    return [
      {
        code: f.code,
        rel: f.rel,
        title: addressOf(demo).title,
        phone: demo.phone,
        points: demo.points,
        results: demo.results,
        activities: demo.activities.map(({ minutesAgo, ...a }, i) => ({
          ...a,
          id: `${demo.code}-${i}`,
          at: now - minutesAgo * 60_000,
        })),
      },
    ];
  });
}

const isAlert = (a: Activity) => a.risk === "danger" || a.risk === "warn";

function FamilyDashboard() {
  const { profile: me } = useMyProfile();
  const { following, follow, unfollow } = useFollowing();
  const [now, setNow] = useState(Date.now());
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 20_000);
    return () => clearInterval(t);
  }, []);

  const elders = useElderViews(following, now);
  const current = elders.find((e) => e.code === selected) ?? elders[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
        <img src={logo} alt="" width={768} height={768} className="size-10" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Người thân</h1>
          <p className="text-sm text-muted-foreground">
            Đang theo dõi {elders.length} người cao tuổi
          </p>
        </div>
        <AvatarMenu avatar={me.avatar} />
      </header>

      <main className="flex-1 space-y-6 px-4 py-5">
        <section>
          <h2 className="text-2xl font-bold text-primary">Người đang theo dõi</h2>
          <ul className="mt-3 space-y-3">
            {elders.map((e) => {
              const alerts = e.activities.filter(isAlert).length;
              const active = current?.code === e.code;
              return (
                <li key={e.code}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(e.code)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-soft ${
                      active ? "border-primary" : "border-border"
                    }`}
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-lg font-bold text-primary">
                      {e.title.split(" ").pop()?.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-foreground">{e.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {[e.rel, e.code, `${e.points} điểm`].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {alerts ? (
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-sm font-semibold text-foreground ${RISK_LEVELS.danger.soft}`}
                      >
                        <AlertTriangle className={`size-4 ${RISK_LEVELS.danger.iconColor}`} />
                        {alerts}
                      </span>
                    ) : (
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-sm font-semibold text-foreground ${RISK_LEVELS.safe.soft}`}
                      >
                        <ShieldCheck className={`size-4 ${RISK_LEVELS.safe.iconColor}`} />
                        Ổn
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {adding ? (
            <AddElderForm
              onClose={() => setAdding(false)}
              onSubmit={(code, rel) => {
                const result = follow(code, rel);
                if (result === "invalid")
                  toast.error("Mã kết nối có dạng ZS-1234, vui lòng kiểm tra lại");
                else if (result === "unknown") toast.error("Không tìm thấy mã kết nối này");
                else if (result === "exists")
                  toast.error("Người này đã có trong danh sách theo dõi");
                else {
                  toast.success("Đã kết nối, từ giờ sẽ nhận cảnh báo của người này");
                  setAdding(false);
                }
                return result === "ok";
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary bg-card text-lg font-bold text-primary"
            >
              <UserPlus className="size-6" /> Thêm người cao tuổi
            </button>
          )}
        </section>

        {current ? (
          <ElderDetail
            key={current.code}
            elder={current}
            now={now}
            onUnfollow={() => {
              unfollow(current.code);
              setSelected(null);
              toast.success(`Đã ngừng theo dõi ${current.title}`);
            }}
          />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
            Chưa theo dõi ai. Bấm “Thêm người cao tuổi” và nhập mã kết nối trên máy của ông bà.
          </p>
        )}
      </main>
    </div>
  );
}

function AddElderForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (code: string, rel: string) => boolean;
}) {
  const [code, setCode] = useState("");
  const [rel, setRel] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit(code, rel)) {
          setCode("");
          setRel("");
        }
      }}
      className="mt-3 space-y-3 rounded-3xl border border-border bg-card p-4 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-primary">Thêm bằng mã kết nối</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <X className="size-5" />
        </button>
      </div>
      <p className="text-base text-muted-foreground">
        Mã kết nối nằm trong mục “Kết nối” trên máy của ông bà.
      </p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Mã kết nối, VD: ZS-1357"
        aria-label="Mã kết nối"
        autoCapitalize="characters"
        className="input-zasa tracking-widest"
      />
      <input
        value={rel}
        onChange={(e) => setRel(e.target.value)}
        placeholder="Quan hệ (VD: Ông nội)"
        aria-label="Quan hệ"
        className="input-zasa"
      />
      <button
        type="submit"
        disabled={!code.trim()}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-bold text-primary-foreground disabled:opacity-50"
      >
        <UserPlus className="size-5" /> Kết nối
      </button>
      <p className="text-sm text-muted-foreground">
        Mã mẫu để thử: {[LOCAL_ELDER_CODE, ...DEMO_ELDERS.map((e) => e.code)].join(", ")}
      </p>
    </form>
  );
}

function ElderDetail({
  elder,
  now,
  onUnfollow,
}: {
  elder: ElderView;
  now: number;
  onUnfollow: () => void;
}) {
  const alerts = elder.activities.filter(isAlert);
  const correct = elder.results.reduce((s, r) => s + r.correct, 0);
  const total = elder.results.reduce((s, r) => s + r.total, 0);
  const donePercent = Math.round((elder.results.length / TOTAL_LESSONS) * 100);
  const tel = `tel:${elder.phone.replace(/\s/g, "")}`;

  return (
    <>
      <section className="rounded-3xl bg-secondary p-5 shadow-soft">
        <p className="text-sm text-secondary-foreground">Đang xem</p>
        <p className="text-2xl font-extrabold text-primary">{elder.title}</p>
        <p className="text-base text-secondary-foreground">{elder.phone}</p>
        <div className="mt-4 flex gap-3">
          <a
            href={tel}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground"
          >
            <PhoneCall className="size-5" /> Gọi ngay
          </a>
          <AlertDialog>
            <AlertDialogTrigger className="flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-base font-semibold text-primary">
              <UserMinus className="size-5" /> Ngừng theo dõi
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">
                  Ngừng theo dõi {elder.title}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Sẽ không nhận cảnh báo của người này nữa. Có thể kết nối lại bằng mã {elder.code}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-12 rounded-full text-base">
                  Giữ lại
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onUnfollow}
                  className="h-12 rounded-full bg-destructive text-base text-destructive-foreground hover:bg-destructive/90"
                >
                  Ngừng theo dõi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <AlertTriangle className="size-6 text-warning" /> Cảnh báo rủi ro
        </h2>
        {alerts.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
            Chưa có cảnh báo nào. {elder.title} vẫn an toàn.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {alerts.map((a) => {
              const level = RISK_LEVELS[a.risk ?? "warn"];
              const LevelIcon = level.icon;
              return (
                <li key={a.id} className={`rounded-2xl border p-4 shadow-soft ${level.soft}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-lg font-bold text-foreground">
                      <LevelIcon className={`size-6 shrink-0 ${level.iconColor}`} />
                      {level.short}
                    </p>
                    <span className="text-xs text-muted-foreground">{timeAgo(a.at, now)}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="mt-0.5 text-base leading-snug text-foreground">{a.desc}</p>
                  <a
                    href={tel}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-base font-semibold text-primary-foreground"
                  >
                    <PhoneCall className="size-5" /> Gọi ngay cho {elder.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <GraduationCap className="size-6" /> Tình hình học tập
        </h2>
        <div className="mt-3 space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <Award className="size-8 text-primary" />
            <div>
              <p className="text-base text-muted-foreground">Điểm tích lũy</p>
              <p className="text-3xl font-extrabold text-primary">{elder.points} điểm</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Bài học đã hoàn thành</span>
              <span className="font-semibold text-primary">
                {elder.results.length}/{TOTAL_LESSONS}
              </span>
            </div>
            <Progress value={donePercent} className="mt-2 h-3" />
          </div>
          <p className="text-base text-foreground">
            Trả lời đúng ngay lần đầu <strong className="text-success">{correct}</strong>/{total}{" "}
            câu hỏi.
          </p>
          <ul className="space-y-2">
            {elder.results.length === 0 ? (
              <li className="text-base text-muted-foreground">
                {elder.title} chưa hoàn thành bài học nào.
              </li>
            ) : (
              elder.results.map((r) => (
                <li
                  key={r.lessonId}
                  className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-base text-primary">{r.title}</span>
                  <span className="ml-2 shrink-0 text-base font-bold text-success">
                    {r.correct}/{r.total}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <ShieldCheck className="size-6" /> Hoạt động gần đây
        </h2>
        <ul className="mt-3 space-y-3">
          {elder.activities.length === 0 ? (
            <li className="rounded-2xl border border-border bg-card p-4 text-lg text-muted-foreground shadow-soft">
              Chưa có hoạt động nào.
            </li>
          ) : (
            elder.activities.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <UserRound className="size-6 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary">{a.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{a.desc}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at, now)}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
