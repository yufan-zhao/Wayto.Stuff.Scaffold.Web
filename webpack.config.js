const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    module:
    {
        rules:
        [
            {
                text: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins:
    [
        new HtmlWebpackPlugin({
            title: process.env.npm_package_name,
            template: "./public/index.html"
        })
    ]
};
