# Licensing and originality

## What the person owns

Icons generated with this skill are original drawings made for the person's project. The
person owns what is generated for them and may use, modify, sell or relicense it like any
other asset they commissioned. The generated `package.json` is marked `private`; licensing
the package for others is their choice (suggest MIT or a proprietary notice if asked).

## What you must never do

- **Never copy paths** from existing icon sets: Lucide, Feather, Heroicons, Phosphor, Tabler,
  Material Icons/Symbols, SF Symbols, Font Awesome, Remix, Ionicons, Bootstrap Icons,
  Iconoir, Octicons, Carbon, Fluent, Streamline, Untitled UI, or any other. Many are
  permissively licensed, but copying them makes the result a derivative of that set (with
  attribution duties), and some (SF Symbols, Font Awesome Pro, Streamline) forbid it outright.
- **Never trace** an icon from a screenshot of another product.
- **Never "slightly modify"** an existing icon and call it new. Draw from the concept, on the
  grid, with this style's rules.

Matching a library's *construction* (grid, stroke width, caps, corner radius) is fine and is
the point of style matching. Construction is not protected; specific drawings are.

## Reference icons from the project

`export_reference_icons.py` copies a few icons the project already uses into `.icon-work/`
only to show them next to the new ones in the catalog. They are never part of the generated
library. Delete `.icon-work/` (or keep it out of version control) when done.

## Third-party marks

Brand logos and marks (payment methods, social networks, app stores, partner logos) are
trademarks, not icons. See `third-party-marks.md`.

## Fonts and images

Do not embed fonts or raster images in the icons. The catalog uses the project's font name
through CSS only.

## If the person asks to recreate an existing set

Explain that the skill draws original icons in the *style* they like (weight, corners,
tones) and offer to match it; do not reproduce the set itself.
