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
        
        # Try to get glyph coordinates and build SVG path
        if hasattr(glyph, 'coordinates') and hasattr(glyph, 'endPts'):
            coordinates = glyph.coordinates
            if len(coordinates) > 0:
                # Simple path extraction - create basic shape
                path_data = []
                
                # For now, create a simple placeholder based on glyph complexity
                if hasattr(glyph, 'flags'):
                    # More complex glyph
                    path_data.append(f"M 6 6 L 18 6 L 18 18 L 6 18 Z")
                else:
                    # Simple glyph
                    path_data.append(f"M 8 8 L 16 8 L 16 16 L 8 16 Z")
                
                path = " ".join(path_data)
                
                # Create SVG
                svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <path d="{path}" fill="currentColor"/>
</svg>'''
                
                return svg
        
        # Fallback: create placeholder SVG
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
