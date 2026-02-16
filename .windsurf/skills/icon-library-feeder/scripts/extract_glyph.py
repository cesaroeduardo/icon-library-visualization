#!/usr/bin/env python3
"""
Extract SVG glyphs from font files (.woff2)
Requires: fonttools, lxml
"""

import os
import sys
import json
import argparse
from pathlib import Path
from fontTools.ttLib import TTFont
from lxml import etree
import re

def load_font(font_path):
    """Load font file and return font object"""
    try:
        font = TTFont(font_path)
        return font
    except Exception as e:
        print(f"❌ Error loading font: {e}")
        return None

def get_glyph_names(font):
    """Get all glyph names from font"""
    cmap = font['cmap']
    glyph_names = []
    
    for table in cmap.tables:
        if hasattr(table, 'cmap'):
            for codepoint, name in table.cmap.items():
                glyph_names.append({
                    'codepoint': codepoint,
                    'name': name,
                    'unicode': f"\\{codepoint:04X}"
                })
    
    return glyph_names

def extract_glyph_to_svg(font, glyph_name, width=24, height=24):
    """Extract a single glyph and convert to SVG"""
    try:
        # Get glyph outline
        glyph_set = font.getGlyphSet()
        glyph = glyph_set[glyph_name]
        
        # Try to extract the actual glyph path using fontTools
        try:
            from fontTools.pens.svgPathPen import SVGPathPen
            
            # Create SVG path pen
            pen = SVGPathPen(glyphSet=glyph_set)
            glyph.draw(pen)
            
            # Get the path data
            path_data = pen.getCommands()
            
            # Convert commands to SVG path string
            if path_data:
                # Join all commands into a single path string
                svg_path = "".join(str(cmd) for cmd in path_data)
                
                # Extract coordinates from path to calculate proper viewBox
                import re
                coords = re.findall(r'(\d+(?:\.\d+)?)', svg_path)
                if coords:
                    coords = [float(c) for c in coords]
                    min_x = min(coords[::2])  # Every other coordinate starting from 0
                    max_x = max(coords[::2])
                    min_y = min(coords[1::2]) # Every other coordinate starting from 1
                    max_y = max(coords[1::2])
                    
                    # Calculate scale to fit in 24x24 with some padding
                    path_width = max_x - min_x
                    path_height = max_y - min_y
                    scale = min(20 / path_width, 20 / path_height) if path_width > 0 and path_height > 0 else 0.024
                    
                    # Center the icon
                    center_x = (min_x + max_x) / 2
                    center_y = (min_y + max_y) / 2
                    
                    # Create SVG with simple fixed transformation
                    svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale({scale}) translate({12/scale - center_x}, {12/scale - center_y + 2})">
    <path d="{svg_path}" fill="currentColor"/>
  </g>
</svg>'''
                else:
                    # Fallback transformation
                    svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(0.012) translate(0, 0)">
    <path d="{svg_path}" fill="currentColor"/>
  </g>
</svg>'''
                
                return svg
        except Exception as e:
            print(f"⚠️  SVGPathPen failed: {e}")
        
        # If SVGPathPen doesn't work, try manual extraction
        if hasattr(glyph, 'coordinates') and hasattr(glyph, 'endPts'):
            coordinates = glyph.coordinates
            endPts = glyph.endPts
            flags = glyph.flags if hasattr(glyph, 'flags') else None
            
            if len(coordinates) > 0:
                # Build SVG path from coordinates
                path_commands = []
                
                # Scale coordinates to fit in the viewBox and center the icon
                # Find bounding box first
                min_x = min(x for x, y in coordinates)
                max_x = max(x for x, y in coordinates)
                min_y = min(y for x, y in coordinates)
                max_y = max(y for x, y in coordinates)
                
                # Calculate scale to fit in 20x20 (leaving 2px margin)
                icon_width = max_x - min_x
                icon_height = max_y - min_y
                scale = min(20 / icon_width, 20 / icon_height) if icon_width > 0 and icon_height > 0 else 0.024
                
                # Center the icon in the 24x24 viewBox
                offset_x = (24 - icon_width * scale) / 2 - min_x * scale
                offset_y = (24 - icon_height * scale) / 2 - min_y * scale
                
                # Simple path extraction for complex glyphs
                if flags and len(flags) > 0:
                    # More complex glyph with multiple contours
                    current_contour = 0
                    for i, (x, y) in enumerate(coordinates):
                        x_scaled = x * scale + offset_x
                        y_scaled = y * scale + offset_y  # Don't flip Y axis for now
                        
                        if i == 0 or (current_contour < len(endPts) and i == endPts[current_contour] + 1):
                            # Start new contour
                            path_commands.append(f"M {x_scaled:.1f} {y_scaled:.1f}")
                            if current_contour < len(endPts) and i == endPts[current_contour] + 1:
                                current_contour += 1
                        else:
                            # Line to next point
                            path_commands.append(f"L {x_scaled:.1f} {y_scaled:.1f}")
                else:
                    # Simple glyph
                    for i, (x, y) in enumerate(coordinates):
                        x_scaled = x * scale + offset_x
                        y_scaled = y * scale + offset_y  # Don't flip Y axis for now
                        
                        if i == 0:
                            path_commands.append(f"M {x_scaled:.1f} {y_scaled:.1f}")
                        else:
                            path_commands.append(f"L {x_scaled:.1f} {y_scaled:.1f}")
                
                # Close the path
                path_commands.append("Z")
                
                svg_path = " ".join(path_commands)
                
                svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <path d="{svg_path}" fill="currentColor"/>
</svg>'''
                
                return svg
        
        # Fallback: create placeholder SVG
        print(f"⚠️  Could not extract path for glyph {glyph_name}, using placeholder")
        return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" fill="currentColor" opacity="0.3"/>
  <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="8">?</text>
</svg>'''
            
    except Exception as e:
        print(f"⚠️  Warning: Could not extract glyph {glyph_name}: {e}")
        # Return placeholder SVG
        return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" fill="currentColor" opacity="0.3"/>
  <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="8">?</text>
</svg>'''

def find_glyph_by_name(font, icon_name, scss_path=None):
    """Find glyph by icon name (e.g., 'ai-application')"""
    # First try to find unicode in SCSS file
    unicode_value = None
    if scss_path:
        print(f"🔍 Reading SCSS from: {scss_path}")
        try:
            with open(scss_path, 'r') as f:
                content = f.read()
            
            # Look for CSS class and extract unicode
            # Simple approach: find the line with content
            lines = content.split('\n')
            print(f"🔍 Searching through {len(lines)} lines...")
            for i, line in enumerate(lines):
                if icon_name in line and '::before' in line:
                    print(f"🔍 Found icon line {i+1}: {repr(line)}")
                    # Look at the next line for content
                    if i + 1 < len(lines):
                        next_line = lines[i + 1]
                        print(f"🔍 Next line {i+2}: {repr(next_line)}")
                        if 'content:' in next_line:
                            # Extract unicode from content line
                            content_pattern = r'content:\s*[\'"]\\([^\'"]+)[\'"]'
                            match = re.search(content_pattern, next_line)
                            if match:
                                unicode_value = match.group(1)
                                print("✅ Found unicode in SCSS: " + unicode_value)
                                break
                            else:
                                print(f"❌ Content pattern not matched on: {repr(next_line)}")
                        else:
                            print(f"❌ No content in next line: {repr(next_line)}")
                    else:
                        print(f"❌ No next line after line {i+1}")
            print(f"🔍 Finished search, unicode_value: {unicode_value}")
        except Exception as e:
            print("⚠️  Could not read SCSS: " + str(e))
    else:
        print("❌ No SCSS path provided")
    
    # If we have unicode, try to find by unicode FIRST
    if unicode_value:
        print(f"🔍 Looking for unicode: {unicode_value}")
        glyph_result = find_glyph_by_unicode(font, unicode_value)
        if glyph_result:
            print(f"✅ Found glyph by unicode: {glyph_result}")
            return glyph_result
        # If unicode lookup fails, unicode might be the glyph name directly
        if unicode_value in font.getGlyphSet():
            print(f"✅ Found glyph by unicode name: {unicode_value}")
            return unicode_value
        else:
            print(f"❌ Unicode {unicode_value} not found in glyph set")
    else:
        print("❌ No unicode value found")
    
    # Fallback: try glyph name conventions
    glyph_name = icon_name
    if icon_name.startswith('ai-'):
        glyph_name = icon_name[3:]  # Remove 'ai-' prefix
    elif icon_name.startswith('pi-'):
        glyph_name = icon_name[3:]  # Remove 'pi-' prefix
    
    # Try different naming conventions
    possible_names = [
        glyph_name,                    # Direct name: application
        glyph_name.replace('-', '_'),     # Underscore: ai_application
        glyph_name.replace('-', ''),        # No separator: aiapplication
        glyph_name.title().replace('-', ''), # Title case: AiApplication
    ]
    
    # Also try with prefix removed completely
    if glyph_name.startswith('ai'):
        possible_names.append(glyph_name[2:])  # Remove 'ai' prefix
    if glyph_name.startswith('pi'):
        possible_names.append(glyph_name[2:])  # Remove 'pi' prefix
    
    print(f"🔍 Looking for glyph: {icon_name}")
    print(f"   Trying names: {possible_names}")
    
    for name in possible_names:
        if name in font.getGlyphSet():
            print(f"✅ Found glyph: {name}")
            return name
    
    # Also try exact unicode match as fallback
    if unicode_value:
        if unicode_value in font.getGlyphSet():
            print(f"✅ Found glyph by unicode: {unicode_value}")
            return unicode_value
    
    print(f"❌ Glyph not found. Available EA08 variants:")
    for name in font.getGlyphSet().keys():
        if 'EA08' in name:
            print(f"   {name}")
    
    return None

def find_glyph_by_unicode(font, unicode_str):
    """Find glyph by unicode string (e.g., '\\ea08')"""
    # Handle both \ea08 and \\ea08 formats
    if unicode_str.startswith(chr(92) + chr(92)):
        unicode_str = unicode_str[2:]  # Remove \\ prefix
    elif unicode_str.startswith(chr(92)):
        unicode_str = unicode_str[1:]  # Remove \ prefix
    
    try:
        codepoint = int(unicode_str, 16)
        cmap = font['cmap']
        
        for table in cmap.tables:
            if hasattr(table, 'cmap') and codepoint in table.cmap:
                return table.cmap[codepoint]
    except:
        pass
    
    return None

def extract_icon_from_font(font_path, icon_name, output_path, width=24, height=24, scss_path=None):
    """Main function to extract an icon from font"""
    print(f"🔍 Extracting '{icon_name}' from {font_path}")
    
    # Load font
    font = load_font(font_path)
    if not font:
        return False
    
    # Find glyph
    glyph_name = find_glyph_by_name(font, icon_name, scss_path)
    
    if not glyph_name:
        print(f"❌ Glyph '{icon_name}' not found in font")
        return False
    
    print(f"✅ Found glyph: {glyph_name}")
    
    # Extract SVG
    svg_content = extract_glyph_to_svg(font, glyph_name, width, height)
    
    # Save SVG
    output_file = Path(output_path) / f"{icon_name}.svg"
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f"✅ SVG saved to: {output_file}")
        return True
    except Exception as e:
        print(f"❌ Error saving SVG: {e}")
        return False

def list_all_glyphs(font_path):
    """List all available glyphs in font"""
    font = load_font(font_path)
    if not font:
        return []
    
    glyphs = get_glyph_names(font)
    
    print(f"\n📋 Available glyphs in {Path(font_path).name}:")
    print("-" * 60)
    
    for glyph in sorted(glyphs, key=lambda x: x['name']):
        print(f"{glyph['unicode']:>6} {glyph['name']}")
    
    return glyphs

def main():
    parser = argparse.ArgumentParser(description='Extract SVG icons from font files')
    parser.add_argument('font_path', help='Path to font file (.woff2)')
    parser.add_argument('icon_name', help='Icon name (e.g., ai-application)')
    parser.add_argument('-o', '--output', default='.', help='Output directory')
    parser.add_argument('-w', '--width', type=int, default=24, help='SVG width')
    parser.add_argument('--svg-height', type=int, default=24, help='SVG height')
    parser.add_argument('-s', '--scss', help='Path to SCSS file for unicode lookup')
    parser.add_argument('-l', '--list', action='store_true', help='List all glyphs in font')
    
    args = parser.parse_args()
    
    if args.list:
        list_all_glyphs(args.font_path)
        return
    
    # Create output directory if needed
    os.makedirs(args.output, exist_ok=True)
    
    # Extract icon
    success = extract_icon_from_font(
        args.font_path, 
        args.icon_name, 
        args.output,
        args.width, 
        args.svg_height,
        args.scss
    )
    
    if success:
        print(f"\n🎉 Successfully extracted {args.icon_name}")
    else:
        print(f"\n❌ Failed to extract {args.icon_name}")
        sys.exit(1)

if __name__ == '__main__':
    main()
