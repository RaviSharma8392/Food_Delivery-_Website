import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { email, name, phoneNumber, password, address } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      phoneNumber,
      password: passwordHash,
      address,
    });

    const newUser = await user.save();

    const token = generateToken(newUser._id, newUser.role);

res.cookie("token", token, {
  httpOnly: true,
  secure: true, // must be true for sameSite: "None"
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(201).json({ success: true, message: "User created successfully!" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter all details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("role", user.role, {
      httpOnly: true,
      secure: false, // Can be made true if not needed by frontend JS
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
