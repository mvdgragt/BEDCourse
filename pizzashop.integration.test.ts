import { orderPizza } from "./pizzashop";
import { describe, test, expect } from "vitest";

describe("Pizza Shop Integration Test", () => {
  test("should successfully complete a full pizza order", () => {
    const result = orderPizza("margherita");
    expect(result).toBe(true);
  });
});
