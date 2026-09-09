import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/zasa-shield.png";
import { useRole } from "@/lib/zasa-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZASA — Trợ lý chống lừa đảo tài chính cho người cao tuổi" },
      {
        name: "description",
        content:
          "ZASA giúp người cao tuổi nhận biết và phòng tránh lừa đảo tài chính trên Zalo: kiểm tra tin nhắn, học bài học ngắn, chat với trợ lý AI.",
      },
      { property: "og:title", content: "ZASA — Trợ lý chống lừa đảo tài chính" },
      {
        property: "og:description",
        content: "Kiểm tra tin nhắn lừa đảo, học kỹ năng an toàn và kết nối người thân.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { role, ready } = useRole();
  const [dot, setDot] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setDot((d) => (d + 1) % 3), 500);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const go = setTimeout(
      () =>
        navigate({
          to: role === "elder" ? "/trang-chu" : role === "family" ? "/nguoi-than" : "/chon-vai-tro",
          replace: true,
        }),
      2200,
    );
    return () => clearTimeout(go);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, role]);

  return (
    <div
      className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-8 text-center"
      style={{ background: "var(--gradient-sky)" }}
    >
      <img src={logo} alt="Logo ZASA" width={768} height={768} className="w-52 animate-pulse" />
      <h1 className="mt-2 text-6xl font-extrabold tracking-tight text-primary">ZASA</h1>
      <p className="mt-10 text-xl font-semibold leading-relaxed text-primary">
        Trợ lý chống lừa đảo tài chính trên Zalo
        <br />
        dành cho người cao tuổi
      </p>
      <div className="mt-auto pb-12">
        <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</p>
        <div className="mt-3 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full ${i === dot ? "bg-primary" : "bg-primary/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
