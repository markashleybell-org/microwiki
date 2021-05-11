const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    output: {
        filename: '[name].js',
        path: __dirname + '/wwwroot/js/dist',
        library: 'MicroWiki'
    },
    entry: {
        // 'edit': './wwwroot/js/edit.ts',
        'read': './wwwroot/js/read.ts',
        // 'tagmanager': './wwwroot/js/tagmanager.ts',
        // 'upload': './wwwroot/js/upload.ts'
    },
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, exclude: /node_modules/, loader: 'ts-loader' },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
        ]
    }
};
