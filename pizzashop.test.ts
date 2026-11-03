import { describe, test, expect } from "vitest";
import { createPizza, orderPizza, sendOrder } from "./pizzashop";

describe("Pizza Shop Unit Tests", () => {
  test("createPizza returns correct type and price", () => {
    const pizza = createPizza("margherita");

    expect(pizza).toEqual({ type: "margherita", price: 100 });
  });

  test("createPizza throws for unknown type", () => {
    expect(() => createPizza("hawaii")).toThrow();
  });

  test("sendOrder returns a numeric order id", () => {
    const id = sendOrder({ type: "pepperoni", price: 120 });

    expect(typeof id).toBe("number");
    expect(Number.isInteger(id)).toBe(true);
    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThan(1000);
  });

  test("orderPizza returns true for a valid pizza", () => {
    const result = orderPizza("pepperoni");

    expect(result).toBe(true);
  });
});
