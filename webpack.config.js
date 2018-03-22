const path = require('path');
const webpack = require('webpack');

const config = {
    resolve: {
        modules: [path.resolve('./front-end'), path.resolve('./node_modules')]
    },
    entry:{
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'prop-types',
            'axios',
            'babel-polyfill',
            'lodash.pickby'
        ],
        app: ['./front-end/app.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'front-end/webApp/build'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js|\.jsx$/,
            exclude: /node_modules/,
            use: {
                'loader': 'babel-loader',
                options: {
                    presets: ['react', 'env', 'stage-2']
                }
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader','css-loader' ]
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        })
    ]
};

module.exports = config;
