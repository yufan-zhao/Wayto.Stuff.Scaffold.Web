const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports =
{
    mode: "development",
    entry: "./src/main.ts",
    devtool: "inline-source-map",
    devServer:
    {
        static: "./dist"
    },
    output:
    {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    module:
    {
        rules:
        [
            {
                test: /\.(tsx|ts)?$/,
                use:
                [
                    {
                        loader: "ts-loader",
                        options:
                        {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.vue?$/,
                use: ["vue-loader"]
            },
            {
                test: /\.less$/i,
                use:
                [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options:
                        {
                            lessOptions:
                            {
                                javascriptEnabled: true
                            }
                        }
                    },
                    {
                        loader: "style-resources-loader",
                        options:
                        {
                            patterns:
                            [
                                path.resolve(__dirname, "src/styles/application/variables.less")
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|cur)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            }
        ]
    },
    resolve:
    {
        extensions: [".tsx", ".ts", ".js"],
        alias:
        {
            "uxmid-vue-web": path.resolve(__dirname, "uxmid-vue-web/src"),
            "src": path.resolve(__dirname, "src")
        }
    },
    optimization:
    {
        runtimeChunk: "single",
        splitChunks:
        {
            cacheGroups:
            {
                vendor:
                {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins:
    [
        new HtmlWebpackPlugin({
            title: process.env.npm_package_name,
            template: "./public/index.html"
        }),
        new VueLoaderPlugin()
    ]
};
