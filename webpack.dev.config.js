const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "eval-cheap-source-map",
    entry: path.resolve(__dirname, "./src/index.ts"),
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, './dev/'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: ["babel-loader"],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './dev/index.html' }),
    ],
    resolve: {
        extensions: [".js", ".ts"],
    },
    devServer: {
        contentBase: "./dev/",
        host: "0.0.0.0",
        port: "9000",
    }
};
