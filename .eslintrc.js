module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: ['airbnb-base'],
  rules: {
    'func-names': 0,
    'import/prefer-default-export': 0,
  }
};
