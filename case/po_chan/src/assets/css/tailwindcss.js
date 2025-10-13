const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities, theme }) {
  const spacing = theme('spacing')
  addUtilities(
    Object.keys(spacing).map(key => {
      return {
        ['.h-full-' + key]: {
          'height': `calc(100% - ${spacing[key]})`,
        },
      }
    })
  )
  addUtilities(
    Object.keys(spacing).map(key => {
      return {
        ['.w-full-' + key]: {
          'width': `calc(100% - ${spacing[key]})`,
        },
      }
    })
  )
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  addUtilities(
    rows.map(row => {
      return cols.map(col => ({
        ['.grid-' + row + '-' + col]: {
          'grid-template': `repeat(${row}, 1fr)/repeat(${col}, 1fr)`,
        },
      }))
    })
  )
  addUtilities(
    cols.map(col => ({
      ['.grid-cols-auto-' + col]: {
        'grid-template-columns': `repeat(auto-fill, minmax(${col * 4}px, auto))`,
      },
    }))
  )
})
