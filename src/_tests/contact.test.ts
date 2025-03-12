import { describe, it, expect, beforeAll, afterAll } from "bun:test";

const administrator = {
  username: "irapuan.menezes@csitech.com.br",
  password: "1234567890@A",
};

let token: string = "";

beforeAll(async () => {
  const response = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: administrator.username, password: administrator.password }),
  });

  const data = await response.json();
  token = data.token;
});

describe("List contacts", () => {
  it("should list contacts", async () => {
    const response = await fetch("http://localhost:3000/contact/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});