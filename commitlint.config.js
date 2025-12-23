module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'data',
        'prompt',
        'ui',
        'chore',
        'docs'
      ]
    ]
  }
};
