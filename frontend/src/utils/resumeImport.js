export async function readResume(file) {
  if (!file || file.size > 5 * 1024 * 1024) throw new Error("Choose a resume smaller than 5 MB.");
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "txt") return file.text();
  if (extension === "docx") {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await (mammoth.default || mammoth).extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ""}/porty-pdf-worker.mjs`;
    const task = pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false });
    let document;
    try { document = await task.promise; if (document.numPages > 30) throw new Error("Choose a resume with 30 pages or fewer."); const pages = []; for (let i = 1; i <= document.numPages; i++) { const page = await document.getPage(i); const content = await page.getTextContent(); pages.push(content.items.map(item => item.str + (item.hasEOL ? "\n" : " ")).join("")); } return pages.join("\n\n"); }
    finally { await task.destroy(); }
  }
  throw new Error("Supported formats: PDF with selectable text, Word (.docx), and text (.txt). For a scanned PDF or older .doc file, paste its text or enter your details manually.");
}
export function resumeProposal(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const email = text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] || "";
  const heading = /^(summary|profile|about|objective|skills|technical skills|projects|experience|education|certifications|achievements)\s*:?...$/i;
  const sections = {}; let current = "header";
  for (const line of lines) { if (heading.test(line)) { current = line.replace(/:$/, "").toLowerCase(); sections[current] ||= []; } else (sections[current] ||= []).push(line); }
  const name = lines[0] && lines[0].length <= 100 && !/@|https?:|resume|curriculum/i.test(lines[0]) ? lines[0] : "";
  const about = ["summary", "profile", "about", "objective"].map(k => (sections[k] || []).join("\n")).find(Boolean) || "";
  const skills = (sections.skills || sections["technical skills"] || []).join(", ").split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
  const projects = (sections.projects || []).map(line => { const split = line.match(/^([^:–—]{1,100})\s*[:–—]\s*(.+)$/); return split ? { title: split[1].trim(), description: split[2].trim(), techStack: [], link: "", github: "", image: "" } : { title: line.slice(0,100), description: "", techStack: [], link: "", github: "", image: "" }; }).slice(0,8);
  return { name, about, email, skills, projects };
}
