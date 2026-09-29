# Rates exercise

A small slice of how FX rates reach a trading screen: a provider feed streams
rate events into a consumer, the consumer stores them, an API serves them, and
a Vue portal polls and renders them.

Everything runs locally. No AWS account, no credentials, no network calls.

## Setup

```bash
npm install
npm run dev     # http://localhost:5173
npm test
```

Please confirm all three commands work before the session. That is the only
preparation needed, and there is nothing to pre-solve.

## Layout

```
services/rates-consumer/   the consumer: receives events, writes to the store
harness/                   the provider feed that generates events
server/api.ts              the API the portal talks to
apps/portal/               Vue 3 + TypeScript front end
```

## Endpoints

| Method | Path                  | Purpose                        |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/rates`          | Current rates for the portal   |
| GET    | `/api/applied-events` | Recent events the consumer applied |
| POST   | `/api/trade`          | Submit a trade on a pair       |

## Notes

- Use your own editor and setup. AI coding tools are welcome; we use them daily.
- The store is in memory, so restarting the dev server clears it.
