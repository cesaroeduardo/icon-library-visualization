# SVG Optimization Guide

## Overview

This guide covers best practices for creating and optimizing SVG icons for the icon library.

## SVG Structure Standards

### Basic Template

```html
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
        fill="currentColor"/>
</svg>
```

### Required Attributes
- `width="24"` - Fixed width for consistency
- `height="24"` - Fixed height for consistency  
- `viewBox="0 0 24 24"` - 24x24 coordinate system
- `xmlns="http://www.w3.org/2000/svg"` - SVG namespace

### Styling Guidelines
- Use `fill="currentColor"` for dynamic coloring
- Avoid inline styles when possible
- Don't use hardcoded colors
- Keep stroke width consistent (usually 1.5-2)

## Path Optimization

### Path Commands
- Use relative commands when possible (`m` vs `M`)
- Combine consecutive line segments (`L` commands)
- Use arc and curve commands efficiently
- Minimize decimal precision (2-3 places)

### Example: Before vs After

```html
<!-- Before: Unoptimized -->
<path d="M12.000000,2.000000 L2.000000,7.000000 L2.000000,17.000000 C2.000000,22.550000 5.840000,27.740000 11.000000,29.000000 C16.160000,27.740000 20.000000,22.550000 20.000000,17.000000 L20.000000,7.000000 L12.000000,2.000000 Z" fill="currentColor"/>

<!-- After: Optimized -->
<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
```

## File Size Optimization

### Target Sizes
- **Simple icons**: < 500 bytes
- **Complex icons**: < 2KB
- **Maximum**: 10KB (hard limit)

### Optimization Techniques

#### 1. Remove Redundant Data
```html
<!-- Remove -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg width="24.0" height="24.0" viewBox="0.0 0.0 24.0 24.0" xmlns="http://www.w3.org/2000/svg">

<!-- Keep -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
```

#### 2. Optimize Paths
```html
<!-- Before: Multiple paths -->
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" stroke-width="2"/>

<!-- After: Combined path -->
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" 
      fill="none" stroke="currentColor" stroke-width="2"/>
```

#### 3. Use Efficient Shapes
```html
<!-- Instead of complex path for circle -->
<circle cx="12" cy="12" r="10" fill="currentColor"/>

<!-- Instead of complex path for rectangle -->
<rect x="4" y="4" width="16" height="16" fill="currentColor"/>
```

## Automated Optimization

### Using svgo

```bash
# Install svgo
npm install -g svgo

# Basic optimization
svgo icon.svg --output icon.optimized.svg

# Custom configuration
svgo icon.svg --output icon.optimized.svg --config svgo.config.js
```

### svgo Configuration

```javascript
// svgo.config.js
module.exports = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeUselessDefs',
    'cleanupIDs',
    'minifyStyles',
    'convertPathData',
    'mergePaths',
    'removeUnusedNS',
    'sortAttrs',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults'
  ]
};
```

### Python Optimization Script

```python
import re
from pathlib import Path

def optimize_svg_content(svg_content: str) -> str:
    """Basic SVG optimization"""
    
    # Remove extra whitespace
    svg_content = re.sub(r'>\s+<', '><', svg_content)
    svg_content = re.sub(r'\s+', ' ', svg_content)
    
    # Remove decimal precision
    svg_content = re.sub(r'(\d+\.\d{3,})', lambda m: f"{float(m.group(1)):.2f}", svg_content)
    
    # Remove unnecessary attributes
    svg_content = re.sub(r'\s+xmlns:xlink="[^"]*"', '', svg_content)
    
    return svg_content.strip()

def optimize_svg_file(input_path: str, output_path: str = None):
    """Optimize SVG file"""
    if output_path is None:
        output_path = input_path
    
    with open(input_path, 'r') as f:
        content = f.read()
    
    optimized = optimize_svg_content(content)
    
    with open(output_path, 'w') as f:
        f.write(optimized)
    
    original_size = len(content)
    optimized_size = len(optimized)
    reduction = (1 - optimized_size / original_size) * 100
    
    print(f"Original: {original_size} bytes")
    print(f"Optimized: {optimized_size} bytes")
    print(f"Reduction: {reduction:.1f}%")
```

## Quality Assurance

### Visual Testing

```python
from PIL import Image
import cairosvg

def render_svg_to_png(svg_path: str, png_path: str, size: int = 64):
    """Render SVG to PNG for visual testing"""
    cairosvg.svg2png(
        url=svg_path,
        write_to=png_path,
        output_width=size,
        output_height=size
    )

def compare_icons(svg1: str, svg2: str):
    """Compare two rendered icons"""
    render_svg_to_png(svg1, 'temp1.png')
    render_svg_to_png(svg2, 'temp2.png')
    
    img1 = Image.open('temp1.png')
    img2 = Image.open('temp2.png')
    
    # Simple pixel comparison
    diff = ImageChops.difference(img1, img2)
    return diff.getbbox() is None
```

### Validation Checklist

- [ ] SVG validates without errors
- [ ] File size under 2KB
- [ ] Uses `currentColor` for fill
- [ ] Consistent 24x24 viewBox
- [ ] No hardcoded colors
- [ ] Paths are optimized
- [ ] Renders correctly at different sizes
- [ ] Accessible (has meaningful structure)

## Common Issues

### Issue: Blurry at Small Sizes
**Cause**: Complex paths or insufficient precision

**Solution**:
- Simplify paths
- Use integer coordinates when possible
- Add proper stroke width

### Issue: Wrong Colors
**Cause**: Hardcoded colors instead of `currentColor`

**Solution**:
```html
<!-- Wrong -->
<path d="..." fill="#000000"/>

<!-- Correct -->
<path d="..." fill="currentColor"/>
```

### Issue: Poor Performance
**Cause**: Too many nodes or complex effects

**Solution**:
- Reduce path complexity
- Avoid filters and effects
- Use basic shapes when possible

## Icon Design Guidelines

### Visual Consistency
- **Line weight**: 1.5-2px stroke width
- **Corner radius**: Consistent across icons
- **Grid alignment**: Snap to 24x24 grid
- **White space**: Maintain consistent padding

### Design Principles
- **Clarity**: Recognizable at small sizes
- **Simplicity**: Minimal detail
- **Consistency**: Uniform style
- **Scalability**: Works at all sizes

### Size Testing
Test icons at multiple sizes:
- **16px**: Small UI elements
- **24px**: Standard size (our baseline)
- **32px**: Larger UI elements
- **48px**: High DPI displays

## Tools and Resources

### Online Tools
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Online SVG optimizer
- [SVG Viewer](https://www.svgviewer.dev/) - SVG validation and testing
- [Path Editor](https://yqnn.github.io/svg-path-editor/) - Path optimization

### Development Tools
- **svgo**: Command-line optimizer
- **cairosvg**: SVG to PNG conversion
- **lxml**: XML parsing and validation
- **PIL/Pillow**: Image processing

### Design Software
- **Figma**: Modern icon design
- **Illustrator**: Professional vector editing
- **Inkscape**: Free vector editor
- **Sketch**: Mac design tool

## Batch Processing

### Optimize All Icons

```python
from pathlib import Path

def batch_optimize(svg_dir: str):
    """Optimize all SVGs in directory"""
    svg_path = Path(svg_dir)
    
    for svg_file in svg_path.glob('*.svg'):
        print(f"Optimizing {svg_file.name}...")
        optimize_svg_file(str(svg_file))
        
        # Check file size
        size = svg_file.stat().st_size
        if size > 2048:  # 2KB warning
            print(f"  ⚠️  Large file: {size} bytes")

# Usage
batch_optimize('src/assets/svg-raw/')
```

### Quality Check

```python
def batch_quality_check(svg_dir: str):
    """Check quality of all icons"""
    issues = []
    
    for svg_file in Path(svg_dir).glob('*.svg'):
        with open(svg_file, 'r') as f:
            content = f.read()
        
        # Check for common issues
        if 'fill="#' in content:
            issues.append(f"{svg_file.name}: Has hardcoded colors")
        
        if len(content) > 2048:
            issues.append(f"{svg_file.name}: File too large")
        
        if 'viewBox="0 0 24 24"' not in content:
            issues.append(f"{svg_file.name}: Wrong viewBox")
    
    return issues
```

## Performance Monitoring

### File Size Tracking

```python
import json
from datetime import datetime

def track_file_sizes(svg_dir: str, report_file: str):
    """Track file sizes over time"""
    sizes = {}
    
    for svg_file in Path(svg_dir).glob('*.svg'):
        sizes[svg_file.name] = svg_file.stat().st_size
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_icons': len(sizes),
        'total_size': sum(sizes.values()),
        'average_size': sum(sizes.values()) / len(sizes),
        'largest': max(sizes.items(), key=lambda x: x[1]),
        'smallest': min(sizes.items(), key=lambda x: x[1]),
        'sizes': sizes
    }
    
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
```

This comprehensive guide ensures all SVGs in the library are optimized, consistent, and high-quality.
