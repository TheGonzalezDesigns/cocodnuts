/*global require __dirname module*/
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const poststylus = require('poststylus')
const WebpackMonitor = require('webpack-monitor')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-extended-webpack')
const freindlyFormatter = require('eslint-friendly-formatter')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PATHS = {
	src: path.join(__dirname, '/src'),
	dist: path.join(__dirname, '/public'),
}
const FILES = {
	entry: path.join(PATHS.src, '/scripts/index.js'),
	template: path.join(PATHS.src, '/pug/index.pug'),
	html: path.join(PATHS.dist, '/index.html'),
}

module.exports = {
	entry: {
		main: FILES.entry
	},
	output: {
		path: PATHS.dist,
		filename: 'index.js',
	},
	module: {
		rules: [
			{
				test: /\.styl$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'stylus-loader']
				}),
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules|webpack.js/,
				options: {
					presets: ['babel-preset-env']
				}
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules|webpack.js/,
				options: {
					fix: true,
					formatter: freindlyFormatter,
				}
			},
			{
				test: /.pug$/,
				use: 'pug-loader'
			},
			{
				test: /\.(ttf)$/i,
				use: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: [
					'responsive-loader',
					'file-loader?name=graphics/[name].[ext]',
					'img-loader'
				],
			},
			{
				test: /\.(svg)$/i,
				use: [
					'file-loader?name=graphics/[name].[ext]'
				],
			}
		],
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					use: [poststylus(['autoprefixer', 'rucksack-css'])],
				},
				img: {
					enabled: process.env.NODE_ENV === 'production',
          gifsicle: {
            interlaced: false
          },
          mozjpeg: {
            progressive: true,
            arithmetic: false
          },
          optipng: false, // disabled
          pngquant: {
            floyd: 0.5,
            speed: 2
          },
          svgo: {
            plugins: [
              { removeTitle: true },
              { convertPathData: false }
            ]
          }
				}
			},
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin('index.css'),
		new HtmlWebpackPlugin({
			inject: true,
			template: '!!pug-loader!src/pug/index.pug',
			mobile: true,
			minify: {
				collapseWhitespace: true,
			},
			hash: true,
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new PurifyCSSPlugin({
      paths: glob.sync(FILES.template),
			minimize: false,
			purifyOptions: {
				minify: false
			}
    }),
		new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: false
    }),
		new WebpackMonitor({
	    capture: true, // -> default 'true'
	    target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
	    launch: true, // -> default 'false'
	    port: 3030, // default -> 8081
	    excludeSourceMaps: true // default 'true'
	  })
	],
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
			normalize: 'normalize/index.styl',
			emailValidation: 'sane-email-validation/index.js'
		}
	}
}
