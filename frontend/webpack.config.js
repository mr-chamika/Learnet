const HtmlWebpackPlugin = require("html-webpack-plugin")
const CSSInjectPlugin = require('./react_lite/cssInjectPlugin');
const path = require("path")

module.exports = {
    entry: "./src/index.jsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        clean: true,
        assetModuleFilename: "[name][ext]"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: path.resolve(__dirname, "./react_lite_obf/cssExtractLoader.js")
                    // },
                    {
                        loader: path.resolve(__dirname, "./react_lite/transpile.js")
                    }
                ]
            },
            {
                test: /\.css?$/,
                use: [
                    {
                        loader: path.resolve(__dirname, "./react_lite/cssLoader.js")
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)/i,
                type: "asset/resource",
                generator: {
                    outputPath: "assets/",
                    publicPath: "/assets/"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                //   filename: 'fonts/[name][ext][query]', // Customize the output folder for fonts
                    outputPath: "assets/fonts",
                    publicPath: "/assets/fonts/"
                },
            },

        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".css"]
    },
    mode: "production",
    optimization: {
        minimize: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Webpack Example App',
            header: 'Webpack Example Title',
            metaDesc: 'Webpack Example Description',
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new CSSInjectPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        // proxy: [
        //     {
        //         context: ["/"],
        //         target: "http://localhost:8080/",
        //         changeOrigin: true
        //     }
        // ],
        port: 3001,
        // watchContentBase: true,
        hot: false,
        liveReload: true,
        client: {
            logging: "info",
            webSocketTransport: "ws",
            reconnect: 50,
        },
        open: true,
        webSocketServer: "ws",
        historyApiFallback: true // always return the index.html file for every route
        // historyApiFallback: {
        //     rewrites: [
        //         {from: /./, to: "/index.html"}
        //     ]
        // }
    },
    target: "web",
    performance: {
        maxEntrypointSize: 4096000,
        maxAssetSize: 20490000
    }
}

// ws or sockjs