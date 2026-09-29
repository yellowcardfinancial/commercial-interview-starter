<script setup lang="ts">
import { ref } from "vue";
import { useRates, type ApiRate } from "../composables/useRates";

const { rates, error } = useRates();
const status = ref<string>("");

async function trade(row: ApiRate): Promise<void> {
  const res = await fetch("/api/trade", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pair: row.pair }),
  });
  const body = await res.json();
  status.value = res.ok
    ? `Traded ${body.pair} at ${body.rate}`
    : `Rejected: ${body.error} on ${body.pair ?? "unknown pair"}`;
}
</script>

<template>
  <section>
    <h1>Commercial rates</h1>
    <p v-if="error" role="alert">Could not load rates: {{ error }}</p>

    <table>
      <thead>
        <tr>
          <th scope="col">Pair</th>
          <th scope="col">Rate</th>
          <th scope="col">Updated</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rates" :key="row.pair">
          <th scope="row">{{ row.pair }}</th>
          <td class="num">{{ row.rate }}</td>
          <td class="num">{{ new Date(row.observedAt).toLocaleTimeString() }}</td>
          <td><button type="button" @click="trade(row)">Trade</button></td>
        </tr>
      </tbody>
    </table>

    <p aria-live="polite" class="status">{{ status }}</p>
  </section>
</template>

<style scoped>
section { font-family: system-ui, sans-serif; padding: 2rem; max-width: 46rem; }
table { border-collapse: collapse; width: 100%; }
th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e5e5; }
.num { font-variant-numeric: tabular-nums; }
.status { min-height: 1.5rem; font-size: 0.875rem; }
</style>
