const { merge } = require('webpack-merge');  // Pastikan ini menggunakan destrukturisasi
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',  // Untuk debugging di production
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]  // Minifikasi JavaScript di production
  }
});