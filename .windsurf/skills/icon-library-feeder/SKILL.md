---
name: icon-library-feeder
description: Automates the process of adding new icons to the icon library from font files (.woff2), generating SVG files and updating the JSON catalog. Use when you need to: (1) Add new icons from azionicons.woff2 or primeicons.woff2 fonts, (2) Extract SVG glyphs from font files automatically, (3) Update icons.json catalog with new entries and keywords, (4) Validate icon integration across SVG, CSS, and JSON files, (5) Process multiple icons in batch mode, or (6) Troubleshoot icon library issues.
---

# Icon Library Feeder Skill

Automates the complete workflow of adding new icons to the Azion icon library from font files.

## Quick Start

### Add a Single Icon
```bash
# Basic usage
python scripts/add_icon.py ai-new-feature "new, feature, functionality"

# Update existing icon
python scripts/add_icon.py ai-new-feature "updated, keywords" --update

# Extract SVG only (skip catalog update)
python scripts/add_icon.py ai-new-feature "keywords" --svg-only
```

### Batch Processing
```bash
# Create icons.txt with format: name:keywords
echo "ai-analytics:analytics, data, charts" >> icons.txt
echo "ai-automation:automation, workflow, bot" >> icons.txt

# Process batch
python scripts/add_icon.py --batch icons.txt
```

### List Available Glyphs
```bash
# List Azion icons
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l

# List PrimeIcons
python scripts/extract_glyph.py src/assets/icon-fonts/primeicons.woff2 dummy -l
```

## Core Scripts

### 1. add_icon.py - Main Workflow Orchestrator
**Purpose**: Complete icon addition workflow
**Usage**: `python scripts/add_icon.py ICON_NAME KEYWORDS [OPTIONS]`

**Features**:
- Automatic SVG extraction from font files
- Catalog update with keywords
- Integration validation
- Batch processing support
- Error handling and recovery

**Examples**:
```bash
# Add new Azion icon
python scripts/add_icon.py ai-edge-computing "edge, computing, distributed"

# Add PrimeIcon
python scripts/add_icon.py pi-new-ui "ui, interface, design"

# Batch process
python scripts/add_icon.py --batch new-icons.txt

# Update existing
python scripts/add_icon.py ai-storage "storage, files, blob" --update
```

### 2. extract_glyph.py - Font to SVG Extraction
**Purpose**: Extract SVG glyphs from .woff2 font files
**Usage**: `python scripts/extract_glyph.py FONT_PATH ICON_NAME [OPTIONS]`

**Features**:
- Direct font glyph extraction
- SVG optimization
- Multiple output formats
- Glyph listing capability

**Examples**:
```bash
# Extract specific icon
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 ai-application -o output/

# List all glyphs
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l

# Custom size
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 ai-application -w 32 -h 32
```

### 3. update_catalog.py - JSON Catalog Management
**Purpose**: Manage icons.json catalog entries
**Usage**: `python scripts/update_catalog.py CATALOG_PATH [OPTIONS]`

**Features**:
- Add/update icon entries
- Keyword management
- Validation and formatting
- Duplicate detection

**Examples**:
```bash
# Add new entry
python scripts/update_catalog.py src/icons.json -a "ai-new-icon:new, feature"

# Update existing
python scripts/update_catalog.py src/icons.json -a "ai-new-icon:updated, keywords" --update

# Remove entry
python scripts/update_catalog.py src/icons.json -r "ai-old-icon"

# Validate catalog
python scripts/update_catalog.py src/icons.json --validate

# List all icons
python scripts/update_catalog.py src/icons.json --list
```

### 4. validate_icon.py - Integration Validation
**Purpose**: Validate complete icon integration
**Usage**: `python scripts/validate_icon.py ICON_NAME [OPTIONS]`

**Features**:
- SVG file validation
- CSS class verification
- JSON entry checking
- Batch validation
- Detailed error reporting

**Examples**:
```bash
# Validate single icon
python scripts/validate_icon.py ai-application

# Validate all icons
python scripts/validate_icon.py --all

# Validate specific components
python scripts/validate_icon.py ai-application --svg-only
python scripts/validate_icon.py ai-application --css-only
python scripts/validate_icon.py ai-application --json-only
```

## File Structure

```
icon-library-feeder/
├── SKILL.md                     # This file
├── scripts/
│   ├── add_icon.py              # Main workflow orchestrator
│   ├── extract_glyph.py          # Font to SVG extraction
│   ├── update_catalog.py        # JSON catalog management
│   ├── validate_icon.py         # Integration validation
│   └── requirements.txt         # Python dependencies
├── references/
│   ├── font-extraction.md       # Font extraction guide
│   ├── svg-optimization.md      # SVG optimization best practices
│   └── troubleshooting.md      # Common issues and solutions
└── assets/
    └── svg-templates/          # SVG template files
        ├── basic-icon.svg       # Filled icon template
        └── stroke-icon.svg      # Outlined icon template
```

## Integration Points

### Project Structure Requirements
```
project-root/
├── src/
│   ├── assets/
│   │   ├── icon-fonts/
│   │   │   ├── azionicons.woff2    # Azion icons font
│   │   │   └── primeicons.woff2    # PrimeIcons font
│   │   ├── svg-raw/               # Generated SVG files
│   │   └── icons.scss             # CSS class definitions
│   └── icons.json                 # Icon catalog
```

### Icon Naming Conventions
- **Azion Icons**: `ai-*` prefix (e.g., `ai-application`, `ai-firewall`)
- **PrimeIcons**: `pi-*` prefix (e.g., `pi-home`, `pi-user`)
- **Format**: kebab-case, lowercase, descriptive
- **Examples**: `ai-edge-computing`, `ai-ai-assistant`, `pi-settings-gear`

### Keywords Best Practices
- **Format**: Comma-separated, lowercase
- **Content**: Synonyms, related concepts, use cases
- **Examples**: 
  - `"firewall, security, protection, network"`
  - `"storage, files, blob, object, s3"`
  - `"analytics, data, charts, metrics, dashboard"`

## Workflow Examples

### Complete Icon Addition
```bash
# 1. Check if glyph exists
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l | grep "new-icon"

# 2. Add icon with full workflow
python scripts/add_icon.py ai-new-icon "new, feature, functionality"

# 3. Validate integration
python scripts/validate_icon.py ai-new-icon

# 4. Verify in catalog
python scripts/update_catalog.py src/icons.json --list | grep "new-icon"
```

### Batch Icon Addition
```bash
# 1. Create batch file
cat > new-icons.txt << EOF
ai-analytics:analytics, data, charts, metrics
ai-automation:automation, workflow, bot, script
ai-backup:backup, restore, archive, save
ai-cdn:cdn, content delivery, network, edge
EOF

# 2. Process batch
python scripts/add_icon.py --batch new-icons.txt

# 3. Validate all
python scripts/validate_icon.py --all
```

### Icon Update
```bash
# 1. Update keywords
python scripts/update_catalog.py src/icons.json -a "ai-storage:storage, files, blob, object, s3" --update

# 2. Validate updated entry
python scripts/validate_icon.py ai-storage --json-only

# 3. Re-extract SVG if needed
python scripts/add_icon.py ai-storage "storage, files, blob" --svg-only
```

## Error Handling

### Common Issues and Solutions

#### Glyph Not Found
```bash
# List available glyphs to find correct name
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l

# Try alternative naming
python scripts/add_icon.py ai-edge-computing "edge, computing"  # Try different name
```

#### SVG Extraction Fails
```bash
# Use manual SVG template
cp assets/svg-templates/basic-icon.svg src/assets/svg-raw/ai-custom.svg
# Edit the SVG file manually

# Add to catalog manually
python scripts/update_catalog.py src/icons.json -a "ai-custom:custom, manual"
```

#### Validation Errors
```bash
# Get detailed error report
python scripts/validate_icon.py ai-problematic --verbose

# Fix specific component
python scripts/validate_icon.py ai-problematic --svg-only
python scripts/validate_icon.py ai-problematic --css-only
python scripts/validate_icon.py ai-problematic --json-only
```

## Advanced Usage

### Custom SVG Creation
When automatic extraction fails, create SVG manually:

1. **Use Template**:
   ```bash
   cp assets/svg-templates/basic-icon.svg src/assets/svg-raw/ai-custom.svg
   ```

2. **Edit SVG**:
   - Replace path data with actual icon
   - Maintain 24x24 viewBox
   - Use `fill="currentColor"`

3. **Add to Catalog**:
   ```bash
   python scripts/update_catalog.py src/icons.json -a "ai-custom:custom, manual"
   ```

4. **Validate**:
   ```bash
   python scripts/validate_icon.py ai-custom
   ```

### Font Analysis
```bash
# Analyze font structure
python3 -c "
from fontTools.ttLib import TTFont
font = TTFont('src/assets/icon-fonts/azionicons.woff2')
print('Font tables:', list(font.keys()))
print('Glyph count:', len(font.getGlyphSet()))
"

# Find unicode mappings
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l > glyph-list.txt
```

### Performance Optimization
```bash
# Batch size optimization
python scripts/add_icon.py --batch large-icons.txt --batch-size 5

# Parallel processing (if implemented)
python scripts/add_icon.py --batch icons.txt --parallel

# Memory-efficient mode
python scripts/extract_glyph.py --memory-efficient src/assets/icon-fonts/azionicons.woff2 ai-complex
```

## Dependencies

### Python Packages
```bash
pip install -r scripts/requirements.txt
```

**Required**:
- `fonttools>=4.61.0` - Font file processing
- `lxml>=6.0.0` - XML/SVG parsing

**Optional**:
- `svgo` - SVG optimization (npm package)
- `cairosvg` - SVG to PNG conversion

### System Requirements
- Python 3.8+
- 2GB+ RAM for large font processing
- Disk space for SVG files

## Quality Assurance

### Validation Checklist
- [ ] SVG file exists and is valid XML
- [ ] File size < 10KB (preferably < 2KB)
- [ ] Uses `currentColor` for fill
- [ ] 24x24 viewBox maintained
- [ ] CSS class exists in icons.scss
- [ ] JSON entry properly formatted
- [ ] Keywords are descriptive and relevant

### Testing Workflow
```bash
# Test single icon
python scripts/add_icon.py ai-test "test, validation"
python scripts/validate_icon.py ai-test

# Test batch processing
echo "ai-test2:test, batch" | python scripts/add_icon.py --batch /dev/stdin
python scripts/validate_icon.py --all | grep "test"
```

## Troubleshooting

See `references/troubleshooting.md` for detailed troubleshooting guide covering:
- Font loading issues
- Glyph extraction problems
- SVG generation errors
- Catalog update failures
- Environment setup issues

## Best Practices

### Icon Design
- Keep paths simple and optimized
- Use consistent stroke weights (1.5-2px)
- Maintain 24x24 grid alignment
- Test at multiple sizes (16px, 24px, 32px)

### Keyword Selection
- Include synonyms and related terms
- Consider user search behavior
- Use consistent terminology
- Avoid overly specific technical terms

### File Management
- Commit changes incrementally
- Use descriptive commit messages
- Validate before merging
- Keep backup of original files

## Integration with Existing Workflows

### Git Hooks
```bash
# Pre-commit validation
#!/bin/sh
python scripts/validate_icon.py --all
if [ $? -ne 0 ]; then
    echo "❌ Icon validation failed"
    exit 1
fi
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Validate Icons
  run: |
    pip install -r scripts/requirements.txt
    python scripts/validate_icon.py --all
```

### Build Process
```bash
# Part of build script
echo "🔍 Validating icon library..."
python scripts/validate_icon.py --all
echo "✅ Icon library validation passed"
```

This skill provides a complete, automated solution for managing the Azion icon library with robust error handling, validation, and optimization features.
