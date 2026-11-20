// Syncs src/data/projects.md -> Pinecone ("projects" namespace), including
// status, done, kind, and per-role score metadata.
import fs from "fs";
import path from "path";
import { loadEnv, parseProjects } from "./lib.mjs";
loadEnv();

const KEY = process.env.PINECONE_API_KEY;
const NAME = process.env.PINECONE_INDEX || "role-resume-projects";
const H = { "Api-Key": KEY, "X-Pinecone-API-Version": "2025-04", "Content-Type": "application/json" };
if (!KEY) { console.error("PINECONE_API_KEY missing"); process.exit(1); }

let host;
const check = await fetch(`https://api.pinecone.io/indexes/${NAME}`, { headers: H });
if (!check.ok) { console.error(`Index "${NAME}" not found. Run the setup script first.`); process.exit(1); }
host = `https://${(await check.json()).host}`;

const projects = parseProjects();
const records = projects.map((p) => ({
  _id: p.slug,
  chunk_text: [p.name, p.summary, `Stack: ${p.stack}`, ...p.bullets].join("\n"),
  status: p.status,
  done: p.done === true,
  kind: p.kind,
  link: p.link,
  date: p.date,
  stack: p.stack,
  ...Object.fromEntries(Object.entries(p.scores).map(([k, v]) => [`score_${k.replace(/-/g, "_")}`, v])),
}));

for (let i = 0; i < records.length; i += 96) {
  const res = await fetch(`${host}/records/namespaces/projects/upsert`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/x-ndjson" },
    body: records.slice(i, i + 96).map((r) => JSON.stringify(r)).join("\n"),
  });
  if (!res.ok) { console.error("upsert failed:", res.status, await res.text()); process.exit(1); }
  await res.text();
}

// Delete Pinecone records no longer present in the tracker.
const listed = await fetch(`${host}/vectors/list?namespace=projects&limit=100`, { headers: H });
if (listed.ok) {
  const text = await listed.text();
  const validIds = new Set(records.map((r) => r._id));
  const stale = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    for (const v of obj.vectors ?? []) {
      const id = typeof v === "string" ? v : v.id;
      if (!validIds.has(id)) stale.push(id);
    }
  }
  if (stale.length) {
    await fetch(`${host}/vectors/delete`, {
      method: "POST", headers: H,
      body: JSON.stringify({ namespace: "projects", ids: stale }),
    });
    console.log("Removed stale records:", stale.join(", "));
  }
}

console.log(`Synced ${records.length} projects (${records.filter((p) => p.done).length} done) to Pinecone.`);
