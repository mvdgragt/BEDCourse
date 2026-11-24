import express from "express";
import { z } from "zod";
import { CreateEmployeeSchema, IdSchema, type Employee } from "./schemas";

export const createApp = () => {
  const app = express();
  app.use(express.json());

  const employees: Employee[] = [
    {
      id: 1,
      name: "Michiel van der Gragt",
      email: "michiel.vandergragt@sundsgarden.se",
      role: "HEAD_WAITER",
    },
    {
      id: 2,
      name: "Erik Didriksson",
      email: "Erik.Didriksson@sundsgarden.se",
      role: "WAITER",
    },
  ];
  let nextId = 3;

  const findIndex = (rawId: string) => {
    const id = IdSchema.safeParse(rawId);
    return id.success ? employees.findIndex((e) => e.id === id.data) : -1;
  };

  app.get("/api/employees", (req, res) => {
    res.json(employees);
  });

  app.get("/api/employees/:id", (req, res) => {
    const index = findIndex(req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json(employees[index]);
  });

  app.post("/api/employees", (req, res) => {
    const result = CreateEmployeeSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        issues: z.flattenError(result.error).fieldErrors,
      });
      return;
    }

    if (employees.some((e) => e.email === result.data.email)) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    //const employee = { id: nextId++, ...req.body };
    const employee: Employee = { id: nextId++, ...result.data };

    employees.push(employee);
    res.status(201).json(employee);
  });

  app.delete("/api/employees/:id", (req, res) => {
    const index = findIndex(req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    employees.splice(index, 1);
    res.status(204).end();
  });

  return app;
};
