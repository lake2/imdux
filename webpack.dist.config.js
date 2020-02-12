const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
    mode: "production",
    devtool: 'hidden-source-map',
    entry: path.resolve(__dirname, "./src/index.ts"),
    output: {
        filename: "imdux.js",
        path: path.resolve(__dirname, `./dist/`),
        library: "imdux",
        libraryTarget: 'commonjs2',
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
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: 'report.html',
            defaultSizes: "stat",
            generateStatsFile: true,
            statsFilename: 'report.json'
        }),
    ],
    resolve: {
        extensions: [".js", ".ts"],
    },
    externals: {
        'immer': 'commonjs immer',
        'redux': 'commonjs redux',
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};
