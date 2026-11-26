# Interview

Ask in the person's language. Batch questions with options when you can (a multiple-choice
tool if available); otherwise one short numbered list. Always say what you already inferred
so they only correct it. Never ask what the scan already answered.

## A. When the design system was found (ask only what is open)

1. **Where will the icons appear?** (multi-select) Side menu / navigation · Buttons and
   toolbars · Product or content types · Statuses and badges · Landing page · Empty states
   and onboarding · E-mails · Mobile app.
2. **Sizes.** Default from the scan (e.g. "16 and 20 in the panel, 48 for empty states");
   options: 16/20/24 · plus 32/48 · plus 96 for illustrations.
3. **Themes.** Light · Dark · Both (default from the scan).
4. **Framework.** Detected from `package.json` — confirm: React · Vue · Svelte ·
   React Native · Plain SVG.
5. **Package name and location.** Suggest one that fits the repo (`packages/icons` as
   `@scope/icons` in a monorepo; `src/components/icons` otherwise).
6. **Anything that must change from what I inferred?** (show the 4-6 key decisions)

## B. When there is no design system, or it is weak or contradictory

Start with two or three lines: what you found ("Tailwind defaults, no custom colors, no icon
library") and what is missing ("brand color, corner style, dark mode"). Then ask:

1. **Style.** Open `assets/style-gallery.html` (copy it to `.icon-work/` and open it) and offer:
   - duotone-filled — filled, two tones of one hue, gray when inactive and brand when active
   - outline — uniform rounded line
   - solid — one color, filled
   - soft-3d-gradient — the filled drawing with soft gradients (large sizes, landing pages)
   - app-icon-glossy — squircle tile with gradient and gloss
   - flat-color — 2 to 4 flat colors
   - pixel — 8-bit squares
   - hand-drawn — sketchy line
   Mention they can combine two (see combining-styles.md).
2. **Brand colors.** Hex values, a screenshot, or the brand site URL to extract them from
   (read the site's CSS or logo; confirm the values back).
3. **Corners.** Square · Soft · Very rounded.
4. **Themes.** Light · Dark · Both.
5. **References.** Any screenshots of icons or apps they like? (Analyze with
   style-detection.md section 3.)

Then the remaining questions from A (where, sizes, framework, package).

## C. During review

Offer concrete levers rather than "anything else?": thicker or thinner · more or less
rounded · more or fewer details · one tone or two · brand color only when active or always ·
bigger or smaller inside the grid. Map each answer to a style-sheet field and redraw.
