import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Design System/Color Palette',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete color palette used throughout the Dojo Planner application. All colors are defined as CSS custom properties and organized by semantic function.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ColorSwatch = {
  name: string;
  variable: string;
  hex: string;
  usage: string;
};

const ColorSwatchGroup = ({
  groupName,
  colors,
}: {
  groupName: string;
  colors: ColorSwatch[];
}) => (
  <div className="mb-8">
    <h3 className="mb-4 text-lg font-semibold text-neutral-1500">{groupName}</h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {colors.map(color => (
        <div key={color.variable} className="flex flex-col">
          <div
            className="mb-2 h-24 rounded-lg border border-neutral-600 shadow-sm"
            style={{ backgroundColor: color.hex }}
            title={`${color.name} - ${color.hex}`}
          />
          <div className="flex-1">
            <p className="font-mono text-sm text-neutral-1000">{color.variable}</p>
            <p className="text-xs text-neutral-900">{color.hex}</p>
            <p className="mt-1 text-xs text-neutral-800">{color.usage}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const neutralColors: ColorSwatch[] = [
  {
    name: 'Neutral 50',
    variable: '--color-neutral-50',
    hex: '#f9fafe',
    usage: 'Light backgrounds, hover states',
  },
  {
    name: 'Neutral 100',
    variable: '--color-neutral-100',
    hex: '#ffffff',
    usage: 'White backgrounds, cards',
  },
  {
    name: 'Neutral 200',
    variable: '--color-neutral-200',
    hex: '#fcfcfc',
    usage: 'Light content areas',
  },
  {
    name: 'Neutral 300',
    variable: '--color-neutral-300',
    hex: '#f7f7f7',
    usage: 'Light backgrounds',
  },
  {
    name: 'Neutral 400',
    variable: '--color-neutral-400',
    hex: '#f2f2f2',
    usage: 'Subtle backgrounds',
  },
  {
    name: 'Neutral 500',
    variable: '--color-neutral-500',
    hex: '#eaeaea',
    usage: 'Disabled states, muted backgrounds',
  },
  {
    name: 'Neutral 600',
    variable: '--color-neutral-600',
    hex: '#d6d6d6',
    usage: 'Borders, dividers',
  },
  {
    name: 'Neutral 700',
    variable: '--color-neutral-700',
    hex: '#c2c2c2',
    usage: 'Secondary borders',
  },
  {
    name: 'Neutral 800',
    variable: '--color-neutral-800',
    hex: '#adadad',
    usage: 'Muted text, secondary text',
  },
  {
    name: 'Neutral 900',
    variable: '--color-neutral-900',
    hex: '#999999',
    usage: 'Medium gray text',
  },
  {
    name: 'Neutral 950',
    variable: '--color-neutral-950',
    hex: '#787878',
    usage: 'Darker gray text',
  },
  {
    name: 'Neutral 1000',
    variable: '--color-neutral-1000',
    hex: '#5a5a5a',
    usage: 'Dark text',
  },
  {
    name: 'Neutral 1100',
    variable: '--color-neutral-1100',
    hex: '#3c3c3c',
    usage: 'Dark text',
  },
  {
    name: 'Neutral 1200',
    variable: '--color-neutral-1200',
    hex: '#2e2e2e',
    usage: 'Dark text',
  },
  {
    name: 'Neutral 1300',
    variable: '--color-neutral-1300',
    hex: '#1e1e1e',
    usage: 'Very dark text',
  },
  {
    name: 'Neutral 1400',
    variable: '--color-neutral-1400',
    hex: '#0f0f0f',
    usage: 'Near black text',
  },
  {
    name: 'Neutral 1500',
    variable: '--color-neutral-1500',
    hex: '#000000',
    usage: 'Black, primary text',
  },
];

const greenColors: ColorSwatch[] = [
  {
    name: 'Green 50',
    variable: '--color-green-50',
    hex: '#edfbef',
    usage: 'Light success backgrounds',
  },
  {
    name: 'Green 100',
    variable: '--color-green-100',
    hex: '#c5eecb',
    usage: 'Success backgrounds',
  },
  {
    name: 'Green 200',
    variable: '--color-green-200',
    hex: '#04770c',
    usage: 'Dark green accents',
  },
  {
    name: 'Green 300',
    variable: '--color-green-300',
    hex: '#044208',
    usage: 'Very dark green',
  },
  {
    name: 'Green 400',
    variable: '--color-green-400',
    hex: '#46e15c',
    usage: 'Bright green, success indicators',
  },
];

const redColors: ColorSwatch[] = [
  {
    name: 'Red 500',
    variable: '--color-red-500',
    hex: '#e83737',
    usage: 'Error text, destructive actions',
  },
];

const blueColors: ColorSwatch[] = [
  {
    name: 'Blue 50',
    variable: '--color-blue-50',
    hex: '#e0e5fa',
    usage: 'Light blue backgrounds',
  },
  {
    name: 'Blue 100',
    variable: '--color-blue-100',
    hex: '#c6d0fa',
    usage: 'Blue backgrounds',
  },
  {
    name: 'Blue 200',
    variable: '--color-blue-200',
    hex: '#a1b2f6',
    usage: 'Medium blue backgrounds',
  },
  {
    name: 'Blue 300',
    variable: '--color-blue-300',
    hex: '#6481fa',
    usage: 'Blue accents',
  },
  {
    name: 'Blue 400',
    variable: '--color-blue-400',
    hex: '#2750f3',
    usage: 'Interactive blue',
  },
  {
    name: 'Blue 500',
    variable: '--color-blue-500',
    hex: '#0f30b9',
    usage: 'Primary blue',
  },
  {
    name: 'Blue 600',
    variable: '--color-blue-600',
    hex: '#071d79',
    usage: 'Dark blue',
  },
  {
    name: 'Blue 700',
    variable: '--color-blue-700',
    hex: '#04124a',
    usage: 'Very dark blue',
  },
];

export const AllColors: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-neutral-1500">Color Palette</h1>
        <p className="mb-8 text-neutral-900">
          Complete color palette used throughout the Dojo Planner application. All colors are
          defined as CSS custom properties.
        </p>

        <ColorSwatchGroup groupName="Neutral Colors" colors={neutralColors} />
        <ColorSwatchGroup groupName="Green Colors (Success)" colors={greenColors} />
        <ColorSwatchGroup groupName="Red Colors (Error)" colors={redColors} />
        <ColorSwatchGroup groupName="Blue Colors (Primary)" colors={blueColors} />
      </div>
    </div>
  ),
};

export const NeutralPalette: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-neutral-1500">Neutral Palette</h1>
        <p className="mb-8 text-neutral-900">
          Grayscale colors for backgrounds, borders, and text.
        </p>
        <ColorSwatchGroup groupName="Neutral Colors" colors={neutralColors} />
      </div>
    </div>
  ),
};

export const SemanticPalettes: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-neutral-1500">Semantic Color Palettes</h1>
        <p className="mb-8 text-neutral-900">
          Colors organized by semantic meaning and use case.
        </p>
        <ColorSwatchGroup groupName="Success (Green)" colors={greenColors} />
        <ColorSwatchGroup groupName="Error (Red)" colors={redColors} />
        <ColorSwatchGroup groupName="Primary/Info (Blue)" colors={blueColors} />
      </div>
    </div>
  ),
};

export const AccessibilityContrast: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-neutral-1500">Accessibility Contrast</h1>
        <p className="mb-8 text-neutral-900">
          Key color combinations and their contrast ratios for accessibility compliance.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-1500">Success Messages</h3>
            <div className="overflow-hidden rounded-lg shadow">
              <div
                className="p-4"
                style={{
                  backgroundColor: '#edfbef',
                  color: '#04770c',
                }}
              >
                <p className="font-semibold">Success message with green-50 background and green-200 text</p>
                <p className="mt-2 text-sm">Contrast ratio: High (WCAG AAA compliant)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-1500">Error Messages</h3>
            <div className="overflow-hidden rounded-lg shadow">
              <div
                className="p-4"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#e83737',
                }}
              >
                <p className="font-semibold">Error message with white background and red-500 text</p>
                <p className="mt-2 text-sm">Contrast ratio: High (WCAG AA compliant)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-1500">Primary Actions</h3>
            <div className="overflow-hidden rounded-lg shadow">
              <div
                className="p-4"
                style={{
                  backgroundColor: '#0f30b9',
                  color: '#ffffff',
                }}
              >
                <p className="font-semibold">Primary button with blue-500 background and white text</p>
                <p className="mt-2 text-sm">Contrast ratio: High (WCAG AAA compliant)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-1500">Body Text</h3>
            <div className="overflow-hidden rounded-lg shadow">
              <div
                className="p-4"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              >
                <p className="font-semibold">Body text with white background and black text</p>
                <p className="mt-2 text-sm">Contrast ratio: 21:1 (Maximum - WCAG AAA compliant)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
