const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
			// {
			// 	test: /\.(svg|png)$/,
			// 	type: 'asset/resource',
			// 	generator: { filename: 'assets/[base]' },
			// },
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
		new CopyPlugin({
			patterns: [
				{
					from: '**/*',
					context: path.resolve(__dirname, 'src', 'assets'),
					to: path.resolve(__dirname, 'public', 'assets', '[file]')
				},
				{
					from: 'working/response_sample*.json',
					to: path.resolve(__dirname, 'public', 'test_data', '[base]')
				},
			].slice(0, env.development ? 2 : -1) //better practice would be to have separate config file for dev
		}),
		new ESLintPlugin({
		// https://eslint.org/docs/latest/integrate/nodejs-api#-new-eslintoptions
			configType: 'flat',
		// overrideConfigFile: '.eslint.config.js',
		}),
		new Dotenv({
			path: `./.env.${env.development ? 'development' : 'production'}`
		}),
	],
	devServer: {
		static: './public', //main dir for serving
		port: 3000, //web server port
		open: true, //start browsser auto
	},
});
