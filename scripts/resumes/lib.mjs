// Shared helpers for the resume pipeline in this repo.
// Paths are repo-root relative: src/data/projects.md, src/data/roles.json, src/resumes/*.
import fs from "fs";
import path from "path";

export function loadEnv() {
  if (process.env.PINECONE_API_KEY) return;
  const file = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

export function parseProjects() {
  const raw = fs.readFileSync(path.join(process.cwd(), "src", "data", "projects.md"), "utf-8");
  const blocks = raw.split(/^## /m).slice(1);
  const projects = [];

  for (const block of blocks) {
    const name = block.slice(0, block.indexOf("\n")).trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const field = (key) => {
      const m = block.match(new RegExp(`^- ${key}: (.*)$`, "m"));
      return m ? m[1].trim() : "";
    };
    const list = (key) => {
      const re = new RegExp(`^- ${key}:\\s*\\n((?:\\s+- .*(?:\\n|$))*)`, "m");
      const m = block.match(re);
      if (!m) return [];
      return m[1].split("\n").map((l) => l.trim())
        .filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim()).filter(Boolean);
    };
    const scores = {};
    for (const line of list("scores")) {
      const m = line.match(/^([\w-]+):\s*(\d+)$/);
      if (m) scores[m[1]] = parseInt(m[2], 10);
    }
    projects.push({
      slug, name,
      kind: field("kind") === "experience" ? "experience" : "project",
      status: field("status") === "validated" ? "validated" : "pending",
      done: field("done") === "true",
      link: field("link"), date: field("date"), stack: field("stack"),
      summary: field("summary"), bullets: list("bullets"), scores,
    });
  }
  return projects;
}
