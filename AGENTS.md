# AGENTS.md

## Update Evaluation Loop

Whenever the user says "update" (or asks to update/change something about the portfolio/site), follow this loop:

1. **Open the target page in Chromium/Chrome** using headless/browser tooling (e.g. `playwright`, `puppeteer`, or Chrome DevTools MCP if available) and capture a screenshot + DOM snapshot of the relevant route after the change is built/served locally.
2. **Compare against intent**: check alignment with the user's request and the existing site's design (typography, spacing, colors, components, nav/sidebar). Pay attention to layout shifts, broken links, responsive behavior.
3. **Auto-correct**: fix obvious issues (styles, markup, routing) without asking if it's clearly a regression against the existing pattern. If it's ambiguous or would change the design significantly, ask before proceeding.
4. **Re-evaluate**: rebuild (`npm run build`) and re-capture until the rendered page matches the requested update. Stop only when the visual/output looks correct.
5. **Report**: summarize what changed, what was corrected, and attach/point to the captured evidence (screenshot path) in the response.

Notes:
- Prefer evaluating the built output (`dist/`) or the local dev server (`npm run dev`) over source-only guessing.
- Keep changes consistent with this repo's patterns (Astro, existing CSS variables/classes).
- Don't invent new dependencies unless necessary; if adding one, explain why.

# Resume-per-role state (migrated from the role-resumes platform)

The repo also hosts a role-tailored resume pipeline. One resume per role, generated from a
single base resume with project selection driven by a scored tracker.

## Paths

| Path | Purpose |
|---|---|
| `src/data/projects.md` | **Source of truth**: every project with `status` (validated/pending), `done` (true/false), `kind` (project/experience), and per-role scores 0–10. |
| `src/data/roles.json` | The 7 target roles: slug, name, headline, summary, ATS keywords. Slugs: `ai-engineer`, `ml-engineer`, `ai-security`, `data-engineer`, `ai-db-architect`, `cv-nlp`, `research-scientist`. |
| `src/resumes/_base.tex` | Copy of the default ideal resume (`resume/resume.tex` in this repo, originally from the user's master resume). Generation input only. |
| `src/resumes/<role>.tex` / `.pdf` | Generated per-role LaTeX resumes + compiled PDFs. |
| `src/role-scores.csv` | Exported project × role score matrix (with `kind`, `done` columns). |
| `src/role-descriptions.txt` | The 7 role descriptions. |
| `scripts/resumes/` | `generate.mjs`, `score.mjs`, `sync-pinecone.mjs`, `compile.mjs`, `lib.mjs`. |

## Commands

```bash
npm run resumes        # regenerate src/resumes/<role>.tex
npm run pdf:resumes    # compile to PDF; FAILS if any resume exceeds one page
npm run score          # recalculate all scores from Pinecone similarity
npm run sync:pinecone  # src/data/projects.md -> Pinecone (status/done/kind/scores metadata)
```

## Injection rules (enforced by the generator)

- A project enters a role resume only if: `status: validated` **AND** `done: true` **AND**
  `kind: project` **AND** role score **>= 7**.
- Top **3** projects per role, **max 2 bullets each** — one-page rule (compile fails otherwise).
- Experience-kind items are never injected into Projects sections; they are covered by the
  Experience section of the base resume.
- Per-role changes: headline, Professional Summary, `pdfsubject`/`pdfkeywords`, Projects section.
  Experience/Education/Skills stay from the base resume.

## Scoring

Scores are **computed, not hand-picked**: each role profile is embedded and searched against an
embedding of every project (Pinecone index `role-resume-projects`, integrated model
`llama-text-embed-v2`, namespace `projects`); similarity is rank-normalized to the role's
strongest match (`round(10 * sim / max)`, capped at 6 below 0.25 absolute similarity, at 1 below
0.12). `npm run score` rewrites the scores into `src/data/projects.md`.

## Honesty rules (non-negotiable)

- Never claim a project that is not `done: true` on a resume.
- Never fabricate experience, metrics, or titles; headline/title inflation forbidden unless the
  user confirms they can defend it.
- If evidence is thin for a role, the resume says less, not more.

## Tracker format contract (`src/data/projects.md`)

```markdown
## <Project Name>

- status: validated | pending
- done: true | false
- kind: project | experience
- link: <url>
- date: <string>
- stack: <comma-separated>
- summary: <one-liner>
- bullets:
  - <achievement bullet>
- scores:
  - <role-slug>: <int 0-10>
```

The `## name` becomes the slug (kebab-case). `scripts/resumes/lib.mjs` parses this format.

## Secrets

`PINECONE_API_KEY` lives in `.env.local` (gitignored via `*.local`). Never commit keys.
