"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Experiment } from "@/config/schema";
import { chooseVariant, type ExperimentAssignments } from "@/lib/experiments";

const ExperimentContext = createContext<ExperimentAssignments>({});

export function ExperimentProvider({ experiments, children }: { experiments: Experiment[]; children: React.ReactNode }) {
  const [assignments, setAssignments] = useState<ExperimentAssignments>({});

  useEffect(() => {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);
    }
    const next = Object.fromEntries(
      experiments.filter((experiment) => experiment.enabled).map((experiment) => {
        const key = `experiment:${experiment.id}`;
        const existing = localStorage.getItem(key);
        const variant = existing && experiment.variants.some((item) => item.id === existing)
          ? existing
          : chooseVariant(experiment, visitorId!);
        localStorage.setItem(key, variant);
        return [experiment.id, variant];
      })
    );
    const timer = window.setTimeout(() => setAssignments(next), 0);
    return () => window.clearTimeout(timer);
  }, [experiments]);

  return <ExperimentContext.Provider value={useMemo(() => assignments, [assignments])}>{children}</ExperimentContext.Provider>;
}

export const useExperiments = () => useContext(ExperimentContext);
