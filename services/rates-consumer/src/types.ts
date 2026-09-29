export type Provider = "bloomberg" | "internal";

/**
 * Emitted by a rate provider and delivered to this consumer via a queue.
 *
 * eventId    unique per emission. A redelivery carries the SAME eventId.
 * sequence   monotonically increasing per pair, assigned by the provider.
 * observedAt when the provider observed this rate, per the provider's clock.
 */
export type RateUpdated = {
  eventId: string;
  pair: string;
  rate: number;
  sequence: number;
  observedAt: string;
  provider: Provider;
};

export type StoredRate = {
  pair: string;
  rate: number;
  sequence: number;
  observedAt: string;
  provider: Provider;
  appliedAt: string;
};

export type AppliedEvent = {
  eventId: string;
  pair: string;
  rate: number;
  sequence: number;
  appliedAt: string;
};
