// Compiles every src/resumes/<role>.tex (skip _base.tex) to src/resumes/<role>.pdf
// using pdflatex (two passes). Verifies the one-page rule with pdfinfo.
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const buildDir = "/tmp/opencode/texbuild";
fs.mkdirSync(buildDir, { recursive: true });

const texFiles = fs
  .readdirSync(path.join(process.cwd(), "src", "resumes"))
  .filter((f) => f.endsWith(".tex") && !f.startsWith("_"));

let failures = 0;
for (const tex of texFiles) {
  const src = path.join(process.cwd(), "src", "resumes", tex);
  const slug = tex.replace(/\.tex$/, "");
  for (let pass = 1; pass <= 2; pass++) {
    execSync(
      `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=${buildDir} ${src}`,
      { stdio: "pipe" },
    );
  }
  const pdf = path.join(buildDir, `${slug}.pdf`);
  fs.copyFileSync(pdf, path.join(process.cwd(), "src", "resumes", `${slug}.pdf`));
  let pages = "?";
  try {
    pages = execSync(`pdfinfo ${pdf}`).toString().match(/Pages:\s+(\d+)/)?.[1] ?? "?";
  } catch {}
  if (pages !== "1") failures++;
  console.log(`src/resumes/${slug}.pdf  (${pages} page${pages === 1 ? "" : "s"})`);
}
if (failures > 0) { console.error(`ONE-PAGE RULE VIOLATED by ${failures} resume(s)`); process.exit(1); }
