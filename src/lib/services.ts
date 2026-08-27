import { ServiceDefinition } from "./types";

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "fda",
    title: "Mundhe Food Suraksha — Nationwide",
    short: "Food adulteration & hygiene — photo se action",
    problem: "Doodh me paani? Hotel ganda? Gutkha? Photo bhejo, 72h me action dekho — Mundhe FDA model, ab pure India me.",
    persona: "Family, nagpur to kochi, kirana / hotel / dark store",
    badge: "Nationwide · Mundhe Model",
    color: "#DC2626",
    intents: ["Doodh me milawat", "Hotel ganda / no license", "Gutkha bech raha", "Dark store cold chain"],
    workflow: [
      { id: "photo", title: "Photo", kind: "evidence" },
      { id: "violation", title: "Violation", kind: "ai_review" },
      { id: "review", title: "Review", kind: "consent" },
      { id: "track", title: "Track FDA", kind: "result" },
    ],
    mockArtifact: "MH-FDA-2026-1131 · ₹49.57cr seized, 56 licences suspended — scaled nationwide",
  },
];

export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
