const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    index: ["./src/index.ts"],
  },
  output: {
    filename: "interstellar-react-ui.js",
    path: path.join(__dirname, "dist/umd"),
    library: "Interstellar",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.build.json",
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    dayjs: "dayjs",
  },
};
