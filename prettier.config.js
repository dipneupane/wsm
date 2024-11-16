// @ts-check
/** @type {import("prettier").Config} */
module.exports = {
  // Standard prettier options
  singleQuote: true,
  semi: true,
  // Since prettier 3.0, manually specifying plugins is required
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  // This plugin's options
  importOrder: [
    '',
    '^(react/(.*)$)|^(react$)',
    '',
    '^(next/(.*)$)|^(next$)',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/types/(.*)$',
    '',
    '^@/config/(.*)$',
    '',
    '^@/lib/(.*)$',
    '',
    '^@/hooks/(.*)$',
    '',
    '^@/components/(.*)$',
    '',
    '^@/components/ui/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
  trailingComma: 'es5',
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: false,
  singleAttributePerLine: false,
};
