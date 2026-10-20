const express = require("express");
const rateLimit = require("express-rate-limit");
const { randomUUID } = require("node:crypto");
const auth = require("../middleware/auth");
const service = require("../services/character");

function createRouter(generate = service.generateCharacter) {
  const router = express.Router(), jobs = new Map();
  const quota = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 3, keyGenerator: req => String(req.userId), standardHeaders: true, legacyHeaders: false, message: { error: "Your daily character limit is reached. Please try again tomorrow." } });
  function prune() { for (const [id, job] of jobs) if (Date.now() - job.created > 10 * 60 * 1000) { job.controller.abort(); jobs.delete(id); } }
  router.get("/status", (_req, res) => res.json({ available: !!service.configuration() }));
  router.post("/", auth, (req, res, next) => {
    if (!service.configuration()) return res.status(503).json({ error: "Character generation is not connected yet. You can still upload an avatar." });
    if (!service.validImage(req.body.image) || !service.STYLES.includes(req.body.style) || req.body.consent !== true) return res.status(400).json({ error: "Choose a PNG, JPG or WebP photo under 4 MB, a character style, and confirm photo processing." });
    prune();
    if ([...jobs.values()].some(job => job.owner === req.userId && job.status === "pending")) return res.status(409).json({ error: "A character is already being generated for your account." });
    if (jobs.size >= 50) return res.status(503).json({ error: "Character generation is busy. Please try again shortly." });
    next();
  }, quota, (req, res) => {
    const id = randomUUID(), controller = new AbortController();
    const job = { owner: req.userId, created: Date.now(), status: "pending", controller };
    jobs.set(id, job);
    const timeout = setTimeout(() => { job.status = "failed"; job.error = "The free GPU took too long. Please try again later."; controller.abort(); }, 240000); timeout.unref();
    Promise.resolve().then(() => generate(req.body.image, req.body.style, { signal: controller.signal })).then(image => {
      if (!controller.signal.aborted) { if (!service.validImage(image, 1024 * 1024)) throw new Error("Invalid image"); job.image = image; job.status = "complete"; }
    }).catch(() => { job.status = "failed"; job.error = "Generation could not finish. The free GPU may be busy or out of quota. Your original photo is unchanged; try again later."; }).finally(() => clearTimeout(timeout));
    res.status(202).json({ id });
  });
  router.get("/:id", auth, (req, res) => {
    prune(); const job = jobs.get(req.params.id);
    if (!job || job.owner !== req.userId) return res.status(404).json({ error: "This generation is unavailable. Please start again." });
    res.set("Cache-Control", "no-store").json({ status: job.status, ...(job.image ? { image: job.image } : {}), ...(job.error ? { error: job.error } : {}) });
  });
  router.delete("/:id", auth, (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job || job.owner !== req.userId) return res.status(404).json({ error: "Generation not found." });
    job.controller.abort(); jobs.delete(req.params.id); res.json({ success: true });
  });
  return router;
}
module.exports = createRouter();
module.exports.createRouter = createRouter;
