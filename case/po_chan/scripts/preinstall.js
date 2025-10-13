/* eslint-disable no-undef */
// In NPM v7 the preinstall script runs after dependencies are installed
// https://github.com/npm/cli/issues/2660
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    '\u001b[33m此项目使用pnpm进行安装包管理，请改用pnpm下载安装包。\u001b[39m\n'
  )
  process.exit(1)
}
