import { afterAll, beforeAll, describe, expect, it } from "bun:test";

const administrator = {
  username: "irapuan.menezes@csitech.com.br",
  password: "1234567890@A",
};

let token: string = "";
let users: any[] = [];
let newUser: any = {};
let userAnotherCompany: any = {}

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

describe("About Me", () => {
  it("should get about me", async () => {
    const response = await fetch("http://localhost:3000/user/aboutme", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("About Me with Depth", () => {
  it("should get about me", async () => {
    const response = await fetch("http://localhost:3000/user/aboutme?depth=1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("About Me", () => {
  it("should get about me", async () => {
    const response = await fetch("http://localhost:3000/user/aboutme", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("List users", () => {
  it("should list users", async () => {
    const response = await fetch("http://localhost:3000/user/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json(); 
    users = data;
    
    expect(response.status).toBe(200);
  });
});

describe("List users from another company", () => {
  it("should list users", async () => {
    const response = await fetch("http://localhost:3000/user/list?companyId=91443357-278d-4f53-a7bf-0b00ac4fc394", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    users.push(...data);
    
    expect(response.status).toBe(200);
  });
});

describe("Get user", () => {
  it("should get user", async () => {
    const response = await fetch(`http://localhost:3000/user/${users[0].id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("Get user with Depth", () => {
  it("should get user", async () => {
    const response = await fetch(`http://localhost:3000/user/${users[0].id}?depth=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("Add user", () => {
  it("should add user", async () => {
    if (users.findIndex((user) => user.email === "test@test.com") !== -1) {
      newUser = users.find((user) => user.email === "test@test.com");
      return;
    }

    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        name: "test",
        email: "test@test.com",
        phone: "1234567890",
        password: "test",
      }),
    });

    const data = await response.json();
    users.push(data);
    newUser = data;

    expect(response.status).toBe(201);
  });
});

describe("Add user to another company", () => {
  it("should add user to another company", async () => {
    if (users.findIndex((user) => user.email === "test@rbm.net.br") !== -1) {
      const user = users.find((user) => user.email === "test@rbm.net.br");
      userAnotherCompany = user;
      return;
    }

    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        name: "Test RBM",
        email: "test@rbm.net.br",
        phone: "1234567890",
        password: "test",
        companyId: "91443357-278d-4f53-a7bf-0b00ac4fc394",
      }),
    });

    const data = await response.json();
    users.push(data);
    userAnotherCompany = data;
    
    expect(response.status).toBe(201);
  });
});

describe("Get user from another company", () => {
  it("should get user", async () => {
    const response = await fetch(`http://localhost:3000/user/${userAnotherCompany.id}?companyId=91443357-278d-4f53-a7bf-0b00ac4fc394`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe("Update user", () => {
  it("should update user", async () => {
    const response = await fetch(`http://localhost:3000/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: newUser.id,
        name: "Test Updated",
      }),
    });

    expect(response.status).toBe(200);
  });
});

describe("Update user from another company", () => {
  it("should update user", async () => {
    const response = await fetch(`http://localhost:3000/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: userAnotherCompany.id,
        name: "Test RBM Updated",
        companyId: "91443357-278d-4f53-a7bf-0b00ac4fc394",
      }),
    });

    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  const response = await fetch("http://localhost:3000/user/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  expect(data.message).toBe("Logout success");
});