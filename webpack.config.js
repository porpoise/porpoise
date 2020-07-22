const { CheckerPlugin } = require("awesome-typescript-loader");
const path = require("path");


module.exports = {
    entry: {
        "index": "./src/index.ts",
        "index.min": "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "[name].js",
        libraryTarget: "global",
        library: "WebElement",
        umdNamedDefine: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader"
        }]
    },
    plugins: [
        new CheckerPlugin()
    ]
};