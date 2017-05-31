/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
// @ts-nocheck

// ----------------------
// IMPORTS

/* NPM */
import webpack from 'webpack';
import WebpackConfig from 'webpack-config';

// Plugin to allow us to exclude `node_modules` packages from the final
// bundle.  Since we'll be running `server.js` from Node, we'll have access
// to those modules locally and they don't need to wind up in the bundle file
import nodeModules from 'webpack-node-externals';

// Plugin that forks TypeScript's checker to a separate process
import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';

/* Local */
import { css } from './common';

// ----------------------

// Helper function to recursively filter through loaders, and apply the
// supplied function
function recursiveLoader(root = {}, func) {
  if (root.loaders) {
    root.loaders.forEach(l => recursiveLoader(l, func));
  }
  if (root.loader) return func(root);
  return false;
}

export default new WebpackConfig().extend({
  '[root]/base.js': conf => {
    // Prevent file emission, since the browser bundle will already have done it
    conf.module.loaders.forEach(loader => {
      recursiveLoader(loader, l => {
        if (l.loader === 'file-loader') {
          // eslint-disable-next-line
          l.query.emitFile = false;
        }
      });
    });
    return conf;
  },
}).merge({

  // Set the target to Node.js, since we'll be running the bundle on the server
  target: 'node',

  node: {
    __dirname: false,
  },

  module: {
    loaders: [
      // CSS loaders
      ...(function* loadCss() {
        for (const loader of css.loaders) {
          // Iterate over CSS/SASS/LESS and yield local and global mod configs
          for (const mod of css.getModuleRegExp(loader.ext)) {
            yield {
              test: new RegExp(mod[0]),
              loader: [
                {
                  loader: 'css-loader/locals',
                  query: Object.assign({}, css.loaderDefaults, mod[1]),
                },
                'postcss-loader',
                ...loader.use,
              ],
            };
          }
        }
      }()),
      // .(j|t)s(x) files can extend the `.babelrc` file at the root of the project
      // (which was used to spawn Webpack in the first place), because that's
      // exactly the same polyfill config we'll want to use for this bundle
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'react',
              ],
              plugins: [
                'syntax-dynamic-import',
              ],
            },
          },
          {
            loader: 'awesome-typescript-loader',
            query: {
              useCache: true,
              cacheDirectory: '.awcache-server',
            },
          }
        ]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // We're running on the Node.js server, so set `SERVER` to true
      SERVER: true,
    }),

    // Fork TypeScript checker to a separate process
    new CheckerPlugin(),

    // Allow use of `paths` and `baseUrl`
    new TsConfigPathsPlugin(),
  ],
  // No need to transpile `node_modules` files, since they'll obviously
  // still be available to Node.js when we run the resulting `server.js` entry
  externals: nodeModules(),
});
