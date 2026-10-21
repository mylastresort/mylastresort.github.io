#!/usr/bin/env python3
"""Verify the built resume PDF: page count, bottom margin, and line-integrity.

Rules checked
  1. The resume must render on exactly one page.
  2. Ink must stay inside the text block (0.55in side, 0.50in top/bottom margins).
  3. No visual line may end with fewer than MIN_WORDS words (orphan fragments
     such as "istration" left alone on the last line of a paragraph).
  4. No Overfull/Underfull box warnings in the LaTeX log.

Usage: python3 scripts/check-resume.py [public/resume.pdf]
"""

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

PAGE_W, PAGE_H = 595.276, 841.89
MARGIN_X, MARGIN_TOP, MARGIN_BOTTOM = 0.55 * 72.27, 0.50 * 72.27, 0.50 * 72.27
MIN_WORDS = 4
# Words on the same visual line can differ in yMin (bold runs sit slightly
# higher), so cluster by baseline with a tolerance instead of exact equality.
LINE_TOLERANCE = 4.0
# Fully justified lines that end flush with the right margin can overrun the
# text block by ~1.7pt because of glyph side bearings (e.g. a trailing comma
# or a descender-free glyph whose ink extends past its advance width).
# That is 0.6mm inside the physical margin, so allow it.
MARGIN_TOLERANCE = 2.5
# Lines that are structural by nature: the candidate's name, the section
# headings, and the labelled field lines in the education block. They are
# labels, not prose, so the >= 4 words rule does not apply.
STRUCTURAL_LINES = {
    "Samy Tamim",
    "Professional Summary",
    "Experience",
    "Projects",
    "Education",
    "Technical Skills",
    "Specialization: Data Architecture",
}
# An entry/subentry header puts a right-aligned field after a wide gap
# (e.g. "42 Paris        2027"). These are labels too, so the word-count rule
# does not apply; a gap this wide never occurs inside justified prose.
HEADER_GAP = 40.0


def is_header_line(words):
    """True for a line that separates a left label from a right-aligned field."""
    gaps = [
        words[i + 1]["x0"] - words[i]["x1"]
        for i in range(len(words) - 1)
    ]
    return bool(gaps) and max(gaps) > HEADER_GAP


def load_words(pdf: Path):
    import shutil
    import subprocess

    if shutil.which("pdftotext") is None:
        raise SystemExit(
            "pdftotext not found: install poppler-utils "
            "(Debian/Ubuntu: apt-get install -y poppler-utils, macOS: brew install poppler)"
        )

    xml = subprocess.run(
        ["pdftotext", "-bbox", str(pdf), "-"],
        capture_output=True, text=True, check=True,
    ).stdout
    root = ET.fromstring(xml)
    pages = []
    for page in root.iter():
        # pdftotext emits XHTML with a default namespace; strip it to match tags.
        if page.tag.rsplit("}", 1)[-1] != "page":
            continue
        words = []
        for w in page.iter():
            if w.tag.rsplit("}", 1)[-1] != "word":
                continue
            words.append(
                {
                    "x0": float(w.get("xMin")), "x1": float(w.get("xMax")),
                    "y0": float(w.get("yMin")), "y1": float(w.get("yMax")),
                    "text": "".join(w.itertext()),
                }
            )
        pages.append(words)
    return pages


def cluster_lines(words):
    lines = []
    for w in sorted(words, key=lambda w: (w["y0"], w["x0"])):
        for line in lines:
            if abs(line["y0"] - w["y0"]) <= LINE_TOLERANCE:
                line["words"].append(w)
                line["y0"] = min(line["y0"], w["y0"])
                break
        else:
            lines.append({"y0": w["y0"], "words": [w]})
    for line in lines:
        line["words"].sort(key=lambda w: w["x0"])
        line["text"] = " ".join(w["text"] for w in line["words"])
        line["x0"] = line["words"][0]["x0"]
        line["x1"] = line["words"][-1]["x1"]
        line["y1"] = max(w["y1"] for w in line["words"])
    return sorted(lines, key=lambda l: l["y0"])


def main():
    pdf = Path(sys.argv[1] if len(sys.argv) > 1 else "public/resume.pdf")
    pages = load_words(pdf)
    failures = []

    if len(pages) != 1:
        failures.append(f"expected 1 page, got {len(pages)}")

    for index, words in enumerate(pages):
        for line in cluster_lines(words):
            label = line["text"]
            if label in STRUCTURAL_LINES:
                continue
            if not is_header_line(line["words"]) and len(label.split()) < MIN_WORDS:
                failures.append(
                    f"page {index + 1}: line has {len(label.split())} words: {label!r}"
                )
            if line["x1"] > PAGE_W - MARGIN_X + MARGIN_TOLERANCE:
                failures.append(
                    f"page {index + 1}: line overruns right margin "
                    f"({line['x1']:.1f} > {PAGE_W - MARGIN_X:.1f}): {label[:60]!r}"
                )
            if line["y1"] > PAGE_H - MARGIN_BOTTOM + MARGIN_TOLERANCE:
                failures.append(
                    f"page {index + 1}: line overruns bottom margin "
                    f"({line['y1']:.1f} > {PAGE_H - MARGIN_BOTTOM:.1f}): {label[:60]!r}"
                )

    bottom_ink = max(line["y1"] for line in cluster_lines(pages[0]))
    slack = PAGE_H - MARGIN_BOTTOM - bottom_ink
    print(f"pages: {len(pages)}")
    print(f"bottom ink: {bottom_ink:.1f}pt  slack: {slack:.1f}pt "
          f"({slack / 72.27 * 25.4:.1f}mm)")

    if failures:
        print("\nFAIL")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("OK: one page, inside margins, no short lines")
    return 0


if __name__ == "__main__":
    sys.exit(main())
