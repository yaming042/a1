const webpack = require('webpack');
const config = require('./config/config.json');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        admin: [path.resolve(__dirname, './src/admin/app/index.js')],
        // portal: [path.resolve(__dirname, './src/portal/app/index.js')],
        // home: [path.resolve(__dirname, './src/home/app/index.js')],
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: '[name]_[fullhash].js',
        publicPath: '/' // 就是在index_bundle.js前面添加个路径
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass', '.less', '*'],
        // 配置别名
        alias: {
            '@commonUtils': path.join(__dirname, './src/commonUtils')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            compact: false // 防止编译时报 it exceeds the max of 500KB 类似的警告
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            },
                            url: true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    /*
                                        修改antd默认样式变量值，所有变量见文档
                                        https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                                    */
                                    'layout-header-background': '#f0f2f5',
                                    'layout-body-background': '#fff',
                                    'menu-bg': '#f0f2f5',
                                    'layout-header-padding': '0 24px',
                                    'text-color': '#666',
                                    'font-size-base': '12px'
                                },
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                type: 'asset', // url-loader在webpack5中已经启用，可以用webpack自带的asset-module模块来处理
                parser: {
                    // 转base64的条件
                    dataUrlCondition: {
                        maxSize: 25 * 1024, // 25kb
                    }
                },
                generator: {
                    // 打包到 image 文件下
                    filename: 'public/asset/[contenthash][ext][query]',
                }
            }
        ]
    },
    performance: {
        hints: false
    },
    devServer: {
        historyApiFallback: {
            disableDotRule: false
        },
        static: [
            {
                directory: path.join(__dirname, './public/js'),
                publicPath: '/js'
            },
            {
                directory: path.join(__dirname, './public/images'),
                publicPath: '/images'
            },
            {
                directory: path.join(__dirname, './public/stylesheets'),
                publicPath: '/css'
            },
            {
                directory: path.join(__dirname, './public/dist'),
                publicPath: '/'
            }
        ],
        compress: false,
        port: 5656,
        proxy: {
            '/api': {
                changeOrigin: true,
                // target: 'http://localhost:3000'
                target: config.apiProxy || ''
            },
            '/**': {
                target: '/admin.html', //default target
                secure: false,
                bypass: function (req, res, opt) {
                    if (req.path.indexOf('/image/') !== -1 || req.path.indexOf('/css/') !== -1 || req.path.indexOf('/js/') !== -1) {
                        return req.path;
                    }

                    return '/admin.html';
                }
            }
        },
        client: {
            logging: 'none'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Admin',
            filename: 'admin.html',
            template: path.resolve(__dirname, './views/admin.html'),
            inject: 'body',
            hash: true,
            cache: false,
            chunks: ['admin'],
            apiPrefix: config.apiPrefix || ''
        }),
        new HtmlWebpackPlugin({
            title: 'Portal',
            filename: 'portal.html',
            template: path.resolve(__dirname, './views/portal.html'),
            inject: 'body',
            hash: true,
            cache: false,
            chunks: ['portal'],
            apiPrefix: config.apiPrefix || ''
        }),
        new HtmlWebpackPlugin({
            title: 'Home',
            filename: 'home.html',
            template: path.resolve(__dirname, './views/home.html'),
            inject: 'body',
            hash: true,
            cache: false,
            chunks: ['home'],
            apiPrefix: config.apiPrefix || ''
        }),
    ]
};
