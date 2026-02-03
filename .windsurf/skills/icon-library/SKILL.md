---
name: icon-library
description: |
  Insert icons from the Azion Icon Library into projects. Use this skill when:
  - Adding icons to websites, Vue/React components, or HTML pages
  - Creating content marketing materials (blog posts, social media, presentations)
  - Writing documentation (Markdown, MDX, README files)
  - Filling CMS struct fields that require icon names

  The skill provides the optimal icon format based on context:
  - Inline SVG code (recommended, no dependencies)
  - Icon class names (requires font setup)
  - Just the icon name for CMS/struct fields
---

# Icon Library Skill

Provides icons from the Azion Icon Library with context-aware output formats.

## Two Integration Approaches

### 1. SVG Approach (Recommended - No Dependencies)

**Best for:** New projects, blogs, docs, marketing, any context without icon font setup.

- Read SVG from `assets/svg/{icon-name}.svg`
- Copy/paste inline or reference as image
- Works anywhere, no setup required
- Supports multi-color icons

### 2. Icon Font Approach (Requires Font Setup)

**Best for:** Projects that already have Azion icon fonts installed.

Requires:
- Font files: `azionicons.woff2`, `primeicons.woff2`
- CSS with icon class definitions
- Only use if project already has these configured

## Icon Prefixes

- **`ai-*`** - Azion-specific icons (products, frameworks, services)
- **`pi-*`** - PrimeIcons general-purpose icons (UI elements)

## Finding Icons

Search `references/icons-catalog.json` by keyword:
```
grep -i "security\|firewall" references/icons-catalog.json
```

Each icon has: `name`, `icon` (class), and `keywords`.

## Output Formats by Context

### 1. Website/App (HTML/Vue/React)

**If project has icon font setup:**
```html
<i class="ai ai-application"></i>
```

**If no icon font (use SVG - recommended):**
```html
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="..." fill="currentColor"/>
</svg>
```

Read the SVG content from `assets/svg/{icon-name}.svg`.

### 2. Content Marketing (Blog/Social/Email)

Always use inline SVG (no dependencies):
```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="..." fill="#F3652B"/>
</svg>
```

To customize color, replace `fill` attribute value.

### 3. Documentation (Markdown/MDX)

**Markdown (image reference):**
```markdown
![Application Icon](./path/to/ai-application.svg)
```

**MDX (inline SVG):**
```mdx
<svg width="24" height="24">...</svg>
```

### 4. CMS/Struct Fields

Provide just the icon name:
```
ai-application
```

## Decision Logic

| Context | Has Icon Font? | Output |
|---------|----------------|--------|
| Vue/React/HTML | Yes | `<i class="ai ai-{name}"></i>` |
| Vue/React/HTML | No | Inline SVG from `assets/svg/` |
| Blog/Marketing | N/A | Inline SVG |
| Markdown docs | N/A | SVG image or inline |
| CMS/Struct field | N/A | Icon name only |

## Common Icons Quick Reference

### Azion Products

**Note:** Product names have been updated. Use the new names in content:

| Icon Class | Product Name |
|------------|-------------|
| `ai-application` | Applications |
| `ai-firewall` | Firewall |
| `ai-functions` | Functions |
| `ai-storage` | Object Storage |
| `ai-sql` | SQL Database |
| `ai-kv` | KV Store |
| `ai-certificate-manager` | Certificate Manager |
| `ai-orchestrator` | Orchestrator |
| `ai-network-shield` | Network Shield |
| `ai-waf-rules` | WAF Rules |

### Frameworks
- `ai-react` - React
- `ai-vue` - Vue
- `ai-nextjs` - Next.js
- `ai-astro` - Astro
- `ai-terraform` - Terraform

### UI Elements (pi-*)
- `pi-home` - Home
- `pi-search` - Search
- `pi-user` - User
- `pi-cog` - Settings
- `pi-check` - Check/Success
- `pi-times` - Close/Error
- `pi-plus` - Add
- `pi-trash` - Delete

## Retrieving SVG Content

To get the full SVG markup, read from `assets/svg/{icon-name}.svg`.

Example workflow:
1. User asks for "firewall icon for blog post"
2. Search catalog: find `ai-firewall`
3. Read `assets/svg/ai-firewall.svg`
4. Return inline SVG with appropriate color

## Naming Guidelines

**Important:** Follow these naming conventions in all content:

- Use **AI** (not IA) as the abbreviation for Artificial Intelligence
- Use **distributed architecture** instead of "at the edge" or "on the edge"
- Use the updated product names shown in the Azion Products table above

### Product Name Mapping (Legacy → Current)

| Legacy Name | Current Name |
|-------------|-------------|
| Edge Functions | Functions |
| Edge Cache / Tiered Cache | Cache |
| Network Layer Protection | Network Shield |
| Edge SQL | SQL Database |
| Edge KV | KV Store |
| Edge Storage | Object Storage |
| Edge Application | Applications |
| Edge Orchestrator | Orchestrator |
| Digital Certificates | Certificate Manager |
| Edge Firewall | Firewall |
