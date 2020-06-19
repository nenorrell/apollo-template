const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const PATHS = {
  bundlePath:  `./app.ts`,
  build: '/build',
  bundlePath:  path.resolve(__dirname, `./app.ts`)
}

module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },

    entry: PATHS.bundlePath,
    mode: nodeEnv,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    // externals: [
    //     'dtrace-provider',
    //     'fs',
    //     'mv',
    //     'os',
    //     'source-map-support',
    // ],
    watch: nodeEnv === 'development',
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ['npm run start-dev']
        })
    ]
}