const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const PATHS = {
  bundlePath:  `./app.ts`,
  build: '/build',
  bundlePath:  path.resolve(__dirname, `./app.ts`)
}

let launchCallback;

if(nodeEnv == "development"){
    launchCallback = [
        new WebpackShellPlugin({
            onBuildEnd: ['npm run start-dev']
        })
    ]
}
else{
    launchCallback = [
        new WebpackShellPlugin({
            onBuildEnd: ['npm run tests']
        })
    ]
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
    stats: {
        warningsFilter: w => w !== 'CriticalDependenciesWarning',
    },
    entry: PATHS.bundlePath,
    mode: nodeEnv === "production" ? nodeEnv : "development",
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    externals: [
        'dtrace-provider',
    ],
    watch: nodeEnv === 'development',
    plugins: launchCallback
}