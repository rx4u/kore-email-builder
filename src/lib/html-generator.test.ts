/**
 * Phase 1 smoke test: HTML generator contract (BMAD cleanup).
 * Ensures header font-size has units, feature-list uses semantic props and proper list HTML.
 */
import { describe, it, expect } from 'vitest';
import { generateEmailHTML } from './html-generator';

describe('generateEmailHTML (Phase 1 contract)', () => {
  it('outputs header title with font-size in px when titleFontSize is number', () => {
    const state = {
      header: {
        title: 'Release Notes',
        titleFontSize: 32,
        date: 'January 1, 2026',
        showDate: true,
        showLogo: false,
      },
      content: [] as any[],
      footer: { showFooter: false },
    };
    const html = generateEmailHTML(state as any, { emailWidth: 600 });
    expect(html).toContain('font-size: 32px');
    expect(html).not.toMatch(/font-size: 32[^p]/); // no unitless 32
    expect(html).toContain('Release Notes');
  });

  it('outputs feature-list with semantic titleSize/descriptionSize and proper ul/li list', () => {
    const state = {
      header: { title: 'Email', showLogo: false, showDate: false },
      content: [
        {
          id: 'b1',
          type: 'feature-list',
          props: {
            title: 'Features',
            titleSize: 'xl',
            descriptionSize: 'sm',
            description: 'Summary',
            bullets: ['Item one', 'Item two'],
            showTitle: true,
            showDescription: true,
            showBullets: true,
          },
        },
      ],
      footer: { showFooter: false },
    };
    const html = generateEmailHTML(state as any, { emailWidth: 600 });
    expect(html).toContain('<ul ');
    expect(html).toContain('<li ');
    expect(html).toContain('Item one');
    expect(html).toContain('Item two');
    expect(html).toContain('Features');
  });

  it('outputs feature-screenshot bullets as ul/li', () => {
    const state = {
      header: { title: 'Email', showLogo: false, showDate: false },
      content: [
        {
          id: 'b2',
          type: 'feature-screenshot',
          props: {
            title: 'Screenshot',
            bullets: ['Point A', 'Point B'],
            showBullets: true,
          },
        },
      ],
      footer: { showFooter: false },
    };
    const html = generateEmailHTML(state as any, { emailWidth: 600 });
    expect(html).toContain('<ul ');
    expect(html).toContain('Point A');
    expect(html).toContain('Point B');
  });

  it('outputs image-content block with title, description, and CTA (block.props shape)', () => {
    const state = {
      header: { title: 'Email', showLogo: false, showDate: false },
      content: [
        {
          id: 'img1',
          type: 'image-content',
          props: {
            title: 'Image + Content Title',
            description: 'Side-by-side layout.',
            imagePosition: 'left',
            imageWidth: 40,
            showTitle: true,
            showDescription: true,
            showCTA: true,
            ctaText: 'Learn more',
            ctaLink: 'https://example.com',
          },
        },
      ],
      footer: { showFooter: false },
    };
    const html = generateEmailHTML(state as any, { emailWidth: 600 });
    expect(html).toContain('Image + Content Title');
    expect(html).toContain('Side-by-side layout.');
    expect(html).toContain('Learn more');
    expect(html).toContain('https://example.com');
    expect(html).toContain('<table');
  });
});
