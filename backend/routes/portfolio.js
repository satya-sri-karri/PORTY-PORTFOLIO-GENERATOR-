const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const auth = require("../middleware/auth");

const editableFields = ["name", "title", "about", "avatarUrl", "location", "skills", "projects", "experience", "certifications", "achievements", "codingProfiles", "contact", "socialLinks", "theme", "themeColors", "isPublic", "thumbnail", "availability", "motto", "interests", "resumeUrl", "showLocation", "motion", "sectionOrder", "sectionVisibility", "audience", "showcaseOptIn"];
const editableData = body => Object.fromEntries(editableFields.filter(key => Object.prototype.hasOwnProperty.call(body, key)).map(key => [key, body[key]]));
// Public responses never expose ownership, recovery state or hidden contact content.
const publicData = portfolio => {
  const raw = portfolio.toObject ? portfolio.toObject({ flattenMaps: true }) : portfolio;
  const data = { ...editableData(raw), shareSlug: raw.shareSlug, views: raw.views, createdAt: raw.createdAt, updatedAt: raw.updatedAt };
  const hidden = data.sectionVisibility || {};
  for (const field of ["about", "skills", "projects", "experience"]) if(hidden[field] === false) data[field] = field === "about" ? "" : [];
  if(hidden.credentials === false) { data.certifications=[]; data.achievements=[]; }
  if(hidden.profiles === false) data.codingProfiles=[];
  if(hidden.contact === false) { data.contact={}; data.socialLinks={}; data.resumeUrl=""; }
  if(data.showLocation === false) data.location="";
  return data;
};
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
    const portfolios = await Portfolio.find({ userId: req.userId, deletedAt: null })
      .select("name title theme themeColors shareSlug createdAt updatedAt views isPublic avatarUrl thumbnail analytics audience")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: portfolios });
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolios." });
  }
});

router.get("/trash", auth, async (req, res) => {
  try { res.json({ success: true, data: await Portfolio.find({ userId: req.userId, deletedAt: { $gte: new Date(Date.now() - 2592000000) } }).select("name title deletedAt").sort({ deletedAt: -1 }) }); }
  catch { res.status(500).json({ error: "Trash could not be loaded." }); }
});
router.get("/showcase", async (req, res) => {
  try { res.json({ success: true, data: await Portfolio.find({ isPublic: true, showcaseOptIn: true, deletedAt: null }).select("name title theme themeColors motion shareSlug thumbnail").sort({ updatedAt: -1 }).limit(60) }); }
  catch { res.status(500).json({ error: "Showcase could not be loaded." }); }
});
// No view increment for metadata or social crawlers.
router.get("/meta/:slug", async (req, res) => {
  try {
    const data = await Portfolio.findOne({ shareSlug: req.params.slug, isPublic: true, deletedAt: null }).select("name title about thumbnail shareSlug sectionVisibility");
    if (!data) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, data: publicData(data) });
  } catch { res.status(500).json({ error: "Metadata unavailable." }); }
});
router.post("/events/:slug", async (req, res) => {
  const type = req.body.type;
  if (!["project", "resume", "contact"].includes(type)) return res.status(400).json({ error: "Unsupported event." });
  try {
    const portfolio = await Portfolio.findOneAndUpdate({ shareSlug: req.params.slug, isPublic: true, deletedAt: null }, { $inc: { [`analytics.${type}`]: 1 } }, { new: true, timestamps: false });
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Event could not be recorded." }); }
});

// Public share (no auth)
router.get("/share/:slug", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      shareSlug: req.params.slug,
      isPublic: true, deletedAt: null,
    });
    if (!portfolio)
      return res.status(404).json({ error: "Portfolio not found." });

    const counted = await Portfolio.findOneAndUpdate({ shareSlug: req.params.slug, isPublic: true, deletedAt: null }, { $inc: { views: 1 } }, { new: true, timestamps: false });
    if(!counted) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, data: publicData(counted) });
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolio." });
  }
});

// Get one (owner only)
router.get("/:id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId, deletedAt: null });
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
      { _id: req.params.id, userId: req.userId, deletedAt: null },
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

// Move to Trash; permanent removal is a separate, explicit owner action.
router.delete("/:id", auth, async (req, res) => {
  try {
    const existing = await Portfolio.findOne({ _id: req.params.id, userId: req.userId, deletedAt: null });
    if (!existing) return res.status(404).json({ error: "Portfolio not found." });
    const portfolio = await Portfolio.findOneAndUpdate({ _id: req.params.id, userId: req.userId, deletedAt: null }, { $set: { deletedAt: new Date(), wasPublicBeforeDelete: Boolean(existing.isPublic), isPublic: false } }, { new: true });
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });
    res.json({ success: true, message: "Moved to Trash. Restore within 30 days." });
  } catch { res.status(500).json({ error: "Failed to move portfolio to Trash." }); }
});
router.post("/:id/restore", auth, async (req, res) => {
  try {
    const query = { _id: req.params.id, userId: req.userId, deletedAt: { $gte: new Date(Date.now() - 2592000000) } };
    const existing = await Portfolio.findOne(query);
    if (!existing) return res.status(404).json({ error: "This portfolio is no longer available to restore." });
    const portfolio = await Portfolio.findOneAndUpdate(query, { $set: { deletedAt: null, isPublic: Boolean(existing.wasPublicBeforeDelete) } }, { new: true });
    if (!portfolio) return res.status(404).json({ error: "This portfolio is no longer available to restore." });
    res.json({ success: true, data: portfolio });
  } catch { res.status(500).json({ error: "Restore failed. Try again." }); }
});
router.delete("/:id/permanent", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.userId, deletedAt: { $ne: null } });
    if (!portfolio) return res.status(404).json({ error: "Trashed portfolio not found." });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Permanent deletion failed." }); }
});

module.exports = router;
