// webpack uses node.js to build applications
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// main configuration object. options within tell webpack what to do. (note: webpack v4, config file is not necessary. used for functional specificity reasons)
module.exports = {
  // basic config | entry, output, mode
  // - uses client `script.js` (relatively pathed) as the bundle entry point & beginning of the dependency graph.
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  // - outputs bundled entry point into the `dist` directory as `main.bundle.js`
  output: {
    path: path.resolve(__dirname, "dist"),
    // key name from each key-value pair object is used for [name]
    filename: "[name].bundle.js",
  },
  // - optimizes non-javascript files
  module: {
    rules: [
      {
        test: /\.jpg$/i, // identifies .jpg files via regex to pre-process
        use: [ 
          { // processes (emits) images
            loader: "file-loader",
            options: {  
              esModule: false, // prevents incorrect image path formatting
              name(file) { // formats file name
                return "[path][name].[ext]";
              },
              publicPath: function (url) { // changes assignment URL
                return url.replace("../", "/assets/");
              },
            },
          },
          { // optimizes images
            loader: "image-webpack-loader"
          }
        ],
      },
    ],
  },
  // - tells webpack which plugins to use
  plugins: [
    // jquery | makes exceptions to use its global variables (otherwise these variables wont work)
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    // analyzes bundle sizes to see how how much js is processed by browser
    new BundleAnalyzerPlugin({
      // reports outputs to `report.html` file in `dist`. can be set to `disable` to stop reporting & opening of this file
      analyzerMode: "static",
    }),
  ],
  // - specifies 'development' mode in which webpack runs (webpack runs on 'production' mode by default)
  mode: "development",
};
