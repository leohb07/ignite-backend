import config, { rules } from "eslint-config-standard";

export default [
  ...[].concat(config),

  {
    rules: {
      'no-var': 'error',
      semi: 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-multi-spaces': 'error',
      'space-in-parens': 'error',
      'no-multiple-empty-lines': 'error',
      'prefer-const': 'error',
    }
  }
];