const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './script/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext][query]' // atur output gambar
        }
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'assets', 
          to: 'assets',
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './pages/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/register/register.html',
      filename: '/pages/register.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/login/login.html',
      filename: '/pages/login.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/home/homepage.html',
      filename: '/pages/home.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/journaling/journaling.html',
      filename: '/pages/journaling.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/statistic/statistic.html',
      filename: '/pages/statistic.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/history/history.html',
      filename: '/pages/history.html'
    }),
    new HtmlWebpackPlugin({
      template: './pages/profile/profile.html',
      filename: '/pages/profile.html'
    })
  ]
};
