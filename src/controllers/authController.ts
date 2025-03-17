import { Elysia } from "elysia";
import { SignJWT } from "jose";
import User from "../models/User";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY as string);

export const authController = new Elysia()
  .post("/login", async ({ body }) => {
    /*
      Login
      - Check if user exists
      - Check if password is correct
      - Check if account is locked
      - Generate token
      - Return token
    */

    const { email, password } = body as { email: string; password: string };

    const user = await User.findOne({ email }).populate("company");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    if (user.failedLoginAttempts >= 5) {
      return new Response(JSON.stringify({ message: "Account locked" }), {
        status: 403,
      });
    }

    const isValidPassword = await Bun.password.verify(password, user.password);
    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      await user.save();
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    user.failedLoginAttempts = 0;
    await user.save();

    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      companyId: user.company._id,
      permissions: user.permissions,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(SECRET_KEY);

    return { token };
  })

  /*
    Register
    - Check if user exists
    - Check if password is correct
    - Check if account is locked
    - Generate token
    - Return token
  */

  .post("/register", async ({ body }) => {
    const { name, email, phone, password, companyId, permissions } = body as {
      name: string;
      email: string;
      phone: string;
      password: string;
      companyId: string;
      permissions: string[];
    };

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      company: companyId,
      permissions,
    });

    await user.save();
    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
      }
    );
  });
