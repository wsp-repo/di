const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  ...require('@zalib/linter/eslint/node')(),
  ...require('@zalib/linter/eslint/node-ts')(),
]);
