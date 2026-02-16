# Font Extraction Guide

## Overview

This guide explains how to extract SVG icons from font files (.woff2) using the provided scripts.

## Prerequisites

### Python Dependencies

Install the required packages:

```bash
# Create virtual environment (recommended)
python3 -m venv icon-skill-env
source icon-skill-env/bin/activate

# Install dependencies
pip install -r scripts/requirements.txt
```

### System Dependencies

For advanced font processing, you may need:

```bash
# macOS
brew install harfbuzz

# Ubuntu/Debian
sudo apt-get install libharfbuzz-dev

# Windows (using conda)
conda install -c conda-forge harfbuzz
```

## Font Structure

### Azion Icons (ai-*)
- **File**: `src/assets/icon-fonts/azionicons.woff2`
- **Prefix**: `ai-`
- **Unicode Range**: \EA00-\EFFF (Private Use Area)

### PrimeIcons (pi-*)
- **File**: `src/assets/icon-fonts/primeicons.woff2`
- **Prefix**: `pi-`
- **Unicode Range**: \E900-\EFFF (Private Use Area)

## Extraction Process

### 1. List Available Glyphs

```bash
# List Azion icons
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l

# List PrimeIcons
python scripts/extract_glyph.py src/assets/icon-fonts/primeicons.woff2 dummy -l
```

### 2. Extract Single Icon

```bash
# Extract specific icon
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 ai-application -o src/assets/svg-raw/
```

### 3. Batch Extraction

```bash
# Use the main script for batch processing
python scripts/add_icon.py --batch icons.txt
```

## Glyph Naming Conventions

### Azion Icons
- Font glyphs use kebab-case: `application`, `firewall`, `storage`
- CSS classes use prefix: `.ai-application::before`
- Icon names: `ai-application`, `ai-firewall`, `ai-storage`

### PrimeIcons
- Font glyphs use kebab-case: `home`, `user`, `search`
- CSS classes use prefix: `.pi-home::before`
- Icon names: `pi-home`, `pi-user`, `pi-search`

## Common Issues

### Issue: Glyph Not Found
**Problem**: Script reports "glyph not found"

**Solution**:
1. Check exact glyph name in font
2. Try different naming conventions
3. Verify unicode mapping in SCSS file

### Issue: Invalid SVG Output
**Problem**: Generated SVG is empty or malformed

**Solution**:
1. Font may use complex glyph structures
2. Manual SVG creation might be needed
3. Check font file integrity

### Issue: Unicode Mapping
**Problem**: Wrong unicode character in CSS

**Solution**:
1. Check `src/assets/icons.scss` for correct mapping
2. Use unicode from font file directly
3. Update SCSS if needed

## Manual SVG Creation

When automatic extraction fails, create SVG manually:

```html
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
        fill="currentColor"/>
</svg>
```

### SVG Guidelines
- Use `24x24` viewBox
- Use `fill="currentColor"` for dynamic coloring
- Keep paths simple and optimized
- Validate with SVG validator

## Font File Analysis

### Using fonttools Directly

```python
from fontTools.ttLib import TTFont

font = TTFont('azionicons.woff2')

# List all glyphs
for table in font['cmap'].tables:
    for codepoint, name in table.cmap.items():
        print(f"\\{codepoint:04X} {name}")

# Get glyph data
glyph_set = font.getGlyphSet()
glyph = glyph_set['application']
```

### Understanding Glyph Structure

- **Simple glyphs**: Basic outlines with coordinates
- **Composite glyphs**: References to other glyphs
- **Hints**: Rendering hints for better quality

## Optimization

### SVG Optimization
```bash
# Using svgo (recommended)
npm install -g svgo
svgo ai-application.svg --output ai-application.optimized.svg

# Manual optimization tips
- Remove unnecessary attributes
- Combine paths where possible
- Use relative coordinates
- Minimize decimal precision
```

### File Size Limits
- Target: < 2KB per SVG
- Maximum: 10KB per SVG
- Use compression for web deployment

## Troubleshooting

### Font Loading Issues
1. Verify font file integrity
2. Check file permissions
3. Ensure correct font format

### Memory Issues
1. Process fonts in batches
2. Use virtual environments
3. Monitor system resources

### Platform Differences
1. Windows: Use WSL or proper Python setup
2. macOS: Install Xcode command line tools
3. Linux: Install development libraries

## Advanced Usage

### Custom Font Processing
```python
# Extract all glyphs to SVGs
for glyph_name in glyph_names:
    svg = extract_glyph_to_svg(font, glyph_name)
    with open(f"{glyph_name}.svg", 'w') as f:
        f.write(svg)
```

### Unicode Analysis
```python
# Find unused unicode ranges
used_codes = set()
for table in font['cmap'].tables:
    used_codes.update(table.cmap.keys())

# Find gaps in Private Use Area
pua_start = 0xE000
pua_end = 0xF8FF
available = [code for code in range(pua_start, pua_end) 
             if code not in used_codes]
```

## Resources

- [fontTools Documentation](https://fonttools.readthedocs.io/)
- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [Unicode Private Use Area](https://www.unicode.org/faq/private_use.html)
- [HarfBuzz Documentation](https://harfbuzz.github.io/)
