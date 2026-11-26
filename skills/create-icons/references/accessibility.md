# Accessibility

## Decorative or informative

- **Decorative** (next to a visible label: a menu item, a button with text): the icon must be
  hidden from assistive tech. Generated components do this by default: with no `title`,
  `aria-label` or `aria-labelledby`, they render `aria-hidden="true"` and `focusable="false"`.
- **Informative** (the icon alone carries meaning: a status dot, a type marker in a table):
  pass `title` (or `aria-label`). The component renders `role="img"` and a `<title>` linked by
  `aria-labelledby`.
- **Icon-only buttons**: the accessible name belongs to the button, not the icon:
  `<button aria-label="Delete"><TrashIcon /></button>`. The icon stays decorative.
- React Native: with `title`, the icon gets `accessible`, `accessibilityRole="image"` and
  `accessibilityLabel`; without it, it is hidden (`importantForAccessibility="no-hide-descendants"`).
- Plain SVG in HTML: `<svg aria-hidden="true">` for decorative; `<svg role="img"><title>…</title>`
  or `<img alt="…">` for informative.

## Contrast

- Icons that convey information need at least **3:1** contrast against their background
  (WCAG 2.2, 1.4.11 non-text contrast). Check the **primary tone** of the default state against
  the surface it sits on, in light and dark.
- The secondary (light) tone is decoration and can be lower, as long as the primary tone
  alone identifies the icon (the primary-only check).
- Disabled icons are exempt but should still be distinguishable from the background.
- Never rely on color alone for meaning (active vs inactive, success vs error): pair it with a
  shape, a label, or a selected-state background.

Quick contrast estimate: relative luminance L = 0.2126 R + 0.7152 G + 0.0722 B on linearized
sRGB; ratio = (L1 + 0.05) / (L2 + 0.05). Typical safe pairs on white: grays darker than about
#7A7A7A for 3:1. Compute it when a tone is borderline and note it in the rationale.

## Motion and states

- Hover and active colors come from CSS; respect `prefers-reduced-motion` if the project
  animates icons (the generated icons do not animate).
- Active state should also be exposed semantically (`aria-current="page"`,
  `aria-selected`, `aria-pressed`); the generated CSS keys the active colors off these
  attributes, so the visual and the semantic state cannot drift apart.

## Sizes and targets

The icon size is not the touch target: interactive elements need at least 24 × 24 CSS px
(WCAG 2.2, 2.5.8), 44 × 44 recommended on touch. Pad the button, not the icon.
