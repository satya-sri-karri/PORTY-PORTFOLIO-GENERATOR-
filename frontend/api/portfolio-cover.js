const { metadata } = require("./portfolio-page");
module.exports = async function(req,res) {
  const slug=String(req.query?.slug || "");
  if(!/^[a-zA-Z0-9-]{1,200}$/.test(slug)) return res.status(400).send("Invalid link");
  try { const data=await metadata(slug); const match = (data?.thumbnail || "").match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/); if(!match) return res.status(404).send("No saved cover available"); res.setHeader("Content-Type",`image/${match[1]}`); res.setHeader("Cache-Control","no-store"); return res.status(200).send(Buffer.from(match[2],"base64")); }
  catch { return res.status(503).send("Cover unavailable"); }
};
