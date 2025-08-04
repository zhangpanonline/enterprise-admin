module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/zhangpanonline/enterprise-admin.git',
  plugins: [
    '@semantic-release/commit-analyzer',           // 分析提交类型（feat, fix 等）
    '@semantic-release/release-notes-generator',   // 生成发布信息
    '@semantic-release/changelog',                 // 写入 CHANGELOG.md
    '@semantic-release/git',                       // 提交 package.json + changelog
    '@semantic-release/github'                     // 创建 GitHub Release
  ]
}
