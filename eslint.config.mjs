import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Remove unused imports on save
      'unused-imports/no-unused-imports': 'error',
      // Warn on unused vars (prefix with _ to opt-out)
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Sort imports (handled by ESLint since @trivago plugin is not installed)
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      // Existing localStorage hydration and countdown effects intentionally set
      // client state after mount; these will be revisited during hook extraction.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])

export default eslintConfig
