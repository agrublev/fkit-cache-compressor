var path = require("path");
var webpack = require("webpack");
module.exports = {
  entry: "./src/fkcompressor.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: 'fkCompressor',
    libraryTarget: 'umd'
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: "last 2 versions"
                }
              }
            ]
          ],
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                legacy: true
              }
            ],
            ["@babel/plugin-syntax-class-properties"],
            ["@babel/plugin-syntax-dynamic-import"],
            [
              "@babel/plugin-proposal-class-properties",
              {
                loose: true
              }
            ]
          ]
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: false
};
