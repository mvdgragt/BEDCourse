import { z } from "zod";

const menu = {
  margherita: 100,
  pepperoni: 120,
};

// Schemas
export const PizzaTypeSchema = z.enum(["margherita", "pepperoni"]);

export const PizzaSchema = z.object({
  type: PizzaTypeSchema,
  price: z.number().positive(),
});

export const OrderIdSchema = z.number().int().nonnegative();

export const AmountSchema = z.number().positive();

// Types inferred from the schemas
export type PizzaType = z.infer<typeof PizzaTypeSchema>;
export type Pizza = z.infer<typeof PizzaSchema>;

export const createPizza = (type: unknown): Pizza => {
  const pizzaType = PizzaTypeSchema.parse(type);
  return PizzaSchema.parse({ type: pizzaType, price: menu[pizzaType] });
};

const sendOrder = (pizza: unknown): number => {
  const validPizza = PizzaSchema.parse(pizza);
  console.log(`Sending ${validPizza.type} to the kitchen!`);
  const orderId = Math.floor(Math.random() * 1000);
  return orderId;
};

const chargeCustomer = (orderId: unknown, amount: unknown): boolean => {
  if (orderId === undefined || orderId === null) {
    throw new Error("Cannot charge the cutomer without a valid order ID!");
  }
  const validOrderId = OrderIdSchema.parse(orderId);
  const validAmount = AmountSchema.parse(amount);
  console.log(`Charging ${validAmount}SEK for order #${validOrderId}`);
  return true;
};

const orderPizza = (pizzaType: unknown): boolean => {
  const pizza = createPizza(pizzaType);
  const orderId = sendOrder(pizza);
  const paymentSuccess = chargeCustomer(orderId, pizza.price);
  return paymentSuccess;
};

export { sendOrder, chargeCustomer, orderPizza };
