var webpack = require("webpack");
var path = require("path");
//https://github.com/StephenGrider/ReduxSimpleStarter/blob/master/index.html
var BUILD_DIR = path.resolve(__dirname, "public");
var APP_DIR = path.resolve(__dirname, "src");
const embedFileSize = 65536;

/****************** PLUGINS *******************************/
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

// sw-precache-webpack-plugin configurations
const SERVICE_WORKER_FILENAME = "sw.js";
const SERVICE_WORKER_CACHEID = "comincs-inc";
const SERVICE_WORKER_IGNORE_PATTERNS = [/public\/.*/];

// const extractLess = new ExtractTextPlugin("[name].[contenthash].css");

var config = {
    entry: {
        "app": APP_DIR + "/index.js",
        "vendor": [
            path.resolve(__dirname, "node_modules/jquery/dist/jquery.min.js"),
            path.resolve(__dirname, "node_modules/materialize-css/dist/js/materialize.min.js"),
        ]
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].[chunkhash:8].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "indexTemplate.html"),
            hash: false,
            chunks: ["common", "vendor", "app"]
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common-[hash:8].js",
            chunks: ["vendor","app"]
        }),
        new SWPrecacheWebpackPlugin({
            cacheId: SERVICE_WORKER_CACHEID,
            filename: SERVICE_WORKER_FILENAME,
            staticFileGlobsIgnorePatterns: SERVICE_WORKER_IGNORE_PATTERNS,
            minify: false,
            stripPrefix: "C:/devhome/reactjs/comics-inc/public",
            stripPrefixMulti: ["C:/devhome/reactjs/comics-inc/public"],
            runtimeCaching: [
                {
                    handler: "cacheFirst",
                    urlPattern: /marvel\/i\/mg\/.*/
                },
                {
                    handler: "cacheFirst",
                    urlPattern: /^https:\/\/fonts.googleapis.com\/.*/
                }
            ],
        }),
        new CleanWebpackPlugin(["public"], {
            verbose: true,
            exclude: ["manifest.json"],
            dry: false
        })
        ,
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css",
            allChunks: true
        })
    ],
    module: {
        rules: [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : "babel-loader"
            },
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader"]
            },
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {test: /\.svg$/, loader: "url-loader?limit=${embedFileSize}&mimetype=image/svg+xml?name=assets/images/[name].[ext]"},
            {test: /\.png$/, loader: "url-loader?limit=${embedFileSize}&mimetype=image/png?name=assets/images/[name].[ext]"},
            {test: /\.jpg$/, loader: "file-loader?name=assets/images/[name].[ext]"},
            {test: /\.jpeg$/, loader: "file-loader?name=assets/images/[name].[ext]"},
            {test: /\.gif$/, loader: "url-loader?limit=${embedFileSize}&mimetype=image/gif?name=assets/images/[name].[ext]"},
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"]
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader?name=assets/fonts/[name].[ext]"
            }
        ]
    },
    resolve: {
        extensions: ["json", ".js", ".jsx"],
        alias: {
            materialize: "node_modules/materialize-css/dist/js"
        }
    },
    devServer: {
        historyApiFallback: true,
        contentBase: "./"
    },
    devtool: "#source-map",
};

module.exports = config;
