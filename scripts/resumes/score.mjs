// Recalculates per-role project scores from Pinecone similarity and writes
// them back into src/data/projects.md.
//
// For each role: query Pinecone with the role profile (name + headline +
// summary + keywords), rank all projects by _score (cosine similarity), then
//     score = round(10 * sim / max_sim_of_role)   clamped to 0..10
//     sim < 0.25 => score capped at 6 (weak absolute match)
//     sim < 0.12 => score capped at 1 (noise floor)
import fs from "fs";
import path from "path";
import { loadEnv, parseProjects } from "./lib.mjs";
loadEnv();

const KEY = process.env.PINECONE_API_KEY;
const NAME = process.env.PINECONE_INDEX || "role-resume-projects";
const H = { "Api-Key": KEY, "X-Pinecone-API-Version": "2025-04", "Content-Type": "application/json" };
if (!KEY) { console.error("PINECONE_API_KEY missing"); process.exit(1); }

const idxRes = await fetch(`https://api.pinecone.io/indexes/${NAME}`, { headers: H });
if (!idxRes.ok) { console.error(`Index "${NAME}" not found`); process.exit(1); }
const host = `https://${(await idxRes.json()).host}`;

const roles = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "roles.json"), "utf-8")).roles;
const projects = parseProjects();

const sim = {};
for (const role of roles) {
  const queryText = `${role.name}. ${role.headline}. ${role.summary}. ${role.keywords}`;
  const res = await fetch(`${host}/records/namespaces/projects/search`, {
    method: "POST", headers: H,
    body: JSON.stringify({ query: { inputs: { text: queryText }, top_k: Math.max(projects.length, 50) }, fields: [] }),
  });
  if (!res.ok) { console.error("search failed:", res.status, await res.text()); process.exit(1); }
  const data = await res.json();
  sim[role.slug] = Object.fromEntries((data.result?.hits ?? []).map((h) => [h._id, h._score]));
}

const raw = fs.readFileSync(path.join(process.cwd(), "src", "data", "projects.md"), "utf-8");
const blocks = raw.split(/^## /m);
const newBlocks = [blocks[0]];
const table = [];

for (let i = 1; i < blocks.length; i++) {
  let block = blocks[i];
  const name = block.slice(0, block.indexOf("\n")).trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const row = { project: slug, scores: {} };
  for (const role of roles) {
    const s = sim[role.slug]?.[slug] ?? 0;
    const maxSim = Math.max(...Object.values(sim[role.slug]), 0.0001);
    let score = Math.round(10 * (s / maxSim));
    if (s < 0.25) score = Math.min(score, 6);
    if (s < 0.12) score = Math.min(score, 1);
    row.scores[role.slug] = Math.max(0, Math.min(10, score));
    block = block.replace(new RegExp(`(  - ${role.slug.replace(/-/g, "\\-")}: )\\d+`), `$1${row.scores[role.slug]}`);
  }
  table.push(row);
  newBlocks.push(block);
}

fs.writeFileSync(path.join(process.cwd(), "src", "data", "projects.md"), newBlocks.join("## "));

console.log(["project", ...roles.map((r) => r.slug)].join("\t"));
for (const row of table) console.log([row.project, ...roles.map((r) => row.scores[r.slug])].join("\t"));
