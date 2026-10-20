const STYLES = ["soft-3d", "clay", "chibi"];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function configuration() {
  const url = process.env.HF_CHARACTER_SPACE_URL || "";
  const key = process.env.HF_CHARACTER_SPACE_KEY || "";
  return /^https:\/\/[a-z0-9][a-z0-9-]*\.hf\.space\/?$/.test(url) && key.length >= 32
    ? { url: url.replace(/\/$/, ""), key, token: process.env.HF_TOKEN || "" } : null;
}
function validImage(image, maximum = MAX_IMAGE_BYTES) {
  if (typeof image !== "string" || image.length > Math.ceil(maximum * 4 / 3) + 80) return false;
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > maximum || bytes.toString("base64") !== match[2]) return false;
  return match[1] === "png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : match[1] === "jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}
async function generateCharacter(image, style, { signal, fetchImpl = fetch } = {}) {
  const config = configuration();
  if (!config) throw new Error("Character service is not configured.");
  const headers = { "Content-Type": "application/json", "X-Porty-Key": config.key, ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}) };
  const endpoint = `${config.url}/gradio_api/call/generate`;
  const started = await fetchImpl(endpoint, { method: "POST", headers, body: JSON.stringify({ data: [image, style] }), signal, redirect: "error" });
  if (!started.ok) throw new Error("Character service could not accept the request.");
  const { event_id: id } = await started.json();
  if (typeof id !== "string" || !/^[\w-]{1,128}$/.test(id)) throw new Error("Invalid generation response.");
  const response = await fetchImpl(`${endpoint}/${id}`, { headers, signal, redirect: "error" });
  if (!response.ok || !response.body) throw new Error("Character service is unavailable.");
  const decoder = new TextDecoder(); let buffer = "", size = 0;
  try {
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > 3 * 1024 * 1024) throw new Error("Generation response is too large.");
      buffer += decoder.decode(chunk, { stream: true }).replace(/\r/g, "");
      let end;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, end); buffer = buffer.slice(end + 2);
        const kind = event.match(/^event:\s*(\w+)/m)?.[1];
        if (kind === "error") throw new Error("Generation failed or the free GPU quota is exhausted.");
        if (kind === "complete") {
          const data = event.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trim()).join("\n");
          const result = JSON.parse(data)?.[0]?.image;
          if (!validImage(result, 1024 * 1024)) throw new Error("Invalid generated image.");
          return result;
        }
      }
    }
  } finally { if (!response.body.locked) await response.body.cancel().catch(() => {}); }
  throw new Error("Generation ended without an image.");
}
module.exports = { STYLES, configuration, validImage, generateCharacter };
