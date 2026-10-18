#!/usr/bin/env bash
set -euo pipefail

# Regenerates public/favicon.png: a circular (transparent corners) crop of the
# sidebar profile photo, zoomed in so the subject fills the circle.
#
#   npm run favicon                      # default zoom / framing
#   ZOOM=2 npm run favicon               # tighter crop
#   Y_BIAS=0.5 npm run favicon           # shift framing up (more headroom)
#   X_BIAS=-0.2 npm run favicon          # shift framing left
#
# Biases are fractions of the leftover slack (roughly -0.5..0.5):
#   Y_BIAS positive = crop window moves toward the top of the photo (subject
#                     moves down in the circle, reveals the head)
#   Y_BIAS negative = crop window moves toward the bottom (subject moves up)
#   X_BIAS positive = crop window moves toward the left edge (subject right)
#   X_BIAS negative = crop window moves toward the right edge (subject left)
#
# Requires ImageMagick (`magick`).

SRC="src/assets/photo.jpg"
OUT="public/favicon.png"
SIZE=512
ZOOM="${ZOOM:-1.9}"
# Vertical framing: positive = more headroom above the subject.
Y_BIAS="${Y_BIAS:-0.25}"
# Horizontal framing: 0 = centered.
X_BIAS="${X_BIAS:--0.2}"

command -v magick >/dev/null || { echo "error: ImageMagick (magick) is required" >&2; exit 1; }
[ -f "$SRC" ] || { echo "error: $SRC not found" >&2; exit 1; }

# Zoom = scale the photo up past SIZE, then crop back to SIZE from an offset
# position. The source photo is ~square, so the crop keeps the subject; the
# biases (fractions of the leftover slack) slide the crop window for framing.
BIG=$(awk "BEGIN { printf \"%d\", $SIZE * $ZOOM + 0.5 }")
SLACK=$((BIG - SIZE))
X_OFF=$(awk "BEGIN { printf \"%d\", $SLACK * (0.5 - $X_BIAS) }")
Y_OFF=$(awk "BEGIN { printf \"%d\", $SLACK * (0.5 - $Y_BIAS) }")

magick "$SRC" \
  -auto-orient \
  -resize "${BIG}x${BIG}^" \
  -crop "${SIZE}x${SIZE}+${X_OFF}+${Y_OFF}" \
  +repage \
  \( -size "${SIZE}x${SIZE}" xc:none -fill white -draw "circle $((SIZE / 2)),$((SIZE / 2)) $((SIZE / 2)),8" \) \
  -compose CopyOpacity -composite \
  -strip "PNG8:$OUT"

echo "favicon regenerated -> $OUT ($(du -h "$OUT" | cut -f1)), zoom=${ZOOM} y_bias=${Y_BIAS} x_bias=${X_BIAS}"
