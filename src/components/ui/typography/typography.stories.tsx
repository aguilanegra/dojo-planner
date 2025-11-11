import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * # Typography System
 *
 * The typography system follows the Figma design specifications with semantic naming.
 * All typography uses the **Inter** font family.
 *
 * ## Font Weights
 *
 * - **Medium (500)**: Default for most text styles
 * - **Semi-bold (600)**: Used for Subtitle and emphasis
 *
 * ## Typography Styles
 */

export const Display: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Display</p>
        <h1 className="text-display font-medium">The largest heading style for main titles</h1>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">32px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-display font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const Headline: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Headline</p>
        <h2 className="text-headline font-medium">Section headings and dialog titles</h2>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">24px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-headline font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const Title: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Title</p>
        <h3 className="text-title font-medium">Card titles and sub-headings</h3>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">20px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-title font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const Subtitle: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Subtitle</p>
        <h4 className="text-subtitle font-semibold">Emphasized text and labels with more weight</h4>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">16px, Semi-bold (600), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-subtitle font-semibold</code>
        </p>
      </div>
    </div>
  ),
};

export const BodyLarge: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Body Large</p>
        <p className="text-body-large font-medium">Larger body text for important content and descriptions</p>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">16px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-body-large font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Body</p>
        <p className="text-body font-medium">Standard body text for paragraphs, descriptions, and regular content</p>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">14px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-body font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const BodySmall: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Body Small</p>
        <p className="text-body-small font-medium">Smaller body text for secondary information and helper text</p>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">12px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-body-small font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const Caption: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption font-medium text-muted-foreground">Caption / Label</p>
        <span className="text-caption font-medium">Labels, captions, and very small text</span>
      </div>
      <div className="rounded border border-accent/50 bg-accent/20 p-4">
        <p className="text-xs text-muted-foreground">11px, Medium (500), Inter</p>
        <p className="text-xs text-muted-foreground">
          CSS:
          <code className="bg-muted px-1">text-caption font-medium</code>
        </p>
      </div>
    </div>
  ),
};

export const AllTypography: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div>
        <h1 className="mb-2 text-display font-medium">Display (32px)</h1>
        <p className="text-body font-medium text-muted-foreground">Use for major page titles and hero sections</p>
      </div>

      <div>
        <h2 className="mb-2 text-headline font-medium">Headline (24px)</h2>
        <p className="text-body font-medium text-muted-foreground">Use for section titles and dialog headings</p>
      </div>

      <div>
        <h3 className="mb-2 text-title font-medium">Title (20px)</h3>
        <p className="text-body font-medium text-muted-foreground">Use for card titles and subsection headings</p>
      </div>

      <div>
        <h4 className="mb-2 text-subtitle font-semibold">Subtitle (16px, Semi-bold)</h4>
        <p className="text-body font-medium text-muted-foreground">Use for emphasized labels and subheadings</p>
      </div>

      <div>
        <p className="mb-2 text-body-large font-medium">Body Large (16px)</p>
        <p className="text-body font-medium text-muted-foreground">Use for important body content and larger descriptions</p>
      </div>

      <div>
        <p className="mb-2 text-body font-medium">Body (14px)</p>
        <p className="text-body font-medium text-muted-foreground">Use for standard paragraph text and regular content</p>
      </div>

      <div>
        <p className="mb-2 text-body-small font-medium">Body Small (12px)</p>
        <p className="text-body font-medium text-muted-foreground">Use for secondary information and helper text</p>
      </div>

      <div>
        <span className="text-caption font-medium">Caption / Label (11px)</span>
        <p className="text-body font-medium text-muted-foreground">Use for labels, captions, and very small text</p>
      </div>
    </div>
  ),
};

export const ComponentUsage: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div className="space-y-4 rounded-lg border p-6">
        <p className="text-caption font-medium text-muted-foreground">BUTTON</p>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-body font-medium text-primary-foreground hover:bg-primary/90"
        >
          Button Label (Body)
        </button>
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <p className="text-caption font-medium text-muted-foreground">FORM LABEL</p>
        <label htmlFor="demo-input" className="text-caption font-medium">Form Label (Caption)</label>
        <input
          id="demo-input"
          type="text"
          placeholder="Input text (Body)"
          className="w-full rounded border px-3 py-2 text-body font-medium placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-title font-medium">Card Title (Title)</h3>
        <p className="text-body font-medium text-muted-foreground">Card description (Body)</p>
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-headline font-medium">Dialog Title (Headline)</h2>
        <p className="text-body font-medium text-muted-foreground">Dialog description (Body)</p>
      </div>

      <div className="space-y-3">
        <p className="text-body font-medium">Menu Items (Body)</p>
        <div className="rounded border">
          <div className="cursor-pointer px-3 py-2 text-body font-medium hover:bg-accent">Menu Item 1</div>
          <div className="cursor-pointer px-3 py-2 text-body font-medium hover:bg-accent">Menu Item 2</div>
          <div className="cursor-pointer px-3 py-2 text-body font-medium hover:bg-accent">Menu Item 3</div>
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left text-body font-medium">Header (Body)</th>
            <th className="p-3 text-left text-body font-medium">Header (Body)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3 text-body font-medium">Data (Body)</td>
            <td className="p-3 text-body font-medium">Data (Body)</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
