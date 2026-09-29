import type { RateUpdated } from "../services/rates-consumer/src/types";

export const PAIRS = ["USD/NGN", "USD/KES", "USD/ZAR"];

const BASE: Record<string, number> = {
  "USD/NGN": 1580.5,
  "USD/KES": 129.4,
  "USD/ZAR": 18.12,
};

const sequences: Record<string, number> = {};
const current: Record<string, number> = { ...BASE };
let emissions = 0;

/** Next event in the feed for a pair. Sequence increments, rate drifts. */
export function nextRateFor(pair: string): RateUpdated {
  const base = BASE[pair] ?? 1;
  sequences[pair] = (sequences[pair] ?? 0) + 1;
  const drift = (Math.random() - 0.5) * base * 0.002;
  current[pair] = Number(((current[pair] ?? base) + drift).toFixed(4));
  emissions += 1;

  return {
    eventId: `evt-${pair.replace("/", "")}-${sequences[pair]}`,
    pair,
    rate: current[pair] as number,
    sequence: sequences[pair] as number,
    observedAt: new Date().toISOString(),
    provider: emissions % 5 === 0 ? "internal" : "bloomberg",
  };
}

export function resetFixtures(): void {
  for (const key of Object.keys(sequences)) delete sequences[key];
  for (const pair of PAIRS) current[pair] = BASE[pair] as number;
  emissions = 0;
}

/** Test helper. Build an event without touching the feed state. */
export function makeEvent(overrides: Partial<RateUpdated> = {}): RateUpdated {
  return {
    eventId: "evt-test-1",
    pair: "USD/NGN",
    rate: 1580.5,
    sequence: 1,
    observedAt: new Date().toISOString(),
    provider: "bloomberg",
    ...overrides,
  };
}
