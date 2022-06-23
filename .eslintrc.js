/**
 * VSCODE ESLint配置
 *
 * @see http://eslint.org/docs/user-guide/configuring
 *
 */
module.exports = {
  root: true,
  /**
   * 这里不把@typescript-eslint/parser or babel-eslint直接设置为parser选项是因为vue plugin不允许
   *
   * @see https://vuejs.github.io/eslint-plugin-vue/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error
   *
   */
  parser: 'vue-eslint-parser',
  parserOptions: {
    /**
     * @see https://www.npmjs.com/package/@typescript-eslint/parser
     */
    parser: '@typescript-eslint/parser',
    ecmaVersion: 7,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    AMap: true,
    _: true
  },
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    /**
     * 对于typescript特定的规则
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
     */
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/base',
    '@vue/typescript',
    'standard'
  ],
  rules: {
    eqeqeq: [0],
    'spaced-comment': [0],
    'no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    'padded-blocks': [0, 'always'],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'space-before-function-paren': [
      'error',
      { anonymous: 'never', named: 'never', asyncArrow: 'always' }
    ],
    'lines-between-class-members': 'off',
    curly: 'off',
    semi: ['error', 'always', { omitLastInOneLineBlock: true }]
  }
};
