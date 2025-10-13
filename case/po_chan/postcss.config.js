module.exports = {
  plugins: {
    // 如果遇到 using @layer without the corresponding @tailwind directive. 错误，参考以下链接解决
    // https://tailwindcss.com/docs/adding-custom-styles#using-multiple-css-files
    // 'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
