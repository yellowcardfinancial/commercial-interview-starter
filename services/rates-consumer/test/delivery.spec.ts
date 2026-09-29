import { beforeEach, describe, expect, it } from "vitest";
import { makeEvent } from "../../../harness/fixtures";
import { handleRateUpdated } from "../src/handler";
import { getRate, resetStore } from "../src/store";

beforeEach(() => {
  resetStore();
});

describe("baseline", () => {
  it("applies a single event", () => {
    handleRateUpdated(makeEvent({ rate: 1580.5, sequence: 1 }));
    expect(getRate("USD/NGN")?.rate).toBe(1580.5);
  });
});
