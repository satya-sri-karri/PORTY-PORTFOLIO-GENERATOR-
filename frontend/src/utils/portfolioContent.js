// Rendering contract only: normalization never changes the builder or saved record.
const text = value => typeof value === "string" ? value : "";
const object = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const strings = value => Array.isArray(value) ? value.filter(v => typeof v === "string" && v.trim()) : [];
const rows = value => Array.isArray(value) ? value.filter(v => v && typeof v === "object" && !Array.isArray(v)) : [];
export function externalURL(value) {
  const source = text(value).trim();
  if (!source || source.startsWith("//") || /^(?!https?:)[a-z][a-z\d+.-]*:/i.test(source)) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(source) ? source : `https://${source}`);
    return /^https?:$/.test(url.protocol) && (url.hostname.includes(".") || /^https?:\/\//i.test(source)) ? url.href : "";
  } catch { return ""; }
}
export function imageURL(value) {
  const source = text(value).trim();
  if (/^data:image\/[a-z0-9+.-]+;base64,/i.test(source) || /^\/(?!\/)/.test(source)) return source;
  return externalURL(source);
}
const normalizeRows = (value, fields, links = []) => rows(value).map(row => ({
  ...row,
  ...Object.fromEntries(fields.map(field => [field, text(row[field])])),
  ...Object.fromEntries(links.map(field => [field, externalURL(row[field])])),
})).filter(row => fields.some(field => row[field].trim()) || links.some(field => row[field]));
export function normalizePortfolio(input = {}) {
  const data = object(input);
  const contact = object(data.contact), socials = object(data.socialLinks), colors = object(data.themeColors);
  return {
    ...data,
    ...Object.fromEntries(["name", "title", "about", "location"].map(field => [field, text(data[field])])),
    avatarUrl: imageURL(data.avatarUrl),
    skills: strings(data.skills),
    projects: rows(data.projects).map(project => ({ ...project,
      ...Object.fromEntries(["title", "description", "problem", "contribution", "process", "outcome"].map(field => [field, text(project[field])])),
      techStack: strings(project.techStack), link: externalURL(project.link), github: externalURL(project.github), image: imageURL(project.image), featured: project.featured === true,
    })).filter(project => [project.title, project.description, project.image, project.link, project.github, project.problem, project.contribution, project.process, project.outcome].some(value => value.trim())),
    experience: normalizeRows(data.experience, ["role", "company", "duration", "description"]).map(row => ({ ...row, current: row.current === true })),
    certifications: normalizeRows(data.certifications, ["title", "issuer", "date"], ["credentialUrl"]),
    achievements: normalizeRows(data.achievements, ["title", "description", "date", "icon"]).filter(item => item.title || item.description || item.date),
    codingProfiles: normalizeRows(data.codingProfiles, ["platform", "username", "rating", "solved"], ["url"]),
    contact: { ...contact, email: text(contact.email), phone: text(contact.phone) },
    socialLinks: Object.fromEntries(["github", "linkedin", "twitter", "website"].map(field => [field, externalURL(socials[field])])),
    themeColors: Object.fromEntries(["accent", "bg", "text"].map(field => [field, /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(text(colors[field])) ? colors[field] : ""])),
  };
}
export function profileLinks(data) {
  return [["GitHub", data.socialLinks.github], ["LinkedIn", data.socialLinks.linkedin], ["Twitter", data.socialLinks.twitter], ["Website", data.socialLinks.website], ["Email", data.contact.email && `mailto:${data.contact.email}`], ["Phone", data.contact.phone && `tel:${data.contact.phone}`]].filter(([, href]) => href).map(([label, href]) => ({ label, href }));
}
export function projectStory(project) {
  return [["The problem", project.problem], ["My contribution", project.contribution], ["The process", project.process], ["The outcome", project.outcome]].filter(([, value]) => value?.trim());
}
export function orderedProjects(projects) {
  const selected = projects.findIndex(project => project.featured);
  return selected > 0 ? [projects[selected], ...projects.filter((_, i) => i !== selected)] : projects;
}
export function readableOn(hex) {
  const short = hex.replace("#", "");
  const value = short.length === 3 ? short.split("").map(c => c + c).join("") : short;
  const channels = [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return (lum + 0.05) / 0.05 >= 1.05 / (lum + 0.05) ? "#000000" : "#ffffff";
}
