const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/js/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        port: process.env.PORT || 5000,
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // it looks for all the files that end with js
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};