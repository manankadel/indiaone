import Link from "next/link";
import { SERVICES } from "@/lib/services";

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">TEN MODULES · ONE WORKFLOW ENGINE</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">One intent-first system, ten citizen journeys</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Each module uses the same <b>CitizenCase</b>, workflow, evidence, and mock-adapter primitives. No custom auth, no custom case model. What varies is copy, schema, and seeded mock data — proving the architecture generalizes.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map(s => (
          <Link key={s.slug} href={s.slug==="fraud" ? "/#start" : `/services/${s.slug}`} className="rounded-[20px] border border-zinc-200 bg-white p-5 hover:shadow-md transition">
            <div className="text-xs font-medium" style={{color:s.color}}>{s.badge}</div>
            <div className="mt-2 font-semibold">{s.title}</div>
            <div className="text-sm text-zinc-600 mt-1">{s.problem}</div>
            <div className="mt-3 text-xs rounded-full bg-zinc-50 border border-zinc-200 inline-flex px-2.5 py-1">{s.mockArtifact}</div>
            <div className="mt-4 text-sm font-medium">Open slice →</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[20px] border border-zinc-200 bg-zinc-900 text-white p-6">
        <div className="text-sm font-semibold">How this proves end-to-end thinking</div>
        <ul className="mt-2 text-sm text-white/80 list-disc pl-5 space-y-1">
          <li>Versioned <span className="font-mono">ServiceDefinition</span> + <span className="font-mono">WorkflowStep</span> JSON drives each module.</li>
          <li>Server validates every transition; client never controls canonical status.</li>
          <li>Mock adapters are deterministic and labelled mock before/after. Real production would require authorized APIs (disclosed).</li>
          <li>One disclosure view explains real / mocked / production dependency for every capability.</li>
        </ul>
      </div>
    </div>
  );
}
