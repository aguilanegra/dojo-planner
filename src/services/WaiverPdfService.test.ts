import type { WaiverPdfInput } from './WaiverPdfService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock jsPDF instance methods
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetFont = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetTextColor = vi.fn();
const mockLine = vi.fn();
const mockRect = vi.fn();
const mockAddImage = vi.fn();
const mockAddPage = vi.fn();
const mockSplitTextToSize = vi.fn((text: string) => [text]);
const mockOutput = vi.fn(() => new Blob(['mock-pdf-data'], { type: 'application/pdf' }));

// Use a class mock so `new JsPDF(...)` works correctly
vi.mock('jspdf', () => {
  class MockJsPDF {
    internal = {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    };

    text = mockText;
    setFontSize = mockSetFontSize;
    setFont = mockSetFont;
    setDrawColor = mockSetDrawColor;
    setTextColor = mockSetTextColor;
    line = mockLine;
    rect = mockRect;
    addImage = mockAddImage;
    addPage = mockAddPage;
    splitTextToSize = mockSplitTextToSize;
    output = mockOutput;
  }

  return { jsPDF: MockJsPDF };
});

describe('WaiverPdfService', () => {
  const mockInput: WaiverPdfInput = {
    organizationName: 'Iron Fist Dojo',
    waiverName: 'Standard Adult Waiver',
    waiverVersion: 1,
    renderedContent: 'I hereby acknowledge the risks of martial arts training and voluntarily participate.',
    memberFirstName: 'John',
    memberLastName: 'Doe',
    memberEmail: 'john.doe@example.com',
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==',
    signedByName: 'John Doe',
    signedAt: new Date('2024-06-15T10:30:00Z'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSplitTextToSize.mockImplementation((text: string) => [text]);
  });

  // ===========================================================================
  // generateWaiverPdf
  // ===========================================================================

  describe('generateWaiverPdf', () => {
    it('should create a PDF document and return a Blob', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      const result = generateWaiverPdf(mockInput);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should set organization name in the header', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockText).toHaveBeenCalledWith(
        'Iron Fist Dojo',
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({ align: 'center' }),
      );
    });

    it('should set waiver title in the header without version', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockText).toHaveBeenCalledWith(
        'Standard Adult Waiver',
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({ align: 'center' }),
      );
    });

    it('should include waiver version in the footer', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockText).toHaveBeenCalledWith(
        'Waiver version: v1',
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({ align: 'center' }),
      );
    });

    it('should include member name in the PDF', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Name: John Doe',
        expect.any(Number),
      );
    });

    it('should include member email in the PDF', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Email: john.doe@example.com',
        expect.any(Number),
      );
    });

    it('should include waiver content in the PDF', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'I hereby acknowledge the risks of martial arts training and voluntarily participate.',
        expect.any(Number),
      );
    });

    it('should strip HTML tags from rendered content', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: '<p>This is a <strong>test</strong> waiver.</p>',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'This is a test waiver.',
        expect.any(Number),
      );
    });

    it('should convert HTML entities in content', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: 'Terms &amp; Conditions: &lt;important&gt;',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Terms & Conditions: <important>',
        expect.any(Number),
      );
    });

    it('should convert &nbsp; to spaces', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: 'Hello&nbsp;World',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Hello World',
        expect.any(Number),
      );
    });

    it('should include signer name without relationship when signedByRelationship is not set', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Signed by: John Doe',
        expect.any(Number),
      );
    });

    it('should include signer name with relationship when signedByRelationship is set', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        signedByName: 'Jane Doe',
        signedByRelationship: 'Parent',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'Signed by: Jane Doe (Parent)',
        expect.any(Number),
      );
    });

    it('should include IP address when provided', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        ipAddress: '192.168.1.100',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        'IP Address: 192.168.1.100',
        expect.any(Number),
      );
    });

    it('should not include IP address when not provided', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      const ipCalls = mockSplitTextToSize.mock.calls.filter(
        (call: string[]) => typeof call[0] === 'string' && call[0].includes('IP Address'),
      );

      expect(ipCalls).toHaveLength(0);
    });

    it('should add signature image when signatureDataUrl is a valid data URL', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockAddImage).toHaveBeenCalledWith(
        mockInput.signatureDataUrl,
        'PNG',
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      );
    });

    it('should draw a border rectangle around the signature', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockRect).toHaveBeenCalled();
    });

    it('should handle signature image failure gracefully', async () => {
      mockAddImage.mockImplementation(() => {
        throw new Error('Failed to add image');
      });

      const { generateWaiverPdf } = await import('./WaiverPdfService');
      const result = generateWaiverPdf(mockInput);

      // Should still return a Blob even when the image fails
      expect(result).toBeInstanceOf(Blob);
      // Should add fallback text
      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        '[Signature on file]',
        expect.any(Number),
      );
    });

    it('should not add signature image when signatureDataUrl does not start with data:image/', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        signatureDataUrl: 'not-a-data-url',
      });

      expect(mockAddImage).not.toHaveBeenCalled();
    });

    it('should draw a horizontal line after the header', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockLine).toHaveBeenCalled();
    });

    it('should set draw color for the horizontal line', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSetDrawColor).toHaveBeenCalledWith(200);
    });

    it('should call output with blob format', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockOutput).toHaveBeenCalledWith('blob');
    });

    it('should handle multi-paragraph content by splitting on double newlines', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith('First paragraph.', expect.any(Number));
      expect(mockSplitTextToSize).toHaveBeenCalledWith('Second paragraph.', expect.any(Number));
      expect(mockSplitTextToSize).toHaveBeenCalledWith('Third paragraph.', expect.any(Number));
    });

    it('should handle <br> tags by converting to newlines', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: 'Line one.<br>Line two.<br/>Line three.',
      });

      // After HTML processing, <br> becomes \n, paragraphs are split on \n{2,}
      // but single newlines result in a single paragraph
      expect(mockSplitTextToSize).toHaveBeenCalledWith(
        expect.stringContaining('Line one.'),
        expect.any(Number),
      );
    });

    it('should handle </p> tags by converting to double newlines', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf({
        ...mockInput,
        renderedContent: '<p>Paragraph one.</p><p>Paragraph two.</p>',
      });

      expect(mockSplitTextToSize).toHaveBeenCalledWith('Paragraph one.', expect.any(Number));
      expect(mockSplitTextToSize).toHaveBeenCalledWith('Paragraph two.', expect.any(Number));
    });

    it('should add page break when content exceeds page height', async () => {
      // Make splitTextToSize return many lines to force page breaks
      mockSplitTextToSize.mockImplementation((text: string) => {
        // Return many lines to simulate long content
        return Array.from({ length: 80 }, () => text);
      });

      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      // With many lines, page breaks should have been added
      expect(mockAddPage).toHaveBeenCalled();
    });

    it('should include the MEMBER INFORMATION section header', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith('MEMBER INFORMATION', expect.any(Number));
    });

    it('should include the WAIVER AND RELEASE OF LIABILITY section header', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith('WAIVER AND RELEASE OF LIABILITY', expect.any(Number));
    });

    it('should include the SIGNATURE section header', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSplitTextToSize).toHaveBeenCalledWith('SIGNATURE', expect.any(Number));
    });

    it('should set footer text color to gray', async () => {
      const { generateWaiverPdf } = await import('./WaiverPdfService');
      generateWaiverPdf(mockInput);

      expect(mockSetTextColor).toHaveBeenCalledWith(128);
    });
  });

  // ===========================================================================
  // generatePdfFilename
  // ===========================================================================

  describe('generatePdfFilename', () => {
    it('should generate filename with last_first format and date', async () => {
      const { generatePdfFilename } = await import('./WaiverPdfService');
      const result = generatePdfFilename({
        memberFirstName: 'John',
        memberLastName: 'Doe',
        signedAt: new Date('2024-06-15T10:30:00Z'),
      });

      expect(result).toBe('waiver_Doe_John_2024-06-15.pdf');
    });

    it('should handle names with spaces by replacing with underscores', async () => {
      const { generatePdfFilename } = await import('./WaiverPdfService');
      const result = generatePdfFilename({
        memberFirstName: 'John Paul',
        memberLastName: 'De La Cruz',
        signedAt: new Date('2024-12-25T00:00:00Z'),
      });

      expect(result).toBe('waiver_De_La_Cruz_John_Paul_2024-12-25.pdf');
    });

    it('should use ISO date format (YYYY-MM-DD)', async () => {
      const { generatePdfFilename } = await import('./WaiverPdfService');
      const result = generatePdfFilename({
        memberFirstName: 'Jane',
        memberLastName: 'Smith',
        signedAt: new Date('2025-01-01T23:59:59Z'),
      });

      expect(result).toBe('waiver_Smith_Jane_2025-01-01.pdf');
    });
  });

  // ===========================================================================
  // downloadWaiverPdf
  // ===========================================================================

  describe('downloadWaiverPdf', () => {
    it('should create a link element, set properties, and trigger download', async () => {
      // Provide minimal DOM stubs for the Node test environment
      const mockClick = vi.fn();
      const mockLink = { href: '', download: '', click: mockClick };

      const originalCreateObjectURL = globalThis.URL.createObjectURL;
      const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      // Stub document (Node environment)
      const hasDocument = typeof globalThis.document !== 'undefined';

      if (!hasDocument) {
        (globalThis as any).document = {
          createElement: vi.fn(() => mockLink),
          body: {
            appendChild: vi.fn(),
            removeChild: vi.fn(),
          },
        };
      } else {
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
        vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn() as any);
        vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn() as any);
      }

      const { downloadWaiverPdf } = await import('./WaiverPdfService');
      const blob = new Blob(['test'], { type: 'application/pdf' });
      downloadWaiverPdf(blob, 'waiver_Doe_John_2024-06-15.pdf');

      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(mockLink.download).toBe('waiver_Doe_John_2024-06-15.pdf');
      expect(mockLink.href).toBe('blob:http://localhost/mock-url');
      expect(mockClick).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-url');

      // Restore
      globalThis.URL.createObjectURL = originalCreateObjectURL;
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
      if (hasDocument) {
        vi.restoreAllMocks();
      } else {
        delete (globalThis as any).document;
      }
    });
  });

  // ===========================================================================
  // generateAndDownloadWaiverPdf
  // ===========================================================================

  describe('generateAndDownloadWaiverPdf', () => {
    it('should generate PDF and trigger download with custom filename', async () => {
      const mockClick = vi.fn();
      const mockLink = { href: '', download: '', click: mockClick };

      const originalCreateObjectURL = globalThis.URL.createObjectURL;
      const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      if (typeof globalThis.document === 'undefined') {
        (globalThis as any).document = {
          createElement: vi.fn(() => mockLink),
          body: {
            appendChild: vi.fn(),
            removeChild: vi.fn(),
          },
        };
      } else {
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
        vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn() as any);
        vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn() as any);
      }

      const { generateAndDownloadWaiverPdf } = await import('./WaiverPdfService');
      generateAndDownloadWaiverPdf(mockInput, 'custom_filename.pdf');

      expect(mockLink.download).toBe('custom_filename.pdf');
      expect(mockClick).toHaveBeenCalled();

      globalThis.URL.createObjectURL = originalCreateObjectURL;
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
      if (typeof document !== 'undefined') {
        vi.restoreAllMocks();
      } else {
        delete (globalThis as any).document;
      }
    });

    it('should use default filename when custom filename not provided', async () => {
      const mockClick = vi.fn();
      const mockLink = { href: '', download: '', click: mockClick };

      const originalCreateObjectURL = globalThis.URL.createObjectURL;
      const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      if (typeof globalThis.document === 'undefined') {
        (globalThis as any).document = {
          createElement: vi.fn(() => mockLink),
          body: {
            appendChild: vi.fn(),
            removeChild: vi.fn(),
          },
        };
      } else {
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
        vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn() as any);
        vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn() as any);
      }

      const { generateAndDownloadWaiverPdf } = await import('./WaiverPdfService');
      generateAndDownloadWaiverPdf(mockInput);

      expect(mockLink.download).toBe('waiver_Doe_John_2024-06-15.pdf');
      expect(mockClick).toHaveBeenCalled();

      globalThis.URL.createObjectURL = originalCreateObjectURL;
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
      if (typeof document !== 'undefined') {
        vi.restoreAllMocks();
      } else {
        delete (globalThis as any).document;
      }
    });
  });
});
