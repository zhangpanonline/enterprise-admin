module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ✅ 提交类型限制（支持 emoji 名称前缀的类型）
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'ui' // 你自定义的
      ]
    ],

    // ✅ 限制 subject 长度（标题）
    'subject-max-length': [1, 'always', 50],

    // ✅ 关闭/放宽 body 和 footer 的行长限制
    'body-max-line-length': [1, 'always', 120],
    'footer-max-line-length': [1, 'always', 120],

    // ✅ 强制 footer 前要空一行（用于 BREAKING CHANGE）
    'footer-leading-blank': [1, 'always'],

    // ✅ 允许中文/emoji，不强制使用英文句式
    'subject-case': [0]
  }
}
