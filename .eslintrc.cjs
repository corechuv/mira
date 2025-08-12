/* eslint config */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','react','react-hooks','jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  settings: { react: { version: 'detect' } },
  env: { browser: true, es2022: true, node: true, jest: true },
  ignorePatterns: ['dist','node_modules'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  }
}
