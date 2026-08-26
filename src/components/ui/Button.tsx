import { cn } from "@/lib/utils";
export function Button({ className, variant="primary", size="md", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "accent"; size?: "md" | "lg" | "sm" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { sm: "h-9 px-4 text-sm", md: "h-11 px-6 text-[15px]", lg: "h-[52px] px-8 text-[16px]" }[size];
  const vars = {
    primary: "bg-zinc-900 text-white hover:bg-black",
    accent: "bg-[#FF5A1F] text-white hover:bg-[#E8541B] shadow-sm",
    outline: "border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900",
    ghost: "hover:bg-zinc-100 text-zinc-700",
  }[variant];
  return <button className={cn(base, sizes, vars, className)} {...p} />;
}
export function Pill({ children, tone="neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" | "success" | "warning" }) {
  const map = {
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
    accent: "bg-[#FFF1EB] text-[#9A3412] border-[#FFD9C2]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", map)}>{children}</span>;
}
