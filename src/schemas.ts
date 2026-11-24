import { z } from "zod";

export const RoleSchema = z.enum(["WAITER", "RUNNER", "HEAD_WAITER"]);

//What we ACCEPT from the outside world

export const CreateEmployeeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("must be a valid email").transform((e) => e.toLowerCase()),
  role: RoleSchema,
});

//What we PROMISE to send back
export const EmployeeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.email(),
  role: RoleSchema,
});

//Route ids arrive as text ("1"), so coerce them into number
export const IdSchema = z.coerce.number().int().positive();

//Typescript types, generated fromt he schemas
export type Employee = z.infer<typeof EmployeeSchema>;
