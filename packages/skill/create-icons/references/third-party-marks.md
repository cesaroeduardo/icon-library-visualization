# Third-party marks

Logos of other companies (payment methods such as Pix, Visa, Mastercard, Amex, Apple Pay,
Google Pay, PayPal; social networks such as Instagram, WhatsApp, Facebook, TikTok, YouTube,
X, LinkedIn; Google, Apple, Microsoft, GitHub, Slack, app-store badges; partner and
integration logos) are trademarks. Their owners publish brand guidelines that say how the
mark may appear.

## Rules

1. **Never invent or redraw a mark freehand.** A "close enough" Instagram camera or Pix
   diamond is a counterfeit of the mark, and it will look wrong.
2. **Use the official asset.** Download the SVG from the owner's brand or press page (search
   "<brand> brand guidelines" or "<brand> press kit") and keep the file as published. Tell the
   person where it came from and link the guideline.
3. **Restyling only where the guideline allows it.** Many guidelines allow a single-color
   (monochrome) version of the mark; some allow it inside a neutral container. If so, you may
   produce a version that fits the set *by changing color only* (e.g. the mark in the
   inactive gray and in white), preserving the official geometry exactly. Do not change the
   shape, proportions, or add the style's second tone, gradients or gloss unless the guideline
   explicitly permits it.
4. **Respect clear space and minimum size.** If a mark has a minimum size larger than 16 px,
   do not ship it at 16 px; use the brand name as text instead.
5. **Keep marks separate.** Put them in their own group (`brands`) in `icons.json` with a
   `note` naming the source and guideline, or keep them as plain files outside the generated
   library. Do not mix them into the style-validated set if they break the style rules.
6. **When unsure, ask.** If you cannot fetch the official asset, list the marks the person
   needs to supply and leave placeholders named after them (`brand-pix`, `brand-visa`).

## How to add an official mark to the source

Paste the official path data as shapes with the right tone and add a note:

```json
{ "name": "brand-acme", "label": "Acme", "group": "brands",
  "shapes": [ { "tone": "detail", "type": "path", "d": "<official path, scaled to the live area>",
                "note": "Official mark from acme.com/brand (monochrome use allowed, guideline v3, p. 12)" } ] }
```

Scaling to the grid is a uniform scale and translate of the official geometry; nothing else.
For multi-color official marks, keep them as files in `svg/` copied as-is rather than in the
tone system.
