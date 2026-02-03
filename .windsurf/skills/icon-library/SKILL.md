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

## CRITICAL: Icon Font Availability

### `ai-*` Azion Icons - ALWAYS USE SVG

The Azion icon font (`azionicons.woff2`) is **NOT loaded by default** in most contexts.

**`<i class="ai ai-application"></i>` will NOT render** unless the target project explicitly loads:
- The `azionicons.woff2` font file
- The CSS with `@font-face` and class definitions

**For `ai-*` icons: ALWAYS provide inline SVG** from `assets/svg/`.

### `pi-*` PrimeIcons - Font classes usually work

PrimeIcons are loaded automatically in projects using PrimeVue/PrimeReact.

**`<i class="pi pi-home"></i>` works** in most Vue/React projects with PrimeVue.

## Icon Prefixes

- **`ai-*`** - Azion-specific icons → **USE SVG** (font rarely available)
- **`pi-*`** - PrimeIcons → Font class OK if PrimeVue is loaded, otherwise use SVG

## Integration Approaches

### 1. SVG Approach (Recommended - Always Works)

**Use for:** ALL `ai-*` icons, and `pi-*` when unsure about font availability.

- Read SVG from `assets/svg/{icon-name}.svg`
- Copy/paste inline or reference as image
- Works anywhere, no setup required
- Supports multi-color icons

### 2. Icon Font Approach (Limited Use)

**Use ONLY for `pi-*` icons** in projects with PrimeVue/PrimeReact.

**NEVER use `<i class="ai ai-*">` unless you've verified the Azion font is loaded.**

## Setting Up Azion Icon Font (Optional)

If you want `<i class="ai ai-*">` to work in your project, you need:

### Step 1: Copy font file
Copy `azionicons.woff2` to your project's assets folder.

### Step 2: Create CSS file (`azionicons.css`)
```css
@font-face {
  font-family: 'azionicons';
  src: url('./azionicons.woff2') format('woff2');
}

.ai {
  font-family: 'azionicons';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Icon class definitions */
.ai.ai-application::before { content: '\ea08'; }
.ai.ai-firewall::before { content: '\ea11'; }
.ai.ai-functions::before { content: '\ea22'; }
.ai.ai-storage::before { content: '\ea28'; }
.ai.ai-sql::before { content: '\ea29'; }
.ai.ai-kv::before { content: '\ea30'; }
.ai.ai-orchestrator::before { content: '\ea31'; }
.ai.ai-certificate-manager::before { content: '\ea24'; }
.ai.ai-network-shield::before { content: '\ea25'; }
/* See icons.scss for complete list */
```

### Step 3: Import CSS globally
```js
// In main.js, App.vue, or _app.tsx
import './assets/azionicons.css';
```

### Step 4: Use icon classes
```html
<i class="ai ai-application"></i>
```

**Note:** The complete `icons.scss` with all icon mappings is available in the icon-library-visualization repository.

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

| Icon Type | Context | Output |
|-----------|---------|--------|
| `ai-*` | ANY context | **Inline SVG** from `assets/svg/` |
| `pi-*` | PrimeVue project | `<i class="pi pi-{name}"></i>` |
| `pi-*` | Other contexts | Inline SVG from `assets/svg/` |
| Any | CMS/Struct field | Icon name only (e.g., `ai-firewall`) |
| Any | Markdown docs | SVG image reference or inline |

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
