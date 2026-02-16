#!/usr/bin/env python3
"""
Update icons.json catalog with new icon entries
"""

import json
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Any

def load_catalog(json_path: str) -> List[Dict[str, Any]]:
    """Load existing icons catalog"""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Catalog file not found: {json_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in catalog: {e}")
        return []

def save_catalog(json_path: str, catalog: List[Dict[str, Any]]) -> bool:
    """Save icons catalog with proper formatting"""
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False, sort_keys=True)
        return True
    except Exception as e:
        print(f"❌ Error saving catalog: {e}")
        return False

def find_existing_icon(catalog: List[Dict[str, Any]], icon_name: str) -> Dict[str, Any]:
    """Find existing icon entry by name"""
    for icon in catalog:
        if icon.get('name') == icon_name:
            return icon
    return None

def create_icon_entry(icon_name: str, keywords: str, prefix: str = 'ai') -> Dict[str, Any]:
    """Create a new icon entry"""
    return {
        "name": icon_name,
        "icon": f"{prefix} {icon_name}",
        "keywords": keywords
    }

def validate_icon_entry(entry: Dict[str, Any]) -> bool:
    """Validate icon entry format"""
    required_fields = ['name', 'icon', 'keywords']
    
    for field in required_fields:
        if field not in entry:
            print(f"❌ Missing required field: {field}")
            return False
    
    # Validate name format
    name = entry['name']
    if not (name.startswith('ai-') or name.startswith('pi-')):
        print(f"❌ Icon name must start with 'ai-' or 'pi-': {name}")
        return False
    
    # Validate icon class matches name
    icon_class = entry['icon']
    expected_class = f"{name.split('-')[0]} {name}"
    if icon_class != expected_class:
        print(f"⚠️  Warning: icon class '{icon_class}' doesn't match expected '{expected_class}'")
    
    # Validate keywords
    keywords = entry['keywords']
    if not isinstance(keywords, str) or len(keywords.strip()) == 0:
        print(f"❌ Keywords must be a non-empty string")
        return False
    
    return True

def add_icon_to_catalog(catalog: List[Dict[str, Any]], icon_name: str, keywords: str, 
                      prefix: str = 'ai', update: bool = False) -> bool:
    """Add or update an icon in the catalog"""
    
    # Create new entry
    new_entry = create_icon_entry(icon_name, keywords, prefix)
    
    # Validate entry
    if not validate_icon_entry(new_entry):
        return False
    
    # Check if icon already exists
    existing = find_existing_icon(catalog, icon_name)
    
    if existing:
        if update:
            # Update existing entry
            index = catalog.index(existing)
            catalog[index] = new_entry
            print(f"✅ Updated existing entry: {icon_name}")
        else:
            print(f"⚠️  Icon '{icon_name}' already exists. Use --update to replace.")
            return False
    else:
        # Add new entry
        catalog.append(new_entry)
        print(f"✅ Added new entry: {icon_name}")
    
    return True

def remove_icon_from_catalog(catalog: List[Dict[str, Any]], icon_name: str) -> bool:
    """Remove an icon from the catalog"""
    existing = find_existing_icon(catalog, icon_name)
    
    if existing:
        catalog.remove(existing)
        print(f"✅ Removed entry: {icon_name}")
        return True
    else:
        print(f"⚠️  Icon '{icon_name}' not found in catalog")
        return False

def list_catalog(catalog: List[Dict[str, Any]], filter_prefix: str = None) -> None:
    """List all icons in catalog"""
    print(f"\n📋 Icon Catalog ({len(catalog)} icons):")
    print("-" * 80)
    
    filtered_catalog = catalog
    if filter_prefix:
        filtered_catalog = [icon for icon in catalog if icon['name'].startswith(filter_prefix)]
        print(f"Filtered by prefix: {filter_prefix}")
    
    for icon in sorted(filtered_catalog, key=lambda x: x['name']):
        name = icon['name']
        icon_class = icon['icon']
        keywords = icon['keywords']
        print(f"{name:<25} {icon_class:<20} {keywords}")

def validate_catalog(catalog: List[Dict[str, Any]]) -> List[str]:
    """Validate entire catalog and return list of issues"""
    issues = []
    names = set()
    
    for i, icon in enumerate(catalog):
        # Basic validation
        if not validate_icon_entry(icon):
            issues.append(f"Line {i+1}: Invalid entry for {icon.get('name', 'unknown')}")
            continue
        
        # Check for duplicates
        name = icon['name']
        if name in names:
            issues.append(f"Line {i+1}: Duplicate icon name '{name}'")
        names.add(name)
    
    return issues

def main():
    parser = argparse.ArgumentParser(description='Update icons.json catalog')
    parser.add_argument('catalog_path', help='Path to icons.json file')
    parser.add_argument('-a', '--add', help='Add new icon (format: name:keywords)')
    parser.add_argument('-u', '--update', action='store_true', help='Update existing icon')
    parser.add_argument('-r', '--remove', help='Remove icon by name')
    parser.add_argument('-p', '--prefix', default='ai', choices=['ai', 'pi'], help='Icon prefix')
    parser.add_argument('-l', '--list', action='store_true', help='List all icons')
    parser.add_argument('-f', '--filter', help='Filter by prefix (ai or pi)')
    parser.add_argument('-v', '--validate', action='store_true', help='Validate catalog')
    
    args = parser.parse_args()
    
    # Load catalog
    catalog = load_catalog(args.catalog_path)
    
    if args.list:
        list_catalog(catalog, args.filter)
        return
    
    if args.validate:
        issues = validate_catalog(catalog)
        if issues:
            print(f"\n❌ Found {len(issues)} issues:")
            for issue in issues:
                print(f"  • {issue}")
            sys.exit(1)
        else:
            print(f"\n✅ Catalog validation passed ({len(catalog)} icons)")
        return
    
    # Add/update icon
    if args.add:
        if ':' not in args.add:
            print("❌ Invalid format. Use: name:keywords")
            sys.exit(1)
        
        name, keywords = args.add.split(':', 1)
        name = name.strip()
        keywords = keywords.strip()
        
        if not name.startswith('ai-') and not name.startswith('pi-'):
            name = f"{args.prefix}-{name}"
        
        success = add_icon_to_catalog(catalog, name, keywords, args.prefix, args.update)
        if success:
            if save_catalog(args.catalog_path, catalog):
                print(f"✅ Catalog updated successfully")
            else:
                print("❌ Failed to save catalog")
                sys.exit(1)
        else:
            sys.exit(1)
    
    # Remove icon
    elif args.remove:
        success = remove_icon_from_catalog(catalog, args.remove)
        if success:
            if save_catalog(args.catalog_path, catalog):
                print(f"✅ Catalog updated successfully")
            else:
                print("❌ Failed to save catalog")
                sys.exit(1)
        else:
            sys.exit(1)
    
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
