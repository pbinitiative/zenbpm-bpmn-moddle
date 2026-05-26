const eslint = require('@eslint/js');
const globals = require('globals');

module.exports = [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {
      // Add custom rules here if needed
    }
  }
];
