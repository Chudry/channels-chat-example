const path                 = require('path')
const glob                 = require('glob')
const globImporter         = require('node-sass-glob-importer')
const webpack              = require('webpack')
const cssnano              = require('cssnano')
const autoprefixer         = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BrowserSyncPlugin    = require('browser-sync-webpack-plugin')

module.exports = {
  cache: (process.env.npm_lifecycle_event !== 'build'),
  watchOptions: {
    ignored: ['/vendor/', '/node_modules/'],
  },
  devtool: (process.env.npm_lifecycle_event === 'build')
    ? 'source-map'
    : 'inline-source-map',
  performance: { hints: false },
  entry: {
    bundle: [
      './src/index.scss',
      './src/index.js',
      ...glob.sync('./src/bases/**/*.js',       { ignored: './**/_*.js' }),
      ...glob.sync('./src/components/**/*.js',  { ignored: './**/_*.js' }),
      ...glob.sync('./src/middlewares/**/*.js', { ignored: './**/_*.js' }),
      ...glob.sync('./src/modules/**/*.js',     { ignored: './**/_*.js' }),
    ],
  },
  output: {
    path: path.join(__dirname, 'static/js'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      bases:       path.resolve(__dirname, 'src/bases'),
      components:  path.resolve(__dirname, 'src/components'),
      middlewares: path.resolve(__dirname, 'src/middlewares'),
      modules:     path.resolve(__dirname, 'src/modules'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.css', '.scss'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              // url: false,  // Deny fetching resource by url().
              importLoaders: 2,  // For PostCSS + Sass.
              sourceMap: (process.env.npm_lifecycle_event === 'build'),
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ].concat(
                (process.env.npm_lifecycle_event === 'build')
                  ? [cssnano({ autoprefixer: false })]
                  : []
              ),
              sourceMap: (process.env.npm_lifecycle_event === 'build'),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              importer: globImporter(),
              sourceMap: (process.env.npm_lifecycle_event === 'build'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: 'url-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'url-loader',
      },
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 2, modules: false }],
              ['@babel/preset-react'],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
    new webpack.ProvidePlugin({
      moment: 'moment',
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, './node_modules'),
    ]),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      open: false,
      cors: true,
      // Edit local server config, or proxy.
      proxy: {
        target: 'https://192.168.99.100',
        cookies: { stripeDomain: false },
        ws: true,
      },
      // server: {
      //   baseDir: 'static',
      //   index: 'index.html',
      // },
      watchOptions: {
        awaitWriteFinish : true,
      },
      files: [  // edit
        'djangdock/**/*.py',
        'djangdock/**/*.html',
        'chat/**/*.py',
        'chat/**/*.html',
        'src/**/*.js',
        'static/css/*.css',
      ],
    },
    {
      injectCss: true,
      reload: false,
    }),
  ],
}
