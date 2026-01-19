#!/usr/bin/env python3
"""
Script to systematically fix all hardcoded numeric placeholders in calculator files.
Converts placeholder="123" to placeholder={t('namespace.placeholders.fieldName')}
"""

import re
import json
import os
from pathlib import Path
from collections import defaultdict

# Base directory
BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")
CALCULATORS_DIR = BASE_DIR / "src/components/calculators"
LOCALES_DIR = BASE_DIR / "public/locales"

# Track all changes
changes_log = []

def extract_field_name_from_context(file_content, line_num, placeholder_value):
    """
    Try to extract the field name from the surrounding context.
    Look for value={inputs.fieldName} or onValueChange patterns.
    """
    lines = file_content.split('\n')
    start = max(0, line_num - 10)
    end = min(len(lines), line_num + 3)
    context = '\n'.join(lines[start:end])

    # Look for patterns like: value={inputs.fieldName} or value={fieldName}
    value_match = re.search(r'value=\{(?:inputs\.)?(\w+)\}', context)
    if value_match:
        return value_match.group(1)

    # Look for onValueChange patterns
    on_change_match = re.search(r"onValueChange.*?['\"](\w+)['\"]", context)
    if on_change_match:
        return on_change_match.group(1)

    # Look for label or FormField labels
    label_match = re.search(r't\(["\'][\w.]+\.(\w+)["\']', context)
    if label_match:
        field = label_match.group(1)
        # Clean up common suffixes
        field = re.sub(r'_(label|tooltip|input)$', '', field)
        return field

    return None

def find_translation_namespace(file_path):
    """Find what translation namespace a file uses."""
    content = file_path.read_text()
    match = re.search(r"useTranslation\(['\"]([^'\"]+)['\"]", content)
    if match:
        return match.group(1)
    match = re.search(r"useTranslation\(\[['\"]([^'\"]+)", content)
    if match:
        return match.group(1)
    return None

def process_file(file_path):
    """Process a single calculator file to fix hardcoded placeholders."""
    content = file_path.read_text()
    lines = content.split('\n')

    # Find translation namespace
    namespace = find_translation_namespace(file_path)
    if not namespace:
        print(f"Warning: Could not find translation namespace for {file_path}")
        return None

    # Find all hardcoded placeholders
    placeholder_pattern = r'placeholder="(\d+(?:\.\d+)?(?:,\s*\d+)*(?:-\d+)?)"'
    matches = []

    for i, line in enumerate(lines):
        for match in re.finditer(placeholder_pattern, line):
            placeholder_value = match.group(1)
            field_name = extract_field_name_from_context(content, i, placeholder_value)
            if field_name:
                matches.append({
                    'line_num': i,
                    'original': match.group(0),
                    'value': placeholder_value,
                    'field_name': field_name,
                    'line': line
                })

    if not matches:
        return None

    # Group by field name for translation file
    placeholders_for_translation = {}
    for match in matches:
        field_name = match['field_name']
        placeholders_for_translation[field_name] = match['value']

    # Update file content
    new_content = content
    for match in matches:
        field_name = match['field_name']
        # Extract the base namespace (remove .json if present)
        base_ns = namespace.replace('.json', '').split('/')[-1]

        # Try to infer calculator-specific key prefix from file or namespace
        calc_prefix = ""
        if "car_maintenance" in namespace or "CarMaintenance" in str(file_path):
            calc_prefix = "car_maintenance."
        elif "/" in namespace:
            # For calc/automotive, calc/finance, etc.
            parts = namespace.split('/')
            if len(parts) > 1:
                calc_prefix = ""  # Will use top-level namespace

        translation_key = f"{calc_prefix}placeholders.{field_name}"

        new_placeholder = f'placeholder={{t("{translation_key}")}}'
        new_content = new_content.replace(
            match['original'],
            new_placeholder,
            1  # Replace only first occurrence
        )

    # Write updated content
    file_path.write_text(new_content)

    return {
        'file': str(file_path.relative_to(BASE_DIR)),
        'namespace': namespace,
        'count': len(matches),
        'placeholders': placeholders_for_translation
    }

def update_translation_files(namespace, placeholders):
    """Update EN and AR translation files with placeholder values."""
    # Remove 'calc/' prefix if present for file path
    ns_path = namespace.replace('calc/', '')

    for lang in ['en', 'ar']:
        json_file = LOCALES_DIR / lang / 'calc' / f"{ns_path}.json"

        if not json_file.exists():
            print(f"Warning: Translation file not found: {json_file}")
            continue

        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Navigate to the right section (handle nested structures)
            # For files like automotive.json with car_maintenance section
            # we need to find the right place to add placeholders

            # Simple approach: add at top level if no specific section found
            if 'placeholders' not in data:
                data['placeholders'] = {}

            # Update placeholders
            data['placeholders'].update(placeholders)

            # Write back
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            print(f"Updated {json_file}")
        except Exception as e:
            print(f"Error updating {json_file}: {e}")

# Main execution
def main():
    print("Starting placeholder fix process...")
    print("=" * 60)

    # Find all calculator TypeScript files
    calculator_files = list(CALCULATORS_DIR.glob("**/*Calculator.tsx"))

    results = []
    for calc_file in calculator_files:
        result = process_file(calc_file)
        if result:
            results.append(result)
            print(f"✓ Fixed {result['count']:2d} placeholders in {result['file']}")

            # Update translation files
            # update_translation_files(result['namespace'], result['placeholders'])

    print("\n" + "=" * 60)
    print(f"Summary: Fixed {sum(r['count'] for r in results)} placeholders in {len(results)} files")

    # Print detailed report
    print("\nDetailed Report:")
    for result in sorted(results, key=lambda x: x['count'], reverse=True):
        print(f"\n{result['file']} ({result['count']} placeholders)")
        print(f"  Namespace: {result['namespace']}")
        for field, value in result['placeholders'].items():
            print(f"    - {field}: {value}")

if __name__ == "__main__":
    main()
