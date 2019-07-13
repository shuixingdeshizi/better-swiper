const path = require('path')

export default {
  input: path.resolve(__dirname, '../', 'src/index.js'),
  output: {
    file: 'dist/better-swiper.js',
    name: 'BetterSwiper',
    format: 'umd'
  },
  watch: {}
}