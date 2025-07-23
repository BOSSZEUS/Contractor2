import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
})

const config = compat.config({
  extends: 'next/core-web-vitals',
  rules: {
    'react/no-unescaped-entities': 'off',
  },
})

export default config
