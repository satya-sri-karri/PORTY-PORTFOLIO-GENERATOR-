const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendOTP } = require("../utils/email");

const sign = (userId, name, tokenVersion = 0) =>
  jwt.sign({ userId, name, tokenVersion }, process.env.JWT_SECRET, { expiresIn: "7d" });

const crypto = require("crypto");
const generateOTP = () => crypto.randomInt(100000, 1000000).toString();
const digest = otp => crypto.createHash("sha256").update(String(otp)).digest("hex");
const normalizeEmail = email => typeof email === "string" ? email.trim().toLowerCase() : "";

router.post("/send-otp", async (req, res) => {
  try {
    const { name } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!email) return res.status(400).json({ error: "Email is required." });

    const existing = await User.findOne({ email });
    if (existing && existing.password)
      return res.status(409).json({ error: "Email already registered. Sign in instead." });

    if (existing?.otpSentAt && Date.now() - new Date(existing.otpSentAt).getTime() < 60000) return res.status(429).json({ error: "Please wait one minute before requesting another code." });
    const otp = generateOTP();
    await sendOTP(email, otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    if (existing) {
      existing.otp = digest(otp);
      existing.otpSentAt = new Date(); existing.otpAttempts = 0;
      existing.otpExpiry = otpExpiry;
      if (name) existing.name = name.trim();
      await existing.save();
    } else {
      const user = new User({ email, name: name?.trim(), otp: digest(otp), otpExpiry, otpSentAt: new Date(), otpAttempts: 0 });
      await user.save();
    }

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { otp, name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required." });
    if (!password || password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry)
      return res.status(401).json({ error: "No OTP requested. Request a new one." });

    if (Date.now() > new Date(user.otpExpiry).getTime())
      return res.status(401).json({ error: "OTP expired. Request a new one." });

    if (user.password) return res.status(409).json({ error: "Email already registered. Sign in instead." });
    if (user.otpAttempts >= 5) return res.status(429).json({ error: "Too many attempts. Request a new code after the cooldown." });
    if (user.otp !== digest(otp) && user.otp !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1; await user.save();
      return res.status(401).json({ error: "Invalid OTP." });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.password = password;
    if (name && !user.name) user.name = name.trim();
    await user.save();

    res.json({
      success: true,
      token: sign(user._id, user.name || email, user.tokenVersion || 0),
      user: { id: user._id, name: user.name || email, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required." });

    const user = await User.findOne({ email }).select("+tokenVersion");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    res.json({
      success: true,
      token: sign(user._id, user.name, user.tokenVersion || 0),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

// Recovery uses a separate code, so registration cannot overwrite an existing password.
router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
    const user = await User.findOne({ email });
    if (user?.password) {
      if (user.resetSentAt && Date.now() - new Date(user.resetSentAt).getTime() < 60000) return res.status(429).json({ error: "Wait one minute before requesting another recovery code." });
      const otp = generateOTP(); await sendOTP(email, otp);
      user.resetOtp = digest(otp); user.resetExpiry = new Date(Date.now() + 300000); user.resetSentAt = new Date(); user.resetAttempts = 0;
      await user.save();
    }
    res.json({ success: true, message: "If this email has an account, a recovery code has been sent. It expires in five minutes." });
  } catch { res.status(503).json({ error: "Recovery email could not be sent. Please try again later." }); }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (typeof password !== "string" || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
    const user = await User.findOne({ email: normalizeEmail(req.body.email) }).select("+tokenVersion");
    if (!user?.resetOtp || !user.resetExpiry || Date.now() > new Date(user.resetExpiry).getTime()) return res.status(400).json({ error: "Recovery code is unavailable or expired. Request a new code." });
    if (user.resetAttempts >= 5) return res.status(429).json({ error: "Too many attempts. Request a new recovery code." });
    if (user.resetOtp !== digest(otp)) { user.resetAttempts = (user.resetAttempts || 0) + 1; await user.save(); return res.status(400).json({ error: "Invalid recovery code." }); }
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.password = password; user.resetOtp = null; user.resetExpiry = null; user.otp = null; user.otpExpiry = null;
    await user.save(); res.json({ success: true, message: "Password updated. Sign in with your new password." });
  } catch { res.status(500).json({ error: "Could not reset your password. Try again." }); }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-otp -otpExpiry -resetOtp -resetExpiry -password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

module.exports = router;
