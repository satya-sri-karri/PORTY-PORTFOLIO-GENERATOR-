/**
 * Portfolio Generator v3 — Express Server
 * MERN Stack | JWT Auth | Gemini AI | 12 Themes
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const isHealthOrPing = req =>
  req.originalUrl === "/api/health" || req.originalUrl === "/api/ping";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  skip: isHealthOrPing,
  message: { error: "Too many requests. Please try again later." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "AI rate limit reached. Please wait a moment." },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/", limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/metrics", require("./routes/metrics"));
app.use("/api/ai", aiLimiter, require("./routes/ai"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "3.1.0",
    message: "Portfolio Generator API v3",
    timestamp: new Date().toISOString(),
  });
});

// Minimal keep-alive ping (tiny response, cron-friendly)
app.get("/api/ping", (req, res) => res.send("ok"));

// SMTP/HTTPS reachability diagnostic (temporary)
app.get("/api/smtp-check", async (req, res) => {
  const net = require("net");
  const hosts = [
    { host: "api.sendgrid.com", port: 443, label: "SendGrid-API(443)" },
    { host: "smtp.sendgrid.net", port: 587, label: "SendGrid" },
    { host: "smtp-relay.brevo.com", port: 587, label: "Brevo" },
    { host: "smtp.gmail.com", port: 587, label: "Gmail" },
    { host: "smtp.gmail.com", port: 465, label: "Gmail-465" },
  ];
  const results = await Promise.all(hosts.map(h => new Promise(resolve => {
    const sock = net.connect({ host: h.host, port: h.port, timeout: 6000 });
    const done = ok => { try { sock.destroy(); } catch {} resolve({ label: h.label, host: h.host, port: h.port, ok }); };
    sock.on("connect", () => done(true));
    sock.on("timeout", () => done(false));
    sock.on("error", () => done(false));
  })));
  res.json({ results });
});

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Connect DB + Start ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio-v3")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🤖 AI endpoint: http://localhost:${PORT}/api/ai`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
