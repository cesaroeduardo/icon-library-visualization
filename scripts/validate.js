/**
 * SVG Validation Script
 *
 * Audits all SVG files in svg/ai and svg/pi directories for common issues
 * that affect icon font generation:
 *
 *  - Missing or incomplete SVGs (placeholder content with <rect>/<text> instead of <path>)
 *  - Non-square viewBox (should be square for consistent icon rendering)
 *  - Non-standard viewBox size (should be 24x24 for consistency)
 *  - Stroke-based paths (icon fonts only support filled paths, not strokes)
 *  - fill="none" on the root SVG (expected for outlined icons using fill on paths)
 *  - Filenames with spaces (causes build issues)
 *
 * Usage: node scripts/validate-svg.js
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const SVG_DIRS = ['svg/ai', 'svg/pi'];
const EXPECTED_VIEWBOX = '0 0 24 24';

const issues = {
  placeholder: [],
  stroke: [],
  nonSquareViewBox: [],
  nonStandardSize: [],
  filenameSpace: [],
  noPath: [],
  clipPath: [],
  fillBlack: [],
};

for (const dir of SVG_DIRS) {
  const files = readdirSync(dir).filter(f => f.endsWith('.svg'));

  for (const file of files) {
    const filePath = join(dir, file);
    const content = readFileSync(filePath, 'utf-8');
    const name = basename(file, '.svg');

    // Filename with spaces
    if (file.includes(' ')) {
      issues.filenameSpace.push({ file: filePath, detail: `"${file}"` });
    }

    // Placeholder SVGs (rect + text with "?")
    if (content.includes('<rect') && content.includes('<text') && content.includes('?')) {
      issues.placeholder.push({ file: filePath, detail: 'Contains placeholder <rect>+<text> with "?"' });
    }

    // No <path> element at all
    if (!content.includes('<path')) {
      issues.noPath.push({ file: filePath, detail: 'No <path> element found' });
    }

    // Stroke-based paths
    if (content.includes('stroke=')) {
      const strokeColors = [...content.matchAll(/stroke="([^"]*)"/g)].map(m => m[1]);
      issues.stroke.push({ file: filePath, detail: `stroke="${strokeColors.join(', ')}"` });
    }

    // Fill="black" (should use currentColor for theming)
    const fillBlackMatches = [...content.matchAll(/fill="(black|#000|#000000)"/g)];
    if (fillBlackMatches.length > 0) {
      issues.fillBlack.push({ file: filePath, detail: `fill="${fillBlackMatches[0][1]}" — should use "currentColor"` });
    }

    // ViewBox analysis
    const viewBoxMatch = content.match(/viewBox="([^"]*)"/);
    if (viewBoxMatch) {
      const vb = viewBoxMatch[1];
      const [, , w, h] = vb.split(/\s+/).map(Number);

      if (w !== h) {
        issues.nonSquareViewBox.push({ file: filePath, detail: `viewBox="${vb}" (${w}x${h}, not square)` });
      } else if (w !== 24 || h !== 24) {
        issues.nonStandardSize.push({ file: filePath, detail: `viewBox="${vb}" (${w}x${h}, expected 24x24)` });
      }
    }

    // clipPath usage (can cause issues in icon fonts)
    if (content.includes('<clipPath') || content.includes('clip-path=')) {
      issues.clipPath.push({ file: filePath, detail: 'Uses <clipPath> — may not render in icon font' });
    }
  }
}

// Print report
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║           SVG ICON VALIDATION REPORT                ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

const printSection = (title, items, severity) => {
  const icon = severity === 'error' ? '❌' : severity === 'warn' ? '⚠️' : 'ℹ️';
  console.log(`${icon}  ${title} (${items.length})`);
  if (items.length > 0) {
    for (const item of items) {
      console.log(`   ${item.file} — ${item.detail}`);
    }
  }
  console.log();
};

printSection('PLACEHOLDER / INCOMPLETE SVGs (missing real icon art)', issues.placeholder, 'error');
printSection('NO <path> ELEMENT (icon will be empty in font)', issues.noPath, 'error');
printSection('FILENAME WITH SPACES (build may fail)', issues.filenameSpace, 'error');
printSection('STROKE-BASED PATHS (icon fonts only support fills)', issues.stroke, 'warn');
printSection('fill="black" (should use "currentColor" for theming)', issues.fillBlack, 'warn');
printSection('CLIP-PATH USAGE (may not render in icon font)', issues.clipPath, 'warn');
printSection('NON-SQUARE VIEWBOX (icons should be square)', issues.nonSquareViewBox, 'warn');
printSection('NON-STANDARD SIZE (expected 24x24)', issues.nonStandardSize, 'info');

// Summary
const errorCount = issues.placeholder.length + issues.noPath.length + issues.filenameSpace.length;
const warnCount = issues.stroke.length + issues.fillBlack.length + issues.clipPath.length + issues.nonSquareViewBox.length;
const infoCount = issues.nonStandardSize.length;

console.log('────────────────────────────────────────────────────────');
console.log(`Summary: ${errorCount} errors, ${warnCount} warnings, ${infoCount} info`);

if (errorCount > 0) {
  console.log('\n🔴 There are critical issues that must be fixed before build.');
  process.exit(1);
}
if (warnCount > 0) {
  console.log('\n🟡 There are warnings that may affect icon rendering.');
}
