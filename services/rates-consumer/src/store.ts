import type { AppliedEvent, RateUpdated, StoredRate } from "./types";

const rates = new Map<string, StoredRate>();
const applied: AppliedEvent[] = [];

/** Writes the rate for a pair and records that the event was applied. */
export function upsertRate(event: RateUpdated): void {
  const appliedAt = new Date().toISOString();

  rates.set(event.pair, {
    pair: event.pair,
    rate: event.rate,
    sequence: event.sequence,
    observedAt: event.observedAt,
    provider: event.provider,
    appliedAt,
  });

  applied.push({
    eventId: event.eventId,
    pair: event.pair,
    rate: event.rate,
    sequence: event.sequence,
    appliedAt,
  });
}

export function getRate(pair: string): StoredRate | undefined {
  return rates.get(pair);
}

export function listRates(): StoredRate[] {
  return [...rates.values()].sort((a, b) => a.pair.localeCompare(b.pair));
}

export function getAppliedEvents(limit = 60): AppliedEvent[] {
  return applied.slice(-limit).reverse();
}

export function resetStore(): void {
  rates.clear();
  applied.length = 0;
}
