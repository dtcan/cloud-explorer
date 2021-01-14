const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	mode: "production",
    entry: {
        index: "./src/index.js",
        login: "./src/login.js",
        dir: "./src/dir.js"
    },
	output: {
		filename: "[name].[contentHash].js",
		path: path.resolve(__dirname, "dist")
	},
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: "./src/login.html",
            filename: "./login.html",
            chunks: ['login']
        }),
        new HtmlWebpackPlugin({
            template: "./src/dir.html",
            filename: "./dir.html",
            chunks: ['dir']
        }),
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
		new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
				test: /\.(js)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader'
				}
			},
            {
               test: /\.(scss)$/,
               use: [
                   {
                       loader: MiniCssExtractPlugin.loader
                   },
                   {
                       loader: 'css-loader'
                   },
                   {
                       loader: 'postcss-loader',
                       options: {
                           plugins: function() {
                               return [require('autoprefixer')];
                           }
                       }
                   },
                   {
                       loader: 'sass-loader'
                   }
               ]
           }
        ]
    }
}