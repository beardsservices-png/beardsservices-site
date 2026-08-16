# Beard's Home Services — brand assets

Public, permanent URLs. Any tool, script, or Claude session can fetch these
directly — no local file, no login, no export step.

| File | Use |
|---|---|
| `bhs-mark.png` | Square mark. Avatars, favicons, stamps, tight spaces. |
| `bhs-logo-horizontal.png` | Mark + wordmark, **navy text**. Document headers, estimates, invoices, letterhead — anything on white. |
| `bhs-logo-horizontal-white.png` | Mark + wordmark, **white text**. For dark/navy backgrounds. |

Raw URLs (swap the filename):

```
https://raw.githubusercontent.com/beardsservices-png/beardsservices-site/main/brand/bhs-logo-horizontal.png
```

## Format

True PNG, RGBA, transparent background. All three are cut from the original
artwork so they drop onto any light surface with no box behind them.

## Known limit — the mark is drawn for light backgrounds

The illustration's face is near-white (sampled `#FEFDF9`–`#E9EDF0`), which is
genuine artwork, not background. On a dark surface the face therefore reads as a
light patch. This is a property of the source art and cannot be fixed by
re-cutting the transparency — it needs the mark redrawn.

For dark surfaces use `bhs-logo-horizontal-white.png`, or place the mark on a
light chip.

## Brand values

- Navy `#1a3a5c` — primary
- Gold `#e8a020` — accent
- Teal `#3a9abf` — customer-facing PDF estimates/invoices only, matching the
  existing Order Summary layout
- Headings **Oswald**, body **Open Sans**

## Source

Generated from the root `LOGO.png`, which despite its name is a **WebP** file
(694×694, RGB, no alpha, flat `#F1F5FD` ground). It is kept as-is because the
site references it; use the files in this folder for anything new.
