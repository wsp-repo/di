const jsEslintConfig = require('@wspro/linter/eslint/js');
const tsEslintConfig = require('@wspro/linter/eslint/ts');

module.exports = {
  overrides: [
    {
      ...jsEslintConfig,
      files: ['*.js'],
    },
    {
      ...tsEslintConfig,
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        include: ['./src/**/*.ts'],
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
  root: true,
};
