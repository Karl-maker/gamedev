import type { Experiment } from "@/config/schema";

export type ExperimentAssignments = Record<string, string>;

export function chooseVariant(experiment: Experiment, seed: string): string {
  const total = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0);
  let hash = 2166136261;
  for (const char of `${experiment.id}:${seed}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  let bucket = (hash >>> 0) % total;
  for (const variant of experiment.variants) {
    if (bucket < variant.weight) return variant.id;
    bucket -= variant.weight;
  }
  return experiment.variants[0].id;
}

export function getOverrides(experiment: Experiment, variantId: string) {
  return experiment.variants.find((variant) => variant.id === variantId)?.overrides ?? {};
}
