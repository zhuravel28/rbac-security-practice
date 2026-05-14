const request = require("supertest");
const app = require("../src/app");

describe("RBAC File Management API", () => {
  test("API should be running", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("RBAC File Management API is running");
  });

  test("Should return 401 when user is not authenticated", async () => {
    const res = await request(app).get("/me");

    expect(res.statusCode).toBe(401);
  });

  test("Admin can read confidential file", async () => {
    const res = await request(app)
      .get("/files/3")
      .set("x-user-id", "1");

    expect(res.statusCode).toBe(200);
    expect(res.body.accessLevel).toBe("confidential");
  });

  test("Manager can read confidential file", async () => {
    const res = await request(app)
      .get("/files/3")
      .set("x-user-id", "2");

    expect(res.statusCode).toBe(200);
  });

  test("Employee cannot read confidential file", async () => {
    const res = await request(app)
      .get("/files/3")
      .set("x-user-id", "3");

    expect(res.statusCode).toBe(403);
  });

  test("Guest can read public file", async () => {
    const res = await request(app)
      .get("/files/1")
      .set("x-user-id", "4");

    expect(res.statusCode).toBe(200);
    expect(res.body.accessLevel).toBe("public");
  });

  test("Guest cannot read corporate file", async () => {
    const res = await request(app)
      .get("/files/2")
      .set("x-user-id", "4");

    expect(res.statusCode).toBe(403);
  });

  test("Employee can create file", async () => {
    const res = await request(app)
      .post("/files")
      .set("x-user-id", "3")
      .send({
        name: "new-employee-file.txt",
        accessLevel: "corporate"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.ownerId).toBe(3);
  });

  test("Guest cannot create file", async () => {
    const res = await request(app)
      .post("/files")
      .set("x-user-id", "4")
      .send({
        name: "guest-file.txt",
        accessLevel: "public"
      });

    expect(res.statusCode).toBe(403);
  });

  test("Employee cannot delete another user's file because of IDOR protection", async () => {
    const res = await request(app)
      .delete("/files/2")
      .set("x-user-id", "3");

    expect(res.statusCode).toBe(403);
  });

  test("Admin can delete any file", async () => {
    const res = await request(app)
      .delete("/files/4")
      .set("x-user-id", "1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("File deleted");
  });

  test("Employee cannot change file access level", async () => {
    const res = await request(app)
      .patch("/files/1/access")
      .set("x-user-id", "3")
      .send({
        accessLevel: "confidential"
      });

    expect(res.statusCode).toBe(403);
  });

  test("Manager can change file access level", async () => {
    const res = await request(app)
      .patch("/files/1/access")
      .set("x-user-id", "2")
      .send({
        accessLevel: "corporate"
      });

    expect(res.statusCode).toBe(200);
  });

  test("User cannot change own role because of privilege escalation protection", async () => {
    const res = await request(app)
      .patch("/users/3/role")
      .set("x-user-id", "3")
      .send({
        role: "admin"
      });

    expect(res.statusCode).toBe(403);
  });
});