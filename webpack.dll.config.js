const path = require("path");
const webpack = require("webpack");

module.exports =
{
    mode: "development",
    entry:
    {
        core:
        [
            "uxmid-core"
        ],
        vendor:
        [
            "axios",
            "dayjs",
        ],
        style:
        [
            "view-design"
        ],
        vue:
        [
            "vue",
            "vue-class-component",
            "vue-property-decorator",
            "vue-router"
        ]
    },
    output:
    {
        path: path.resolve(__dirname, "./public/static/vendor"),
        filename: "[name].dll.js",
        library: "[name]_dll",
        clean:
        {
            keep: /\.json$/
        }
    },
    plugins:
    [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, "./public/static/vendor/[name]-manifest.json"),
            name: "[name]_dll",
            // format: true,
            // context: process.cwd()
        })
    ]
};
