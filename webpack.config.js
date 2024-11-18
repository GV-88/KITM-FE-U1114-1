const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

//TODO: try using postcss-urlrebase to fix relative URL for npm font libraries (or output.publicPath?)

module.exports = (env) => ({
	entry: './src/app.js', //main js file
	output: {
		path: path.resolve(__dirname, 'public'), //location for file generation
		filename: 'app.js',
		// assetModuleFilename: 'assets/[name][ext][query]',
		// assetModuleFilename: (pathData) => { return 'assets/[name][ext][query]'; },
		clean: true, //clean after new generation
	},
	module: {
		rules: [
			{
				//transpile js code
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'], //GV: no idea what this does...
					},
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
				generator: { filename: 'assets/fonts/[base]' },
			},
			{
				test: /\.s?css$/, //compile scss to css
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', //src html file
			filename: 'index.html', //public html file name
		}),
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
		new ESLintPlugin({
			// https://eslint.org/docs/latest/integrate/nodejs-api#-new-eslintoptions
			configType: 'flat',
			// overrideConfigFile: '.eslint.config.js',
		}),
		new Dotenv({
			path: `./.env.${env}`
		}),
	],
	devServer: {
		static: './public', //main dir for serving
		port: 3000, //web server port
		open: true, //start browsser auto
	},
});
