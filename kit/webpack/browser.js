/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
// @ts-nocheck

// Browser webpack config.  This will provide the foundation settings for
// configuring our source code to work in any modern browser

// ----------------------
// IMPORTS

// Node's built-in `path` module.  We'll use this to determine the entry
// `browser.js` entry point
import path from 'path';

// Webpack 2 is our bundler of choice.
import webpack from 'webpack';

// We'll use `webpack-config` to extend the base config we've already created
import WebpackConfig from 'webpack-config';

// CheckerPlugin: Plugin that forks TypeScript's checker to a separate process
// TsConfigPathsPlugin: Plugin that allows use of `paths` and `baseUrl`
import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';

// other plug-ins
// import CopyWebpackPlugin from 'copy-webpack-plugin';

// Our local path configuration, so webpack knows where everything is/goes
import PATHS from '../../config/paths';

// ----------------------

// Extend the 'base' config
export default new WebpackConfig().extend('[root]/base.js').merge({

  // This is where webpack will start crunching our source code
  entry: {
    // Client specific source code.  This is the stuff we write.
    browser: [
      // Entry point for the browser
      path.join(PATHS.entry, 'browser.tsx'),
    ],
  },

  // Set-up some common mocks/polyfills for features available in node, so
  // the browser doesn't balk when it sees this stuff
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Modules specific to our browser bundle
  module: {
    loaders: [
      // .(j|t)s(x) loading
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules|dist/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              useCache: true,
              cacheDirectory: '.awcache-browser',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // Separate our third-party/vendor modules into a separate chunk, so that
    // we can load them independently of our app-specific code changes
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
         // this assumes your vendor imports exist in the node_modules directory
         module.context && module.context.indexOf('node_modules') !== -1
      ),
    }),

    // Create a `SERVER` constant that's false in the browser-- we'll use this to
    // determine whether we're running on a Node server and set this to true
    // in the server.js config
    new webpack.DefinePlugin({
      SERVER: false,
    }),

    // Fork TypeScript checker to a separate process
    new CheckerPlugin(),

    // Allow use of `paths` and `baseUrl`
    new TsConfigPathsPlugin(),
  ],
});
