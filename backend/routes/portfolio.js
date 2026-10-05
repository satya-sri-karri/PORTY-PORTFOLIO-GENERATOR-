const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const auth = require("../middleware/auth");

const editableFields = ["name", "title", "about", "avatarUrl", "location", "skills", "projects", "experience", "certifications", "achievements", "codingProfiles", "contact", "socialLinks", "theme", "themeColors", "isPublic", "thumbnail"];
const editableData = body => Object.fromEntries(editableFields.filter(key => Object.prototype.hasOwnProperty.call(body, key)).map(key => [key, body[key]]));
const createdResponse = (portfolio, reused = false) => ({
  success: true, data: { id: portfolio._id, shareSlug: portfolio.shareSlug, reused },
});

// Create
router.post("/", auth, async (req, res) => {
  try {
    const data = { ...editableData(req.body), userId: req.userId };
    const clientRequestId = req.body.clientRequestId;
    if (clientRequestId !== undefined) {
      if (typeof clientRequestId !== "string" || !/^[a-f0-9-]{36}$/i.test(clientRequestId))
        return res.status(400).json({ error: "Invalid save request. Please try again." });
      data.clientRequestId = clientRequestId;
      const existing = await Portfolio.findOne({ userId: req.userId, clientRequestId });
      if (existing) return res.status(200).json(createdResponse(existing, true));
    }
    if (!data.name || !data.about)
      return res.status(400).json({ error: "Name and About are required." });

    let portfolio;
    try { portfolio = await Portfolio.create(data); }
    catch (err) {
      if (err.code !== 11000 || !clientRequestId) throw err;
      const existing = await Portfolio.findOne({ userId: req.userId, clientRequestId });
      if (!existing) throw err;
      return res.status(200).json(createdResponse(existing, true));
    }
    res.status(201).json(createdResponse(portfolio));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Failed to create portfolio." });
  }
});

// Get all mine
router.get("/my", auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.userId })
      .select("name title theme shareSlug createdAt updatedAt views isPublic avatarUrl thumbnail")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: portfolios });
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolios." });
  }
});

// Public share (no auth)
router.get("/share/:slug", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      shareSlug: req.params.slug,
      isPublic: true,
    });
    if (!portfolio)
      return res.status(404).json({ error: "Portfolio not found." });

    portfolio.views += 1;
    await portfolio.save();
    res.json({ success: true, data: portfolio });
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolio." });
  }
});

// Get one (owner only)
router.get("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId });
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, data: portfolio });
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolio." });
  }
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const update = editableData(req.body);

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, data: portfolio });
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(", ") });
    res.status(500).json({ error: "Failed to update portfolio." });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, message: "Portfolio deleted." });
  } catch {
    res.status(500).json({ error: "Failed to delete portfolio." });
  }
});

module.exports = router;
