import request from "supertest";
import { HttpStatusCode } from "../../src/Controllers/HttpStatusCode.Enum";
import app from "../../src/server";

describe("API Integrations tests", () => {
  const username: string = `fcc_test_${Number(new Date())}`;
  let userId: string;

  // Endpoint: POST /users
  it("Deve criar um usuário e retornar seus dados", async () => {
    const res = await request(app).post("/users").send({ username });

    expect(res.status).toBe(HttpStatusCode.Created);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username");
    expect(res.body.username).toEqual(username);

    userId = res.body._id;
  });

  // Endpoint: POST /users/:_id/exercises
  it("Deve criar um exercício para um usuário e retornar seus dados", async () => {
    const res = await request(app).post(`/users/${userId}/exercises`).send({
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
    });

    expect(res.status).toBe(HttpStatusCode.Created);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(userId);
    expect(res.body).toHaveProperty("username");
    expect(res.body.username).toEqual(username);
    expect(res.body).toHaveProperty("description");
    expect(res.body.description).toEqual("test");
    expect(res.body).toHaveProperty("duration");
    expect(res.body.duration).toEqual(60);
    expect(res.body).toHaveProperty("date");
    expect(res.body.date).toEqual("Mon Jan 01 1990");
  });

  // Endpoint: GET /users
  it("Deve retornar uma lista de usuários", async () => {
    const res = await request(app).get("/users");

    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body).toContainEqual({ username, _id: userId });
  });

  // Endpoint: GET /users/:_id/logs
  it("Deve retornar o registro de exercícios de um usuário", async () => {
    const res = await request(app).get(`/users/${userId}/logs`);

    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username");
    expect(res.body.username).toEqual(username);
    expect(res.body).toHaveProperty("count");
    expect(res.body.count).toEqual(1);
    expect(res.body).toHaveProperty("log");
    expect(res.body.log).toContainEqual({
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
    });
  });
});
