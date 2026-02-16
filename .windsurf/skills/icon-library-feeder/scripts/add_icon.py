#!/usr/bin/env python3
"""
Main script to add new icons to the library
Orchestrates SVG extraction, catalog update, and validation
"""

import os
import sys
import argparse
import json
from pathlib import Path

# Import our modules
try:
    from extract_glyph import extract_icon_from_font, find_glyph_by_name
    from update_catalog import load_catalog, save_catalog, add_icon_to_catalog
    from validate_icon import validate_icon_integration, print_validation_results
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure all scripts are in the same directory")
    sys.exit(1)

def find_project_root():
    """Find project root by looking for src/ directory"""
    current = Path.cwd()
    
    while current != current.parent:
        if (current / 'src').exists():
            return current
        current = current.parent
    
    return None

def get_font_paths(project_root: Path) -> dict:
    """Get paths to font files"""
    return {
        'azion': project_root / 'src' / 'assets' / 'icon-fonts' / 'azionicons.woff2',
        'prime': project_root / 'src' / 'assets' / 'icon-fonts' / 'primeicons.woff2'
    }

def determine_icon_type(icon_name: str) -> str:
    """Determine if icon is ai-* or pi-* based on name"""
    if icon_name.startswith('ai-'):
        return 'azion'
    elif icon_name.startswith('pi-'):
        return 'prime'
    else:
        return 'azion'  # Default to azion

def extract_svg_from_font(project_root: Path, icon_name: str, svg_dir: Path) -> bool:
    """Extract SVG from font file"""
    font_type = determine_icon_type(icon_name)
    font_paths = get_font_paths(project_root)
    font_path = font_paths[font_type]
    
    if not font_path.exists():
        print(f"❌ Font file not found: {font_path}")
        return False
    
    print(f"🔍 Extracting '{icon_name}' from {font_type} font...")
    
    # Check if glyph exists
    from fontTools.ttLib import TTFont
    font = TTFont(str(font_path))
    scss_path = project_root / 'src' / 'assets' / 'icons.scss'
    print(f"🔍 Using SCSS path: {scss_path}")
    glyph_name = find_glyph_by_name(font, icon_name, str(scss_path))
    
    if not glyph_name:
        print(f"❌ Glyph '{icon_name}' not found in font")
        print("\n💡 Available glyphs:")
        from extract_glyph import get_glyph_names
        glyphs = get_glyph_names(font)
        for glyph in sorted(glyphs[:20], key=lambda x: x['name']):  # Show first 20
            print(f"   {glyph['unicode']:>6} {glyph['name']}")
        if len(glyphs) > 20:
            print(f"   ... and {len(glyphs) - 20} more")
        return False
    
    # Extract SVG
    return extract_icon_from_font(str(font_path), icon_name, str(svg_dir), scss_path=str(scss_path))

def add_icon_to_library(project_root: Path, icon_name: str, keywords: str, 
                     update: bool = False, svg_only: bool = False) -> bool:
    """Add a new icon to the library"""
    
    print(f"🚀 Adding icon '{icon_name}' to library...")
    print("=" * 50)
    
    # Paths
    svg_dir = project_root / 'src' / 'assets' / 'svg-raw'
    json_path = project_root / 'src' / 'icons.json'
    scss_path = project_root / 'src' / 'assets' / 'icons.scss'
    
    # Step 1: Extract SVG
    if not extract_svg_from_font(project_root, icon_name, svg_dir):
        return False
    
    svg_path = svg_dir / f'{icon_name}.svg'
    print(f"✅ SVG extracted: {svg_path}")
    
    if svg_only:
        print("✅ SVG extraction completed (skipping catalog update)")
        return True
    
    # Step 2: Update catalog
    print(f"\n📝 Updating catalog...")
    catalog = load_catalog(str(json_path))
    
    icon_type = determine_icon_type(icon_name)
    prefix = 'ai' if icon_type == 'azion' else 'pi'
    
    if not add_icon_to_catalog(catalog, icon_name, keywords, prefix, update):
        return False
    
    if not save_catalog(str(json_path), catalog):
        print("❌ Failed to save catalog")
        return False
    
    print(f"✅ Catalog updated: {json_path}")
    
    # Step 3: Validate integration
    print(f"\n🔍 Validating integration...")
    results = validate_icon_integration(icon_name, str(project_root))
    print_validation_results(results, icon_name)
    
    return results['overall']['valid']

def batch_add_icons(project_root: Path, icons_file: str, update: bool = False) -> bool:
    """Add multiple icons from a file"""
    print(f"📂 Processing batch file: {icons_file}")
    
    try:
        with open(icons_file, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"❌ Batch file not found: {icons_file}")
        return False
    
    success_count = 0
    total_count = 0
    
    for line_num, line in enumerate(lines, 1):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        total_count += 1
        
        # Parse line: name:keywords
        if ':' not in line:
            print(f"❌ Line {line_num}: Invalid format (expected 'name:keywords')")
            continue
        
        name, keywords = line.split(':', 1)
        name = name.strip()
        keywords = keywords.strip()
        
        print(f"\n{'='*60}")
        print(f"Processing {total_count}: {name}")
        print(f"{'='*60}")
        
        if add_icon_to_library(project_root, name, keywords, update):
            success_count += 1
        else:
            print(f"❌ Failed to add: {name}")
    
    print(f"\n📊 Batch Summary:")
    print(f"Total processed: {total_count}")
    print(f"Successful: {success_count}")
    print(f"Failed: {total_count - success_count}")
    print(f"Success rate: {(success_count/total_count)*100:.1f}%")
    
    return success_count == total_count

def list_available_glyphs(project_root: Path, font_type: str = 'azion'):
    """List all available glyphs in a font"""
    font_paths = get_font_paths(project_root)
    font_path = font_paths[font_type]
    
    if not font_path.exists():
        print(f"❌ Font file not found: {font_path}")
        return
    
    from extract_glyph import list_all_glyphs
    list_all_glyphs(str(font_path))

def main():
    parser = argparse.ArgumentParser(description='Add new icons to the icon library')
    parser.add_argument('icon_name', nargs='?', help='Icon name (e.g., ai-new-feature)')
    parser.add_argument('keywords', nargs='?', help='Keywords for the icon (e.g., "new, feature, functionality")')
    parser.add_argument('-p', '--project-root', default='.', help='Project root directory')
    parser.add_argument('-u', '--update', action='store_true', help='Update existing icon')
    parser.add_argument('-s', '--svg-only', action='store_true', help='Extract SVG only (skip catalog update)')
    parser.add_argument('-b', '--batch', help='Batch process icons from file')
    parser.add_argument('-l', '--list', choices=['azion', 'prime'], help='List available glyphs in font')
    
    args = parser.parse_args()
    
    # Find project root
    project_root = Path(args.project_root)
    if not (project_root / 'src').exists():
        project_root = find_project_root()
        if not project_root:
            print("❌ Could not find project root (looked for src/ directory)")
            sys.exit(1)
    
    print(f"📁 Project root: {project_root}")
    
    # List glyphs
    if args.list:
        list_available_glyphs(project_root, args.list)
        return
    
    # Batch processing
    if args.batch:
        if not batch_add_icons(project_root, args.batch, args.update):
            sys.exit(1)
        return
    
    # Single icon processing
    if not args.icon_name or not args.keywords:
        print("❌ Missing required arguments")
        print("Usage: add_icon.py ICON_NAME KEYWORDS")
        print("Example: add_icon.py ai-new-feature 'new, feature, functionality'")
        sys.exit(1)
    
    # Normalize icon name
    icon_name = args.icon_name.strip()
    if not (icon_name.startswith('ai-') or icon_name.startswith('pi-')):
        icon_type = determine_icon_type(icon_name)
        prefix = 'ai' if icon_type == 'azion' else 'pi'
        icon_name = f"{prefix}-{icon_name}"
        print(f"📝 Normalized icon name to: {icon_name}")
    
    # Add icon
    success = add_icon_to_library(
        project_root, 
        icon_name, 
        args.keywords.strip(), 
        args.update, 
        args.svg_only
    )
    
    if success:
        print(f"\n🎉 Successfully added '{icon_name}' to the library!")
    else:
        print(f"\n❌ Failed to add '{icon_name}' to the library")
        sys.exit(1)

if __name__ == '__main__':
    main()
