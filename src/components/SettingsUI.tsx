import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, type LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function SettingSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function SettingLink({
  to,
  icon: Icon,
  label,
  desc,
  badge,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  badge?: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft active:scale-[0.98]"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-lg font-bold text-foreground">
          {label}
          {badge}
        </span>
        <span className="block text-base text-muted-foreground">{desc}</span>
      </span>
      <ChevronRight className="size-6 shrink-0 text-muted-foreground" />
    </Link>
  );
}

export function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <span className="flex-1">
        <span className="block text-lg font-bold text-foreground">{label}</span>
        {desc ? <span className="block text-base text-muted-foreground">{desc}</span> : null}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="h-8 w-14 [&>span]:size-7 [&>span]:data-[state=checked]:translate-x-6"
      />
    </label>
  );
}

export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = 2,
}: {
  label: string;
  value: T;
  options: {
    id: T;
    label: ReactNode;
    desc?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
  }[];
  onChange: (v: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            onClick={() => onChange(o.id)}
            style={o.style}
            className={`relative flex min-h-16 flex-col justify-center rounded-2xl border-2 bg-card px-3 py-2 text-left shadow-soft disabled:opacity-50 ${
              active ? "border-primary" : "border-border"
            }`}
          >
            <span className="pr-6 text-lg font-bold text-foreground">{o.label}</span>
            {o.desc ? <span className="text-sm text-muted-foreground">{o.desc}</span> : null}
            {active ? (
              <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-4" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
