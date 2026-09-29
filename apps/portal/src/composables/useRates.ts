import { onUnmounted, ref } from "vue";

export type ApiRate = {
  pair: string;
  rate: number;
  sequence: number;
  observedAt: string;
  provider: string;
  appliedAt: string;
};

const POLL_MS = 3_000;

export function useRates() {
  const rates = ref<ApiRate[]>([]);
  const error = ref<string | null>(null);

  async function poll(): Promise<void> {
    try {
      const res = await fetch("/api/rates");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      rates.value = body.rates ?? [];
      error.value = null;
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : "fetch failed";
    }
  }

  const pollTimer = setInterval(poll, POLL_MS);
  void poll();

  onUnmounted(() => clearInterval(pollTimer));

  return { rates, error, refresh: poll };
}
