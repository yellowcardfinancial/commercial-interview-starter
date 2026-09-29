import { upsertRate } from "./store";
import type { RateUpdated } from "./types";

/**
 * Entry point for a rate event arriving from the queue.
 *
 * In production this is the body of a Lambda handler, invoked once per message.
 */
export function handleRateUpdated(event: RateUpdated): void {
  upsertRate(event);
}
