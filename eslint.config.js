
// eslint.config.js
import js from '@eslint/js';
import next from 'eslint-config-next';

export default [
  js.configs.recommended,
  // Next.js 15 + TypeScript rules
  ...next(), // uses Next’s flat config presets
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      // your custom rules here
    },
  },
];

