/*global require __dirname module*/
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const poststylus = require('poststylus')
const webpack = require('webpack')
const path = require('path')

const PATHS = {
	src: path.join(__dirname, '/src'),
	dist: path.join(__dirname, '/public'),
}
const FILES = {
	entry: path.join(PATHS.src, '/scripts/index.js'),
	template: path.join(PATHS.src, '/pug/index.pug'),
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
					fix: true
				}
			},
			{
				test: /.pug$/,
				use: 'pug-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?name=graphics/[hash:6].[name].[ext]',
					'image-webpack-loader'
				],
			}
		],
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					use: [poststylus(['autoprefixer', 'rucksack-css'])],
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
		})
	],
	devServer: {
		contentBase: PATHS.dist,
		compress: true,
		port: 3001,
		//stats: 'minimal',
		open: true,
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
			normalize: 'normalize/index.styl'
		}
	},
}
