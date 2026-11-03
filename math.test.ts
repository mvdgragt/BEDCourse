import { describe, it, expect } from "vitest";
import { add } from "./math";

describe("add", () => {
  it("sums two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
