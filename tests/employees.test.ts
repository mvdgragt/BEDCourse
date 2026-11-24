import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { z } from "zod";
import { createApp } from "../src/app";
import { EmployeeSchema } from "../src/schemas";

let app: ReturnType<typeof createApp>;
beforeEach(() => {
  app = createApp();
});

const hanna = {
  name: "Hanna Karlsson",
  email: "hanna.karlsson@sundsgarden.se",
  role: "RUNNER",
};

describe("GET /api/employees", () => {
  it("returns all employees in the promised shape", async () => {
    const res = await request(app).get("/api/employees");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(() => z.array(EmployeeSchema).parse(res.body)).not.toThrow();
  });
});

describe("GET /api/employees/:id", () => {
  it("returns one employee", async () => {
    const res = await request(app).get("/api/employees/2");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Erik Didriksson");
  });
});

it("returns 404 for an id that does not exist", async () => {
  const res = await request(app).get("/api/employees/99");
  expect(res.status).toBe(404);
});

it("returns 404 for an id that is not a number", async () => {
  const res = await request(app).get("/api/employees/banana");
  expect(res.status).toBe(404);
});

describe("POST /api/employees", () => {
  it("create an employee and returns 201", async () => {
    //Act
    const res = await request(app).post("/api/employees").send(hanna);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 3, ...hanna });
  });

  it("cleans the data: trims the name, lowercases the email, drops unknown fields", async () => {
    const res = await request(app).post("/api/employees").send({
      name: "Hanna",
      email: "Hanna.Karlsson@Sundsgarden.se",
      role: "RUNNER",
      isAdmin: true,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Hanna");
    expect(res.body.email).toBe("hanna.karlsson@sundsgarden.se");
    expect(res.body).not.toHaveProperty("isAdmin");
  });

  it("rejects invalid data with 400 and explain why", async () => {
    const res = await request(app)
      .post("/api/employees")
      .send({ name: "", email: "fake-email", role: "PIZZA_CHEF" });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.issues)).toEqual(
      expect.arrayContaining(["name", "email", "role"]),
    );
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/api/employees").send(hanna).expect(201);
    const res = await request(app).post("/api/employees").send(hanna);
    expect(res.status).toBe(409);
  });
});

describe("DELETE /api/emplyees/:id", () => {
  it("deletes an employee and returns 204", async () => {
    await request(app).delete("/api/employees/1").expect(204);
  });

  it("returns 404 when the emplyee does not exist", async () => {
    await request(app).delete("/api/employees/99").expect(404);
  });
});

describe("User Journey", () => {
  it("a manager hires looks up and removes an employee", async () => {
    //1. hire
    const created = await request(app)
      .post("/api/employees")
      .send(hanna)
      .expect(201);
    const id = created.body.id;

    //2. Look up
    const found = await request(app).get(`/api/employees/${id}`).expect(200);
    expect(found.body.email).toBe(hanna.email);

    //3. Remove
    await request(app).delete(`/api/employees/${id}`).expect(204);

    //4. Gone
    await request(app).get(`/api/employees/${id}`).expect(404);
  });
});
