# Troubleshooting Guide

## Overview

This guide covers common issues and solutions when working with the icon library feeder skill.

## Common Problems

### 1. Font Loading Issues

#### Problem: "Font file not found"
```
❌ Font file not found: src/assets/icon-fonts/azionicons.woff2
```

**Causes**:
- Incorrect project root path
- Font file doesn't exist
- File permissions issue

**Solutions**:
```bash
# Check if font file exists
ls -la src/assets/icon-fonts/

# Verify project structure
find . -name "*.woff2" -type f

# Set correct permissions
chmod 644 src/assets/icon-fonts/*.woff2
```

#### Problem: "Invalid font format"
```
❌ Error loading font: Not a TrueType/OpenType font
```

**Causes**:
- Corrupted font file
- Wrong file format
- Incomplete download

**Solutions**:
```bash
# Verify file type
file src/assets/icon-fonts/azionicons.woff2

# Re-download font file
curl -o src/assets/icon-fonts/azionicons.woff2 [URL]

# Check file integrity
python3 -c "
from fontTools.ttLib import TTFont
try:
    font = TTFont('src/assets/icon-fonts/azionicons.woff2')
    print('✅ Font file is valid')
except Exception as e:
    print(f'❌ Font error: {e}')
"
```

### 2. Glyph Extraction Issues

#### Problem: "Glyph not found in font"
```
❌ Glyph 'ai-new-icon' not found in font
```

**Causes**:
- Wrong glyph name
- Icon doesn't exist in font
- Naming convention mismatch

**Solutions**:
```bash
# List all available glyphs
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l

# Try different naming conventions
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 new-icon -o test/

# Check SCSS file for correct name
grep "new-icon" src/assets/icons.scss
```

#### Problem: "Could not extract glyph"
```
⚠️ Warning: Could not extract glyph application: complex glyph
```

**Causes**:
- Complex composite glyph
- Font uses advanced features
- Extraction limitations

**Solutions**:
```bash
# Use manual SVG creation
# Create SVG manually and save to src/assets/svg-raw/

# Try different extraction method
python scripts/extract_glyph.py --method-simple src/assets/icon-fonts/azionicons.woff2 ai-application

# Check if SVG already exists
ls -la src/assets/svg-raw/ai-application.svg
```

### 3. SVG Generation Issues

#### Problem: "Invalid XML"
```
❌ Invalid XML: not well-formed (invalid token)
```

**Causes**:
- Corrupted SVG template
- Invalid characters in path data
- Encoding issues

**Solutions**:
```bash
# Validate SVG file
xmllint --noout src/assets/svg-raw/ai-application.svg

# Check encoding
file -bi src/assets/svg-raw/ai-application.svg

# Manual SVG fix
# Edit SVG file to ensure proper XML structure
```

#### Problem: "File too large"
```
⚠️ File too large: 15420 bytes (should be < 10KB)
```

**Causes**:
- Complex glyph paths
- Inefficient SVG structure
- Missing optimization

**Solutions**:
```bash
# Optimize SVG with svgo
npm install -g svgo
svgo src/assets/svg-raw/ai-application.svg --output src/assets/svg-raw/ai-application.svg

# Manual optimization
python scripts/optimize_svg.py src/assets/svg-raw/ai-application.svg

# Check for issues
python scripts/validate_icon.py ai-application --svg-only
```

### 4. Catalog Update Issues

#### Problem: "Invalid JSON"
```
❌ Invalid JSON: Expecting ',' delimiter
```

**Causes**:
- Malformed JSON syntax
- Missing commas
- Extra commas

**Solutions**:
```bash
# Validate JSON
python3 -m json.tool src/icons.json

# Fix JSON formatting
python scripts/update_catalog.py src/icons.json --validate

# Backup and recreate
cp src/icons.json src/icons.json.backup
python scripts/update_catalog.py src/icons.json --validate
```

#### Problem: "Duplicate icon name"
```
❌ Line 45: Duplicate icon name 'ai-application'
```

**Causes**:
- Icon already exists
- Case sensitivity issues
- Whitespace in names

**Solutions**:
```bash
# Check for duplicates
python scripts/update_catalog.py src/icons.json --validate

# Find existing icon
grep -n "ai-application" src/icons.json

# Update existing entry
python scripts/update_catalog.py src/icons.json -a "ai-application:new,keywords" --update
```

### 5. CSS Integration Issues

#### Problem: "CSS class not found"
```
❌ CSS class '.ai-new-icon::before' not found
```

**Causes**:
- CSS class not defined
- Wrong class name
- SCSS not compiled

**Solutions**:
```bash
# Check SCSS file
grep -n "ai-new-icon" src/assets/icons.scss

# Add missing CSS class
echo ".ai.ai-new-icon::before { content: '\\e999'; }" >> src/assets/icons.scss

# Compile SCSS if needed
npm run build:css
```

#### Problem: "Missing content property"
```
❌ CSS class '.ai-new-icon::before' missing content property
```

**Causes**:
- Incomplete CSS definition
- Wrong unicode value
- Missing backslashes

**Solutions**:
```bash
# Find correct unicode
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 dummy -l | grep new-icon

# Update CSS with correct unicode
sed -i 's/content: .*/content: '"'"'\\e999'"'"';/' src/assets/icons.scss
```

### 6. Environment Issues

#### Problem: "Module not found"
```
❌ Import error: No module named 'fontTools'
```

**Causes**:
- Dependencies not installed
- Wrong Python environment
- Path issues

**Solutions**:
```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Use virtual environment
python3 -m venv icon-skill-env
source icon-skill-env/bin/activate
pip install -r scripts/requirements.txt

# Check Python path
python3 -c "import sys; print(sys.path)"
```

#### Problem: "Permission denied"
```
❌ Error saving SVG: Permission denied
```

**Causes**:
- File permissions
- Directory ownership
- Read-only filesystem

**Solutions**:
```bash
# Check permissions
ls -la src/assets/svg-raw/

# Fix permissions
chmod 755 src/assets/svg-raw/
chmod 644 src/assets/svg-raw/*.svg

# Change ownership if needed
sudo chown -R $USER:$USER src/assets/svg-raw/
```

## Debugging Tools

### 1. Validation Script

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

### 2. Dry Run Mode

```bash
# Test extraction without saving
python scripts/extract_glyph.py src/assets/icon-fonts/azionicons.woff2 ai-application --dry-run

# Test catalog update without saving
python scripts/update_catalog.py src/icons.json -a "ai-test:test" --dry-run
```

### 3. Verbose Mode

```bash
# Enable verbose output
python scripts/add_icon.py ai-test "test keywords" --verbose

# Debug font loading
python scripts/extract_glyph.py --debug src/assets/icon-fonts/azionicons.woff2 ai-application
```

## Performance Issues

### 1. Slow Processing

#### Problem: Scripts taking too long

**Causes**:
- Large font files
- Inefficient algorithms
- System resources

**Solutions**:
```bash
# Monitor resources
top -p $(pgrep -f "python.*extract_glyph")

# Process in batches
python scripts/add_icon.py --batch icons.txt --batch-size 10

# Use faster extraction method
python scripts/extract_glyph.py --method-fast src/assets/icon-fonts/azionicons.woff2 ai-application
```

### 2. Memory Issues

#### Problem: Out of memory errors

**Causes**:
- Large font processing
- Memory leaks
- Concurrent processing

**Solutions**:
```bash
# Monitor memory usage
python -c "
import psutil
import os
process = psutil.Process(os.getpid())
print(f'Memory: {process.memory_info().rss / 1024 / 1024:.1f} MB')
"

# Process one icon at a time
for icon in $(cat icons.txt); do
    python scripts/add_icon.py "$icon" "keywords"
done

# Use memory-efficient mode
python scripts/extract_glyph.py --memory-efficient src/assets/icon-fonts/azionicons.woff2 ai-application
```

## Recovery Procedures

### 1. Restore from Backup

```bash
# Restore JSON catalog
cp src/icons.json.backup src/icons.json

# Restore SVG files
git checkout HEAD -- src/assets/svg-raw/

# Restore SCSS file
git checkout HEAD -- src/assets/icons.scss
```

### 2. Rebuild Catalog

```bash
# Rebuild catalog from scratch
python scripts/rebuild_catalog.py src/assets/svg-raw/ src/icons.json

# Validate rebuilt catalog
python scripts/update_catalog.py src/icons.json --validate
```

### 3. Mass Re-extraction

```bash
# Extract all icons from font
python scripts/extract_all_glyphs.py src/assets/icon-fonts/azionicons.woff2 src/assets/svg-raw/

# Update catalog for all SVGs
python scripts/update_all_icons.py src/assets/svg-raw/ src/icons.json
```

## Getting Help

### 1. Enable Debug Mode

```bash
# Set debug environment variable
export ICON_DEBUG=1

# Run with debug output
python scripts/add_icon.py ai-test "test" --debug
```

### 2. Generate Report

```bash
# Generate full system report
python scripts/generate_report.py --output report.html

# Include logs
python scripts/generate_report.py --include-logs --output report.html
```

### 3. Contact Support

When reporting issues, include:

1. **System Information**:
   ```bash
   python3 --version
   pip list | grep -E "(fonttools|lxml)"
   sw_vers  # macOS
   uname -a  # Linux/Windows
   ```

2. **Error Details**:
   - Full error message
   - Command used
   - Input files

3. **Context**:
   - Project structure
   - Font file information
   - Recent changes

## Prevention

### 1. Regular Validation

```bash
# Set up cron job for daily validation
0 2 * * * cd /path/to/project && python scripts/validate_icon.py --all

# Pre-commit hook
#!/bin/sh
python scripts/validate_icon.py --all
if [ $? -ne 0 ]; then
    echo "❌ Validation failed"
    exit 1
fi
```

### 2. Automated Testing

```bash
# Run test suite
python scripts/run_tests.py

# Performance benchmarks
python scripts/benchmark.py --compare-with-previous
```

### 3. Monitoring

```bash
# Set up monitoring
python scripts/monitor.py --alert-on-errors

# Log file analysis
python scripts/analyze_logs.py --last-7-days
```

This troubleshooting guide should help resolve most common issues with the icon library feeder skill.
