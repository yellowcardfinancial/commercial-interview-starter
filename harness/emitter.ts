import type { RateUpdated } from "../services/rates-consumer/src/types";
import { PAIRS, nextRateFor } from "./fixtures";

export type HarnessConfig = {
  /** Probability (0..1) that a delivered message is also redelivered. */
  duplicateRate: number;
  /** Milliseconds of random delivery jitter. Non-zero means arrival order is not emission order. */
  reorderWindow: number;
  /** Probability (0..1) that a message is never delivered. */
  dropRate: number;
  /** Milliseconds between feed ticks. Every tick emits one event per pair. */
  intervalMs: number;
};

const DEFAULTS: HarnessConfig = {
  duplicateRate: 0,
  reorderWindow: 0,
  dropRate: 0,
  intervalMs: 1000,
};

export function createHarness(sink: (event: RateUpdated) => void) {
  let config: HarnessConfig = { ...DEFAULTS };
  let timer: ReturnType<typeof setInterval> | null = null;

  function deliver(event: RateUpdated): void {
    if (Math.random() < config.dropRate) return;

    const jitter = config.reorderWindow > 0 ? Math.random() * config.reorderWindow : 0;
    setTimeout(() => sink(event), jitter);

    if (Math.random() < config.duplicateRate) {
      setTimeout(() => sink(event), jitter + 50 + Math.random() * 400);
    }
  }

  // Every pair on every tick, so consecutive events for the same pair are one
  // interval apart. If they were further apart than reorderWindow, jitter could
  // never actually reorder anything.
  function tick(): void {
    for (const pair of PAIRS) deliver(nextRateFor(pair));
  }

  function start(): void {
    if (!timer) timer = setInterval(tick, config.intervalMs);
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function configure(patch: Partial<HarnessConfig>): HarnessConfig {
    const wasRunning = timer !== null;
    config = { ...config, ...patch };
    if (wasRunning) {
      stop();
      start();
    }
    return { ...config };
  }

  return { start, stop, configure, getConfig: () => ({ ...config }) };
}
