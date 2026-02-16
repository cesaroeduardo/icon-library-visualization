#!/usr/bin/env python3
"""
Validate icon files and integration
"""

import json
import os
import sys
import argparse
from pathlib import Path
import re
from lxml import etree

def validate_svg_file(svg_path: str) -> tuple[bool, list]:
    """Validate SVG file format and structure"""
    issues = []
    
    try:
        # Check if file exists
        if not os.path.exists(svg_path):
            issues.append(f"File does not exist: {svg_path}")
            return False, issues
        
        # Parse SVG
        with open(svg_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Basic XML validation
        try:
            tree = etree.fromstring(content.encode())
        except etree.XMLSyntaxError as e:
            issues.append(f"Invalid XML: {e}")
            return False, issues
        
        # Check SVG namespace
        if tree.tag != '{http://www.w3.org/2000/svg}svg':
            issues.append("Root element must be <svg> with proper namespace")
        
        # Check for required attributes
        if 'viewBox' not in tree.attrib:
            issues.append("Missing viewBox attribute")
        
        if 'width' not in tree.attrib or 'height' not in tree.attrib:
            issues.append("Missing width or height attribute")
        
        # Check for path elements
        paths = tree.xpath('//svg:path', namespaces={'svg': 'http://www.w3.org/2000/svg'})
        if not paths:
            issues.append("No <path> elements found")
        
        # Check file size
        file_size = os.path.getsize(svg_path)
        if file_size > 10000:  # 10KB limit
            issues.append(f"File too large: {file_size} bytes (should be < 10KB)")
        
        return len(issues) == 0, issues
        
    except Exception as e:
        issues.append(f"Error reading file: {e}")
        return False, issues

def validate_css_class(scss_path: str, icon_name: str) -> tuple[bool, list]:
    """Validate CSS class exists in SCSS file"""
    issues = []
    
    try:
        with open(scss_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for icon class
        class_pattern = r'\.' + icon_name + r'::before\s*{[^}]*content:'
        if not re.search(class_pattern, content):
            issues.append(f"CSS class '.{icon_name}::before' not found")
        
        # Check for content property
        content_pattern = r'\.' + icon_name + r'::before\s*{[^}]*content:'
        if not re.search(content_pattern, content, re.DOTALL):
            issues.append(f"CSS class '.{icon_name}::before' missing content property")
        
        return len(issues) == 0, issues
        
    except FileNotFoundError:
        issues.append(f"SCSS file not found: {scss_path}")
        return False, issues
    except Exception as e:
        issues.append(f"Error reading SCSS file: {e}")
        return False, issues

def validate_css_json_consistency(scss_path: str, json_path: str) -> tuple[bool, list]:
    """Validate that all CSS classes in SCSS exist in JSON and vice versa"""
    issues = []
    
    try:
        # Read SCSS and extract all ai-* classes
        with open(scss_path, 'r') as f:
            scss_content = f.read()
        
        scss_classes = set()
        lines = scss_content.split('\n')
        for line in lines:
            if '.ai.ai-' in line and '::before' in line:
                match = re.search(r'(\.ai\.ai-[^:]+)', line)
                if match:
                    class_name = match.group(1).replace('.', ' ')
                    scss_classes.add(class_name)
        
        # Read JSON and extract all ai-* classes
        with open(json_path, 'r') as f:
            catalog = json.load(f)
        
        json_classes = set()
        for icon in catalog:
            if icon['icon'].startswith('ai '):
                json_classes.add(icon['icon'])
        
        # Check for inconsistencies
        missing_in_json = scss_classes - json_classes
        missing_in_scss = json_classes - scss_classes
        
        if missing_in_json:
            issues.append(f"CSS classes in SCSS but missing in JSON ({len(missing_in_json)}):")
            for cls in sorted(list(missing_in_json))[:10]:  # Show first 10
                issues.append(f"  • {cls}")
            if len(missing_in_json) > 10:
                issues.append(f"  ... and {len(missing_in_json) - 10} more")
        
        if missing_in_scss:
            issues.append(f"CSS classes in JSON but missing in SCSS ({len(missing_in_scss)}):")
            for cls in sorted(list(missing_in_scss))[:10]:  # Show first 10
                issues.append(f"  • {cls}")
            if len(missing_in_scss) > 10:
                issues.append(f"  ... and {len(missing_in_scss) - 10} more")
        
        return len(issues) == 0, issues
        
    except Exception as e:
        issues.append(f"Error validating CSS-JSON consistency: {e}")
        return False, issues

def validate_json_entry(json_path: str, icon_name: str) -> tuple[bool, list]:
    """Validate icon entry in JSON catalog"""
    issues = []
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            catalog = json.load(f)
        
        # Find icon entry
        icon_entry = None
        for icon in catalog:
            if icon.get('name') == icon_name:
                icon_entry = icon
                break
        
        if not icon_entry:
            issues.append(f"Icon '{icon_name}' not found in catalog")
            return False, issues
        
        # Validate entry structure
        required_fields = ['name', 'icon', 'keywords']
        for field in required_fields:
            if field not in icon_entry:
                issues.append(f"Missing field '{field}' in catalog entry")
        
        # Validate icon class format
        icon_class = icon_entry.get('icon', '')
        expected_class = f"{icon_name.split('-')[0]} {icon_name}"
        if icon_class != expected_class:
            issues.append(f"Icon class mismatch: expected '{expected_class}', got '{icon_class}'")
        
        # Validate keywords
        keywords = icon_entry.get('keywords', '')
        if not isinstance(keywords, str) or len(keywords.strip()) == 0:
            issues.append("Keywords must be a non-empty string")
        
        return len(issues) == 0, issues
        
    except FileNotFoundError:
        issues.append(f"JSON file not found: {json_path}")
        return False, issues
    except json.JSONDecodeError as e:
        issues.append(f"Invalid JSON: {e}")
        return False, issues
    except Exception as e:
        issues.append(f"Error reading JSON file: {e}")
        return False, issues

def validate_icon_integration(icon_name: str, project_root: str) -> dict:
    """Validate complete icon integration"""
    results = {
        'svg': {'valid': False, 'issues': []},
        'css': {'valid': False, 'issues': []},
        'json': {'valid': False, 'issues': []},
        'overall': {'valid': False, 'issues': []}
    }
    
    # Paths
    svg_path = Path(project_root) / 'src' / 'assets' / 'svg-raw' / f'{icon_name}.svg'
    scss_path = Path(project_root) / 'src' / 'assets' / 'icons.scss'
    json_path = Path(project_root) / 'src' / 'icons.json'
    
    # Validate SVG
    svg_valid, svg_issues = validate_svg_file(str(svg_path))
    results['svg'] = {'valid': svg_valid, 'issues': svg_issues}
    
    # Validate CSS
    css_valid, css_issues = validate_css_class(str(scss_path), icon_name)
    results['css'] = {'valid': css_valid, 'issues': css_issues}
    
    # Validate JSON
    json_valid, json_issues = validate_json_entry(str(json_path), icon_name)
    results['json'] = {'valid': json_valid, 'issues': json_issues}
    
    # Overall validation
    all_issues = svg_issues + css_issues + json_issues
    results['overall'] = {
        'valid': svg_valid and css_valid and json_valid,
        'issues': all_issues
    }
    
    return results

def print_validation_results(results: dict, icon_name: str):
    """Print validation results in a formatted way"""
    print(f"\n🔍 Validation Results for '{icon_name}':")
    print("=" * 60)
    
    # Overall status
    if results['overall']['valid']:
        print("✅ OVERALL: PASSED")
    else:
        print("❌ OVERALL: FAILED")
    
    print()
    
    # Individual components
    components = [
        ('SVG File', results['svg']),
        ('CSS Class', results['css']),
        ('JSON Entry', results['json'])
    ]
    
    for name, result in components:
        status = "✅ PASSED" if result['valid'] else "❌ FAILED"
        print(f"{name:12} {status}")
        
        if result['issues']:
            for issue in result['issues']:
                print(f"            • {issue}")
        print()

def validate_all_icons(project_root: str, check_consistency: bool = False) -> dict:
    """Validate all icons in the project"""
    json_path = Path(project_root) / 'src' / 'icons.json'
    svg_dir = Path(project_root) / 'src' / 'assets' / 'svg-raw'
    scss_path = Path(project_root) / 'src' / 'assets' / 'icons.scss'
    
    # Check CSS-JSON consistency first if requested
    if check_consistency:
        print("🔍 Checking CSS-JSON consistency...")
        consistent, issues = validate_css_json_consistency(str(scss_path), str(json_path))
        if not consistent:
            print("❌ CSS-JSON consistency issues found:")
            for issue in issues:
                print(f"  {issue}")
            print("\n⚠️  This indicates that SCSS classes were renamed without updating JSON!")
            print("   Use the skill to synchronize SCSS and JSON, or update manually.")
        else:
            print("✅ CSS-JSON consistency check passed")
        print()
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            catalog = json.load(f)
    except Exception as e:
        print(f"❌ Error loading catalog: {e}")
        return {}
    
    all_results = {}
    failed_count = 0
    
    for icon in catalog:
        icon_name = icon['name']
        results = validate_icon_integration(icon_name, project_root)
        all_results[icon_name] = results
        
        if not results['overall']['valid']:
            failed_count += 1
    
    # Summary
    total_count = len(catalog)
    passed_count = total_count - failed_count
    
    print(f"\n📊 Validation Summary:")
    print(f"Total icons: {total_count}")
    print(f"Passed: {passed_count}")
    print(f"Failed: {failed_count}")
    print(f"Success rate: {(passed_count/total_count)*100:.1f}%")
    
    return all_results

def main():
    parser = argparse.ArgumentParser(description='Validate icon files and integration')
    parser.add_argument('icon_name', nargs='?', help='Icon name to validate (e.g., ai-application)')
    parser.add_argument('-p', '--project-root', default='.', help='Project root directory')
    parser.add_argument('-a', '--all', action='store_true', help='Validate all icons')
    parser.add_argument('--check-consistency', action='store_true', help='Check CSS-JSON consistency')
    parser.add_argument('-s', '--svg-only', action='store_true', help='Validate SVG file only')
    parser.add_argument('-c', '--css-only', action='store_true', help='Validate CSS class only')
    parser.add_argument('-j', '--json-only', action='store_true', help='Validate JSON entry only')
    
    args = parser.parse_args()
    
    if args.all:
        validate_all_icons(args.project_root, args.check_consistency)
        return
    
    if not args.icon_name:
        parser.print_help()
        sys.exit(1)
    
    # Validate specific icon
    results = validate_icon_integration(args.icon_name, args.project_root)
    
    # Filter results based on options
    if args.svg_only:
        results = {'svg': results['svg'], 'overall': results['svg']}
    elif args.css_only:
        results = {'css': results['css'], 'overall': results['css']}
    elif args.json_only:
        results = {'json': results['json'], 'overall': results['json']}
    
    print_validation_results(results, args.icon_name)
    
    # Exit with error code if validation failed
    if not results['overall']['valid']:
        sys.exit(1)

if __name__ == '__main__':
    main()
