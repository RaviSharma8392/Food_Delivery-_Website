import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../utils/generateToken.js";
import nodemailer from "nodemailer";
// import User from "../models/User.js";
import crypto from "crypto";
// import bcrypt from "bcrypt";
// import nodemailer from "nodemailer";

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



const resetTokens = {}; // In-memory store for reset tokens (good for testing)


// ✅ Helper: Send reset email
const sendEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
  
  secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,           // Replace with your Gmail
      pass: process.env.EMAILPaSS,        // Use App Password (not normal password)
    },
  });

 await transporter.sendMail({
    from: '"Munchizo" <munchizobhimtal@gmail.com>',
    to,
    subject: "Reset Your Munchizo Account Password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ff6b6b; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Munchizo</h1>
            <p style="color: white; margin: 5px 0 0; font-size: 16px;">Bhimtal's Favorite Food Delivery</p>
        </div>
        
        <div style="padding: 25px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">We received a request to reset your Munchizo account password. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #ff6b6b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                    Reset Password
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">If you didn't request this password reset, please ignore this email. Your account is safe and no changes have been made.</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">For security reasons, this link will expire in 1 hour.</p>
            
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
            
            <p style="font-size: 14px; color: #666;">Need help? Contact our support team at <a href="mailto:support@munchizo.com" style="color: #ff6b6b;">support@munchizo.com</a></p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Munchizo - Bhimtal's Premier Food Delivery Service</p>
            <p style="margin: 5px 0 0;">Deliciousness delivered to your doorstep</p>
        </div>
    </div>
    `,
});
};

// ✅ Step 1: Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 15 * 60 * 1000;

  resetTokens[email] = { token, expires };

  const resetLink = `http://localhost:5173/reset-password/${token}?email=${email}`;
  await sendEmail(email, resetLink);

  res.json({ message: "Reset link sent to your email." });
};

// ✅ Step 2: Reset Password
export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  const saved = resetTokens[email];
  if (!saved || saved.token !== token || Date.now() > saved.expires) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  delete resetTokens[email]; // Remove token after use

  res.json({ message: "Password successfully updated." });
};








