# Color Palette

This document outlines the color palette used throughout the Dojo Planner application. All colors are defined in [src/styles/dojo-planner-colors.css](../src/styles/dojo-planner-colors.css) and are available as CSS custom properties.

## Color Organization

Colors are organized into semantic groups based on their function:

- **Neutral** - Grayscale colors for backgrounds, borders, and text
- **Green** - Success and positive action colors
- **Red** - Error and destructive action colors
- **Blue** - Primary, info, and interactive element colors

## Color Scales

Each color family uses a numeric scale:
- **50**: Lightest shade
- **100-400**: Light to medium shades
- **500**: Primary/base shade
- **600-700**: Dark shades
- **900+**: Darkest shades (for neutrals only)

## Neutral Colors

The neutral palette provides a full grayscale range from very light to very dark:

| Name | Hex | Usage |
|------|-----|-------|
| `--color-neutral-50` | #f9fafe | Light backgrounds, hover states |
| `--color-neutral-100` | #ffffff | White backgrounds, cards |
| `--color-neutral-200` | #fcfcfc | Light content areas |
| `--color-neutral-300` | #f7f7f7 | Light backgrounds |
| `--color-neutral-400` | #f2f2f2 | Subtle backgrounds |
| `--color-neutral-500` | #eaeaea | Disabled states, muted backgrounds |
| `--color-neutral-600` | #d6d6d6 | Borders, dividers |
| `--color-neutral-700` | #c2c2c2 | Secondary borders |
| `--color-neutral-800` | #adadad | Muted text, secondary text |
| `--color-neutral-900` | #999999 | Medium gray text |
| `--color-neutral-950` | #787878 | Darker gray text |
| `--color-neutral-1000` | #5a5a5a | Dark text |
| `--color-neutral-1100` | #3c3c3c | Dark text |
| `--color-neutral-1200` | #2e2e2e | Dark text |
| `--color-neutral-1300` | #1e1e1e | Very dark text |
| `--color-neutral-1400` | #0f0f0f | Near black text |
| `--color-neutral-1500` | #000000 | Black, primary text |

## Green Colors

Used for success states, positive feedback, and completed actions:

| Name | Hex | Usage |
|------|-----|-------|
| `--color-green-50` | #edfbef | Light success backgrounds |
| `--color-green-100` | #c5eecb | Success backgrounds |
| `--color-green-200` | #04770c | Dark green accents |
| `--color-green-300` | #044208 | Very dark green |
| `--color-green-400` | #46e15c | Bright green, success indicators |

## Red Colors

Used for errors, warnings, and destructive actions:

| Name | Hex | Usage |
|------|-----|-------|
| `--color-red-500` | #e83737 | Error text, destructive actions |

## Blue Colors

Used for primary actions, links, and informational content:

| Name | Hex | Usage |
|------|-----|-------|
| `--color-blue-50` | #e0e5fa | Light blue backgrounds |
| `--color-blue-100` | #c6d0fa | Blue backgrounds |
| `--color-blue-200` | #a1b2f6 | Medium blue backgrounds |
| `--color-blue-300` | #6481fa | Blue accents |
| `--color-blue-400` | #2750f3 | Interactive blue |
| `--color-blue-500` | #0f30b9 | Primary blue |
| `--color-blue-600` | #071d79 | Dark blue |
| `--color-blue-700` | #04124a | Very dark blue |

## Usage

### CSS Variables

Use the CSS custom properties directly in your stylesheets:

```css
.button {
  background-color: var(--color-blue-500);
  color: var(--color-neutral-100);
}

.error {
  color: var(--color-red-500);
}
```

### Tailwind Classes

If using Tailwind CSS, you can reference these colors:

```html
<!-- Using Tailwind utilities with custom colors -->
<div class="bg-neutral-50 text-neutral-1500">
  Success: <span class="text-green-400">Complete</span>
</div>

<button class="bg-blue-500 text-neutral-100">
  Primary Action
</button>

<span class="text-red-500">Error message</span>
```

### Theme Integration

The colors work seamlessly with the existing light and dark theme system. The `@layer theme` ensures proper cascade and specificity.

## Adding New Colors

To add new colors to the palette:

1. Edit [src/styles/dojo-planner-colors.css](../src/styles/dojo-planner-colors.css)
2. Add the color variable to the `:root` selector
3. Add the theme mapping in the `@layer theme` block
4. Document the new color in this file with its intended usage
5. Run tests to ensure no conflicts or issues

## Maintenance

- Keep colors organized by semantic group
- Use consistent naming conventions
- Document any new colors and their intended usage
- Review colors during accessibility audits (WCAG contrast ratios)
- Consider updating the Storybook color story when adding new colors
