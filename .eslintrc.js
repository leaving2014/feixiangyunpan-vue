module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 最大允许空行
    'no-multiple-empty-lines': [1, { max: 2 }],
    // 关闭空行检测
    'no-trailing-spaces': 'off',
    ignoreComments: 0, // 忽略空格检测
    'space-before-function-paren': 0,
    semi: 'off',
    'comma-dangle': 'off',
    eqeqeq: ['off'],
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'vue/html-self-closing': 'off',
    'no-dupe-keys': 2
  }
}
