export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2 shrink-0">
          <span className={`h-7 w-7 grid place-items-center rounded-full text-xs font-semibold ${i < current ? "bg-emerald-600 text-white" : i === current ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-600"}`}>{i+1}</span>
          <span className={`text-xs font-medium whitespace-nowrap ${i === current ? "text-zinc-900" : "text-zinc-500"}`}>{s}</span>
          {i < steps.length-1 && <span className={`h-px w-6 ${i < current ? "bg-emerald-600" : "bg-zinc-200"}`} />}
        </div>
      ))}
    </div>
  );
}
