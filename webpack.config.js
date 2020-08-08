const path = require("path");

module.exports = {
    entry: {
        "index": "./lib/esm/index.js",
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "[name].js",
        libraryTarget: "global",
        library: "Porpoise",
        umdNamedDefine: true,
    },
    resolve: {
        extensions: [".js"],
    },
    devtool: "source-map"
};