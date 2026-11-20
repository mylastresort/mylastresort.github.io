// Writes src/resumes/<role>-pending.md next to each resume: the top 3
// NOT-DONE projects by that role's score (desc) — the work list per role.
import fs from "fs";
import path from "path";
import { parseProjects } from "./lib.mjs";

const roles = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "roles.json"), "utf-8")).roles;
const projects = parseProjects();

for (const role of roles) {
  const pending = projects
    .filter((p) => p.kind === "project" && p.done === false && (p.scores[role.slug] ?? 0) > 0)
    .sort((a, b) => (b.scores[role.slug] ?? 0) - (a.scores[role.slug] ?? 0))
    .slice(0, 3);

  let md = `# Pending projects — ${role.name}\n\n`;
  md += `Highest-scoring *not-done* projects for this role (resume: \`${role.slug}.pdf\`).\n`;
  md += `Completing one and marking it \`done: true\` in \`src/data/projects.md\` makes it eligible\n`;
  md += `for injection into the resume (needs role score >= 7).\n\n`;

  if (pending.length === 0) {
    md += "_No pending projects with a nonzero score for this role._\n";
  } else {
    for (const p of pending) {
      md += `## ${p.name} — ${p.scores[role.slug]}/10\n\n`;
      md += `- ${p.summary}\n`;
      if (p.stack) md += `- Stack: ${p.stack}\n`;
      if (p.link) md += `- ${p.link}\n`;
      md += `\n`;
    }
  }

  fs.writeFileSync(path.join(process.cwd(), "src", "resumes", `${role.slug}-pending.md`), md);
  console.log(`src/resumes/${role.slug}-pending.md  (${pending.map((p) => `${p.slug}:${p.scores[role.slug]}`).join(", ") || "none"})`);
}
