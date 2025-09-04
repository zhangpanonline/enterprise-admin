module.exports =  {
  types: [
    { value: 'feat',     name: 'feat:     ✨ 新功能' },
    { value: 'fix',      name: 'fix:      🐛 修复 bug' },
    { value: 'docs',     name: 'docs:     📝 文档变更' },
    { value: 'style',    name: 'style:    🎨 代码格式（不影响功能）' },
    { value: 'refactor', name: 'refactor: ♻️ 代码重构（无新增功能、无修复 bug）' },
    { value: 'perf',     name: 'perf:     ⚡ 性能优化' },
    { value: 'test',     name: 'test:     ✅ 添加测试' },
    { value: 'chore',    name: 'chore:    🔧 构建/工程配置变更' },
    { value: 'revert',   name: 'revert:   ⏪ 回退提交' },
    { value: 'ui',       name: 'ui:       💄 UI 样式调整（新增）' }, // 👈 自定义中文类型
  ],
  messages: {
    type: '选择你要提交的类型:',
    scope: '请输入修改范围（可选）:',
    customScope: '请输入自定义的 scope:',
    subject: '简要描述（建议不超过50字）:',
    body: '详细描述（可选）。使用 "|" 换行:',
    breaking: '列出任何 BREAKING CHANGES（可选）:',
    footer: '关联的 issue（如: #31, #34）（可选）:',
    confirmCommit: '确认提交？'
  },
  scopes: ["微前端", "浏览器插件", "系统管理", "工程配置", "文档变更", "功能实现"],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'], // allowBreakingChanges: ['feat', 'fix'] 的作用是控制哪些类型的提交可以填写破坏性变更说明（BREAKING CHANGE），从而支持语义化版本自动升级时正确地判定为 major version（主版本）更新。
  subjectLimit: 100
}
