import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { I18nWrapper } from '../src/lib/test-utils';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true, // Enable App Router support
    },
    docs: {
      toc: true, // Enable table of contents
    },
    a11y: {
      test: 'todo', // Make a11y tests optional
    },
  },
  decorators: [
    Story => (
      <I18nWrapper>
        <Story />
      </I18nWrapper>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
