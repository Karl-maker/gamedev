"use client";

import type { Experiment } from "@/config/schema";
import { getOverrides } from "@/lib/experiments";
import { useExperiments } from "./experiment-provider";

function useHeroOverrides(experiment?: Experiment) {
  const assignments = useExperiments();
  return experiment ? getOverrides(experiment, assignments[experiment.id]) : {};
}

export function HeroHeading({ experiment, children }: { experiment?: Experiment; children: string }) {
  const overrides = useHeroOverrides(experiment);
  return <h1>{overrides.heroTitle ?? children}</h1>;
}

export function HeroCta({ experiment, children }: { experiment?: Experiment; children: string }) {
  const overrides = useHeroOverrides(experiment);
  return <>{overrides.heroCta ?? children}</>;
}
