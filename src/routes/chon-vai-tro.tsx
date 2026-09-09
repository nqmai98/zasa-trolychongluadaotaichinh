import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HeartHandshake, UserRound } from "lucide-react";
import logo from "@/assets/zasa-shield.png";
import { useRole } from "@/lib/zasa-store";

export const Route = createFileRoute("/chon-vai-tro")({
  head: () => ({
    meta: [
      { title: "Bạn là Ông/Bà hay Con/Cháu? — ZASA" },
      {
        name: "description",
        content:
          "Chọn vai trò để ZASA hiển thị giao diện phù hợp: người cao tuổi học và kiểm tra lừa đảo, con cháu theo dõi và cảnh báo.",
      },
      { property: "og:title", content: "Chọn vai trò của bạn — ZASA" },
      { property: "og:description", content: "Giao diện riêng cho ông bà và cho con cháu." },
    ],
  }),
  component: RolePicker,
});

function RolePicker() {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const pick = (role: "elder" | "family") => {
    setRole(role);
    navigate({ to: role === "elder" ? "/trang-chu" : "/nguoi-than", replace: true });
  };

  return (
    <div
      className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-10"
      style={{ background: "var(--gradient-sky)" }}
    >
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="Logo ZASA" width={768} height={768} className="w-24" />
        <h1 className="mt-3 text-3xl font-extrabold text-primary">Bạn là ai?</h1>
        <p className="mt-2 text-lg text-primary/80">Chọn để ZASA hiển thị đúng giao diện cho bạn.</p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={() => pick("elder")}
          className="flex w-full items-center gap-4 rounded-3xl border border-border bg-card p-5 text-left shadow-soft active:scale-95"
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <UserRound className="size-9" />
          </span>
          <span>
            <span className="block text-2xl font-bold text-primary">Tôi là Ông / Bà</span>
            <span className="block text-base text-muted-foreground">
              Học bài, kiểm tra tin nhắn đáng ngờ, hỏi trợ lý AI
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => pick("family")}
          className="flex w-full items-center gap-4 rounded-3xl border border-border bg-card p-5 text-left shadow-soft active:scale-95"
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-accent/30 text-primary">
            <HeartHandshake className="size-9" />
          </span>
          <span>
            <span className="block text-2xl font-bold text-primary">Tôi là Con / Cháu</span>
            <span className="block text-base text-muted-foreground">
              Kết nối, nhận cảnh báo rủi ro và xem tình hình học tập của ông bà
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
