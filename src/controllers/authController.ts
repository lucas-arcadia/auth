import { SignJWT } from "jose";
import User from "../models/User";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY as string);

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("company");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await Bun.password.verify(password, user.password)
    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    } 

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    await user.save();

    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      companyId: user.company._id,
      permissions: user.permissions,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    res.json({ token });
      
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const register = async (req: any, res: any) => {
  try {
    const { name, email, phone, password, companyId, permissions } = req.body;

    const hashedPassword = await Bun.password.hash(password);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      company: companyId,
      permissions,
    });
    
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(400).json({ message: "Registration failed" });
  }
};

