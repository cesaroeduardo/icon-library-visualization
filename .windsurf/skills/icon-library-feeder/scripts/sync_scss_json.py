#!/usr/bin/env python3
"""
Synchronize SCSS classes with JSON catalog
Ensures consistency between CSS classes in SCSS and entries in JSON
"""

import json
import re
import argparse
from pathlib import Path

def extract_classes_from_scss(scss_path: str) -> list:
    """Extract all ai-* classes from SCSS file"""
    classes = []
    
    with open(scss_path, 'r') as f:
        scss_content = f.read()
    
    lines = scss_content.split('\n')
    for i, line in enumerate(lines):
        if '.ai.ai-' in line and '::before' in line:
            # Extract class name like 'ai ai-deploy-pillar'
            match = re.search(r'(\.ai\.ai-[^:]+)', line)
            if match:
                class_name = match.group(1).replace('.', ' ')  # Remove dots and add space
                
                # Look at next line for unicode
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    unicode_match = re.search(r'content:\s*[\'"]\\([^\'"]+)[\'"]', next_line)
                    if unicode_match:
                        unicode_value = unicode_match.group(1)
                        
                        # Create icon entry
                        icon_entry = {
                            'icon': class_name,
                            'keywords': class_name.replace('ai ai-', '').replace('-', ', '),
                            'name': class_name.replace('ai ', '')
                        }
                        classes.append(icon_entry)
    
    return classes

def sync_scss_to_json(scss_path: str, json_path: str, backup: bool = True) -> bool:
    """Synchronize SCSS classes to JSON catalog"""
    try:
        # Create backup if requested
        if backup:
            backup_path = json_path + '.backup'
            with open(json_path, 'r') as original:
                with open(backup_path, 'w') as backup_file:
                    backup_file.write(original.read())
            print(f"✅ Backup created: {backup_path}")
        
        # Extract classes from SCSS
        scss_classes = extract_classes_from_scss(scss_path)
        print(f"✅ Found {len(scss_classes)} classes in SCSS")
        
        # Load existing JSON to preserve PrimeIcons
        with open(json_path, 'r') as f:
            existing_catalog = json.load(f)
        
        # Separate ai and pi icons
        ai_icons = []
        pi_icons = []
        
        for icon in existing_catalog:
            if icon['icon'].startswith('pi '):
                pi_icons.append(icon)
        
        # Add SCSS classes
        ai_icons = scss_classes
        
        # Combine catalogs
        new_catalog = ai_icons + pi_icons
        
        # Sort by name
        new_catalog.sort(key=lambda x: x['name'])
        
        # Save new catalog
        with open(json_path, 'w') as f:
            json.dump(new_catalog, f, indent=2)
        
        print(f"✅ Updated JSON with {len(ai_icons)} ai-icons and {len(pi_icons)} pi-icons")
        return True
        
    except Exception as e:
        print(f"❌ Error syncing SCSS to JSON: {e}")
        return False

def validate_consistency(scss_path: str, json_path: str) -> bool:
    """Validate consistency between SCSS and JSON"""
    try:
        # Extract classes from SCSS
        scss_classes = extract_classes_from_scss(scss_path)
        scss_class_names = {icon['icon'] for icon in scss_classes}
        
        # Load JSON
        with open(json_path, 'r') as f:
            catalog = json.load(f)
        
        json_classes = {icon['icon'] for icon in catalog if icon['icon'].startswith('ai ')}
        
        # Check differences
        missing_in_json = scss_class_names - json_classes
        missing_in_scss = json_classes - scss_class_names
        
        if missing_in_json:
            print(f"❌ {len(missing_in_json)} classes in SCSS but missing in JSON:")
            for cls in sorted(list(missing_in_json))[:10]:
                print(f"  • {cls}")
            if len(missing_in_json) > 10:
                print(f"  ... and {len(missing_in_json) - 10} more")
        
        if missing_in_scss:
            print(f"❌ {len(missing_in_scss)} classes in JSON but missing in SCSS:")
            for cls in sorted(list(missing_in_scss))[:10]:
                print(f"  • {cls}")
            if len(missing_in_scss) > 10:
                print(f"  ... and {len(missing_in_scss) - 10} more")
        
        if not missing_in_json and not missing_in_scss:
            print("✅ SCSS and JSON are consistent")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"❌ Error validating consistency: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Synchronize SCSS classes with JSON catalog')
    parser.add_argument('-p', '--project-root', default='.', help='Project root directory')
    parser.add_argument('--scss', default='src/assets/icons.scss', help='Path to SCSS file')
    parser.add_argument('--json', default='src/icons.json', help='Path to JSON file')
    parser.add_argument('--no-backup', action='store_true', help='Skip creating backup')
    parser.add_argument('--validate-only', action='store_true', help='Only validate, don\'t sync')
    
    args = parser.parse_args()
    
    project_root = Path(args.project_root)
    scss_path = project_root / args.scss
    json_path = project_root / args.json
    
    print(f"🔍 SCSS file: {scss_path}")
    print(f"🔍 JSON file: {json_path}")
    print()
    
    # Validate consistency first
    print("🔍 Validating SCSS-JSON consistency...")
    is_consistent = validate_consistency(str(scss_path), str(json_path))
    
    if args.validate_only:
        if is_consistent:
            print("✅ No sync needed - files are consistent")
        else:
            print("❌ Files are inconsistent - run without --validate-only to sync")
        return
    
    if not is_consistent:
        print("\n🔧 Synchronizing SCSS to JSON...")
        success = sync_scss_to_json(str(scss_path), str(json_path), not args.no_backup)
        
        if success:
            print("\n✅ Synchronization completed!")
            print("🔄 Restart your development server to see changes")
        else:
            print("\n❌ Synchronization failed")
    else:
        print("\n✅ No synchronization needed - files are already consistent")

if __name__ == '__main__':
    main()
