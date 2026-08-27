import { ServiceDefinition } from "./types";

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "fda",
    title: "Mundhe Food Suraksha — Nationwide",
    short: "Food adulteration & hygiene — photo se action",
    problem: "Doodh me milawat ya kitchen unsafe? Photo, location aur violation chip se a report that an authorised food-safety officer can act on.",
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
    mockArtifact: "Synthetic demo · inspired by Maharashtra FDA’s 2026 inspection drive",
  },
];

export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
