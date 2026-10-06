const fs = require("node:fs/promises");
const path = require("node:path");
const escape = value => String(value || "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
const slugValue = req => String(req.query?.slug || "");
async function metadata(slug) {
  const base = process.env.PORTY_BACKEND_URL || "https://portfolioai-backend-q5a5.onrender.com/api";
  const response = await fetch(`${base.replace(/\/$/, "")}/portfolio/meta/${encodeURIComponent(slug)}`, { signal: AbortSignal.timeout(6000) });
  if(!response.ok) return null;
  return (await response.json()).data;
}
module.exports = async function(req,res) {
  const slug = slugValue(req);
  if(!/^[a-zA-Z0-9-]{1,200}$/.test(slug)) return res.status(400).send("Invalid portfolio link");
  let html;
  try { html = await fs.readFile(path.join(process.cwd(),"build/index.html"),"utf8"); }
  catch { return res.status(503).send("Portfolio page is being prepared. Please retry shortly."); }
  let data;
  try { data = await metadata(slug); } catch { /* Client fetch retains its retry/error behavior. */ }
  if(data) {
    const origin = process.env.PORTY_PUBLIC_ORIGIN || `https://${req.headers.host}`;
    const url = `${origin}/p/${encodeURIComponent(slug)}`;
    const title = [data.name,data.title,"Porty"].filter(Boolean).join(" · ");
    const description = String(data.about || data.title || "").slice(0,160);
    html = html.replace(/<title>.*?<\/title>/s,`<title>${escape(title)}</title>`).replace(/<meta (?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g,"");
    const image = `${origin}/api/portfolio-cover?slug=${encodeURIComponent(slug)}`;
    const meta = `<meta name="description" content="${escape(description)}"><meta property="og:type" content="profile"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><link rel="canonical" href="${escape(url)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}">${/^data:image\/(jpeg|png);base64,/.test(data.thumbnail || "") ? `<meta property="og:image" content="${escape(image)}"><meta name="twitter:image" content="${escape(image)}">` : ""}`;
    html = html.replace("</head>",meta+"</head>");
  }
  res.setHeader("Content-Type","text/html; charset=utf-8"); res.setHeader("Cache-Control","no-store"); return res.status(200).send(html);
};
module.exports.metadata = metadata;
module.exports.escape = escape;
