# Typography System Mapping

## Figma Design System to Tailwind CSS Mapping

Based on the Figma typography system, here's how to apply typography styles in your components.

### Typography Styles Overview

| Style Name | Size | Weight | Font | Tailwind Class |
|---|---|---|---|---|
| Display | 32px | Medium (500) | Inter | `text-display font-medium` |
| Headline | 24px | Medium (500) | Inter | `text-headline font-medium` |
| Title | 20px | Medium (500) | Inter | `text-title font-medium` |
| Subtitle | 16px | Semi-bold (600) | Inter | `text-subtitle font-semibold` |
| Body Large | 16px | Medium (500) | Inter | `text-body-large font-medium` |
| Body | 14px | Medium (500) | Inter | `text-body font-medium` |
| Body Small | 12px | Medium (500) | Inter | `text-body-small font-medium` |
| Caption / Label | 11px | Medium (500) | Inter | `text-caption font-medium` |

### Tailwind Text Size Utilities

The following custom text size utilities have been added to your theme:

```css
--text-display: 32px; /* Use with .text-display */
--text-headline: 24px; /* Use with .text-headline */
--text-title: 20px; /* Use with .text-title */
--text-subtitle: 16px; /* Use with .text-subtitle */
--text-body-large: 16px; /* Use with .text-body-large */
--text-body: 14px; /* Use with .text-body */
--text-body-small: 12px; /* Use with .text-body-small */
--text-caption: 11px; /* Use with .text-caption */
```

### Font Weight Mapping

| Weight Name | CSS Value | Tailwind Class |
|---|---|---|
| Medium | 500 | `font-medium` |
| Semi-bold | 600 | `font-semibold` |

### Usage Examples

#### Display
```jsx
<h1 className="text-display font-medium">Large Heading</h1>;
```

#### Headline
```jsx
<h2 className="text-headline font-medium">Section Heading</h2>;
```

#### Title
```jsx
<h3 className="text-title font-medium">Card Title</h3>;
```

#### Subtitle
```jsx
<h3 className="text-subtitle font-semibold">Subtitle Text</h3>;
```

#### Body Large
```jsx
<p className="text-body-large font-medium">Large body text</p>;
```

#### Body (Default)
```jsx
<p className="text-body font-medium">Standard body text</p>;
```

#### Body Small
```jsx
<p className="text-body-small font-medium">Small body text</p>;
```

#### Caption / Label
```jsx
<span className="text-caption font-medium">Caption or label</span>;
```

### Component Typography Guidelines

Based on the Figma design system, here are the recommended typography styles for common components:

#### Buttons
- **Label**: Body (14px, Medium) or Caption (11px, Medium)
- **Class**: `text-body font-medium` or `text-caption font-medium`

#### Forms
- **Label**: Caption / Label (11px, Medium)
- **Input text**: Body (14px, Medium)
- **Helper text**: Body Small (12px, Medium)
- **Class**: Label: `text-caption font-medium`, Input: `text-body font-medium`, Helper: `text-body-small font-medium`

#### Cards
- **Title**: Title (20px, Medium)
- **Description**: Body (14px, Medium)
- **Class**: Title: `text-title font-medium`, Description: `text-body font-medium`

#### Dialogs / Modals
- **Title**: Headline (24px, Medium)
- **Description**: Body (14px, Medium)
- **Class**: Title: `text-headline font-medium`, Description: `text-body font-medium`

#### Navigation
- **Menu items**: Body (14px, Medium)
- **Section headers**: Body Small (12px, Medium)
- **Class**: Items: `text-body font-medium`, Section: `text-body-small font-medium`

#### Tables
- **Headers**: Body (14px, Medium)
- **Data**: Body (14px, Medium)
- **Class**: `text-body font-medium`

#### Hero/Landing Pages
- **Main title**: Display (32px, Medium)
- **Section title**: Headline (24px, Medium)
- **Subtitle**: Body Large (16px, Medium)
- **Description**: Body (14px, Medium)
- **Class**: Display: `text-display font-medium`, Headline: `text-headline font-medium`, Subtitle: `text-body-large font-medium`, Description: `text-body font-medium`

### Font Family

All typography uses **Inter** font family. The font is imported from Rsms (https://rsms.me/inter/inter.css).

### Migration Path

When updating components:
1. Replace hardcoded `text-*` classes with semantic typography classes
2. Ensure font weights match the Figma specification
3. Test in both light and dark modes
4. Update Storybook stories to showcase new typography

### Custom Tailwind Utilities (If Needed)

For components that need semantic typography shortcuts, you can create utility classes:

```css
@layer components {
  @apply text-display font-medium;
  @apply text-headline font-medium;
  @apply text-title font-medium;
  @apply text-subtitle font-semibold;
  @apply text-body-large font-medium;
  @apply text-body font-medium;
  @apply text-body-small font-medium;
  @apply text-caption font-medium;
}
```

This mapping document should be referenced when:
- Creating new components
- Updating existing components
- Code reviewing typography changes
- Documenting components in Storybook
