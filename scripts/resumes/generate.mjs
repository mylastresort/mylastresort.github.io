// Generates one LaTeX resume per role from src/resumes/_base.tex + src/data/roles.json
// + validated DONE projects from src/data/projects.md.
//
// Injection rules (see AGENTS.md "Resume-per-role state"):
//   - status: validated AND done: true AND kind: project AND role score >= 7
//   - top 3 by score, max 2 bullets each (one-page rule)
//   - experience-kind items are never injected (they live in the Experience section)
// Per-role changes: headline, Professional Summary, pdfsubject/pdfkeywords,
// and the Projects section (only when >= 1 project qualifies). Everything else
// stays identical to the base resume — never fabricated, only emphasized.
import fs from "fs";
import path from "path";
import { parseProjects } from "./lib.mjs";

const roles = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "roles.json"), "utf-8")).roles;
const projects = parseProjects();
const base = fs.readFileSync(path.join(process.cwd(), "src", "resumes", "_base.tex"), "utf-8");

const esc = (s) => {
  // Transliterate characters pdflatex (T1/utf8 inputenc) cannot typeset.
  const map = { "→": "->", "←": "<-", "≥": ">=", "≤": "<=", "√": "sqrt", "ⁿ": "^n", "²": "^2", "³": "^3", "≠": "!=", "±": "+/-", "½": "1/2", "¼": "1/4", "¾": "3/4" };
  s = s.replace(/[→←≥≤√ⁿ²³≠±½¼¾]/g, (c) => map[c]);
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/\|/g, "\\textbar{}")
    .replace(/[~^]/g, "");
};

// The line ends with a LaTeX linebreak "\\[1.5pt]" — two literal backslashes.
const headlineRe = /\{\\small Backend[^\n]*\}\\\\\[1\.5pt\]/;
const summaryRe = /(\\section\{Professional Summary\}\n)[\s\S]*?(\\section\{Experience\})/;
const projectsRe = /(\\section\{Projects\}\n)[\s\S]*?(\\section\{Education\})/;

function projectEntry(p) {
  const bullets = p.bullets.map((b) => `  \\item ${esc(b)}`).join("\n");
  // Trailing \\ forces the stack line below the title/date line (like the base resume).
  const link = p.link
    ? `\\entry{\\href{${p.link}}{${esc(p.name)}}}{${esc(p.date)}}\\\\`
    : `\\entry{${esc(p.name)}}{${esc(p.date)}}\\\\`;
  return [
    link,
    `\\subentry{${esc(p.stack)}}{}`,
    `\\begin{itemize}`,
    bullets,
    `\\end{itemize}`,
  ].join("\n");
}

for (const role of roles) {
  let tex = base;

  tex = tex.replace(headlineRe, `{\\small ${esc(role.headline)}}\\\\[1.5pt]`);
  tex = tex.replace(summaryRe, (m, head, tail) => `${head}${esc(role.summary)}\n\n${tail}`);
  tex = tex.replace(/pdfsubject=\{[^}]*\}/, `pdfsubject={${role.name}}`);
  tex = tex.replace(/pdfkeywords=\{[^}]*\}/, `pdfkeywords={${role.keywords}}`);

  const validated = projects
    .filter((p) => p.kind === "project" && p.status === "validated" && p.done === true && (p.scores[role.slug] ?? 0) >= 7)
    .sort((a, b) => (b.scores[role.slug] ?? 0) - (a.scores[role.slug] ?? 0))
    .slice(0, 3)
    .map((p) => ({ ...p, bullets: p.bullets.slice(0, 2) }));

  if (validated.length > 0) {
    const body = validated.map(projectEntry).join("\n\n\\vspace{0.40em}\n\n");
    tex = tex.replace(projectsRe, (m, head, tail) => `${head}% Auto-generated from src/data/projects.md (validated + done, score >= 7)\n${body}\n\n${tail}`);
  }

  fs.writeFileSync(path.join(process.cwd(), "src", "resumes", `${role.slug}.tex`), tex);
  console.log(
    `src/resumes/${role.slug}.tex  (projects injected: ${validated.length ? validated.map((p) => p.slug).join(", ") : "none — done-gate kept base projects"})`,
  );
}
