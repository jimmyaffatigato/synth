const path = require("path");

module.exports = {
    entry: "./src/main.tsx",
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css"],
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader?modules=true"],
            },
        ],
    },
};
