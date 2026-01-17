import os
import re

def is_likely_hardcoded(text):
    text = text.strip()
    if not text:
        return False
    # Ignore simple numbers or symbols
    if re.match(r'^[\d\.,\s\%\$\+\-\*\/\(\)\:\|]+$', text):
        return False
    # Ignore purely technical strings (no spaces, often camelCase or snake_case) unless it looks like a word
    if ' ' not in text and len(text) < 20 and not text.isalpha():
        return False
    # Ignore things that look like keys
    if re.match(r'^[a-z0-9_\.]+$', text):
        return False
    # Ignore simple logic strings
    if text in ['true', 'false', 'null', 'undefined', 'imperial', 'metric', 'velocity', 'acceleration', 'force', 'mass', 'time', 'distance', 'result']:
        return False
    return True

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []
    lines = content.split('\n')
    
    # Regex to find text between tags: >Some Text<
    jsx_text_matches = re.finditer(r'>([^<]+)<', content)
    
    for match in jsx_text_matches:
        text = match.group(1)
        # Calculate line number
        start_pos = match.start(1)
        line_num = content[:start_pos].count('\n') + 1
        
        # Filter out {{ }} expressions and { } expressions
        text_clean = re.sub(r'\{[^}]+\}', '', text)
        
        if is_likely_hardcoded(text_clean):
            # Check if it's just whitespace
            if text_clean.strip():
                issues.append((line_num, f"JSX Text: '{text_clean.strip()}'"))

    # Check for hardcoded options in selects
    # <option value="...">Some Text</option>
    option_matches = re.finditer(r'<option[^>]*>([^<]+)</option>', content)
    for match in option_matches:
        text = match.group(1)
        start_pos = match.start(1)
        line_num = content[:start_pos].count('\n') + 1
        
        if '{' not in text and is_likely_hardcoded(text):
             issues.append((line_num, f"Option Text: '{text}'"))
             
    # Check for specific patterns like unit strings not in t()
    # e.g. " kg", " m/s"
    # This is hard, but let's look for strings in JSX attributes that aren't className, id, etc.
    # Actually, let's look for "String" or 'String' that contain spaces and are not inside t()
    
    # Naive check for placeholder="Hardcoded"
    placeholder_matches = re.finditer(r'placeholder=["\']([^"\']+)["\']', content)
    for match in placeholder_matches:
        text = match.group(1)
        start_pos = match.start(1)
        line_num = content[:start_pos].count('\n') + 1
        if '{' not in text and is_likely_hardcoded(text):
             issues.append((line_num, f"Placeholder: '{text}'"))

    return issues

def main():
    import sys
    if len(sys.argv) > 1:
        base_dir = sys.argv[1]
    else:
        base_dir = 'src/components/calculators'
    
    all_issues = {}
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                file_issues = audit_file(path)
                if file_issues:
                    all_issues[path] = file_issues

    # Print results
    for path, issues in all_issues.items():
        rel_path = os.path.relpath(path, base_dir)
        print(f"\nFile: {rel_path}")
        for line, msg in issues:
            print(f"  Line {line}: {msg}")

if __name__ == "__main__":
    main()
