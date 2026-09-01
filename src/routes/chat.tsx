import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import logo from "@/assets/zasa-shield.png";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat với trợ lý ZASA" },
      {
        name: "description",
        content: "Hỏi trợ lý ZASA bất cứ điều gì về tin nhắn, cuộc gọi hoặc yêu cầu chuyển tiền đáng ngờ.",
      },
      { property: "og:title", content: "Chat với trợ lý ZASA" },
      { property: "og:description", content: "Trợ lý trò chuyện thân thiện, giải thích đơn giản, dễ hiểu." },
    ],
  }),
  component: Chat,
});

type Msg = { id: number; role: "user" | "zasa"; text: string };

const suggestions = [
  "Tin nhắn báo trúng thưởng có thật không?",
  "Công an gọi bảo tôi chuyển tiền, tôi nên làm gì?",
  "Có nên đọc mã OTP cho người khác?",
];

function reply(q: string) {
  if (/otp|mã/i.test(q))
    return "Bà tuyệt đối không đọc mã OTP cho ai, kể cả người xưng là nhân viên ngân hàng. Mã OTP giống chìa khoá két sắt của bà ạ.";
  if (/công an|toà|toa an/i.test(q))
    return "Công an không bao giờ yêu cầu chuyển tiền qua điện thoại. Bà hãy tắt máy và gọi ngay cho con cháu, hoặc gọi 113 để xác minh.";
  return "Đây rất có thể là lừa đảo bà ạ. Bà đừng bấm vào đường link, đừng chuyển tiền. Bà có thể dán tin nhắn vào mục Kiểm tra để ZASA phân tích giúp.";
}

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, role: "zasa", text: "Chào bà ạ! Bà có tin nhắn hay cuộc gọi nào đáng ngờ không? Bà cứ kể cho cháu nghe nhé." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: Date.now(), role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: Date.now() + 1, role: "zasa", text: reply(t) }]);
    }, 900);
  }

  return (
    <AppShell title="Chat AI" back="/trang-chu">
      <div className="space-y-4">
        {msgs.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-lg leading-relaxed text-primary-foreground">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2">
              <img src={logo} alt="" width={768} height={768} loading="lazy" className="size-9 shrink-0" />
              <p className="max-w-[85%] text-lg leading-relaxed text-foreground">{m.text}</p>
            </div>
          ),
        )}
        {typing ? <p className="pl-11 text-lg text-muted-foreground">ZASA đang trả lời…</p> : null}
        <div ref={endRef} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-primary shadow-soft"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="fixed inset-x-0 bottom-20 mx-auto flex max-w-lg items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bà nhập câu hỏi tại đây…"
          aria-label="Nhập câu hỏi"
          className="h-14 flex-1 rounded-full border border-input bg-card px-5 text-lg outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          aria-label="Gửi"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          <Send className="size-6" />
        </button>
      </form>
    </AppShell>
  );
}
