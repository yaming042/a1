const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    entry: {
        index: [path.resolve(__dirname, './src/app/index.js')],
        login: [path.resolve(__dirname, './src/app/Login/index.js')],
        editor: [path.resolve(__dirname, './src/app/DecisionUnit/UnitEditor/oneEditor.js')],
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
    },
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: '[name]_[fullhash].js',
        publicPath: '/' // 就是在index_bundle.js前面添加个路径
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass', '.less', '*']
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
    plugins: [
        new BundleAnalyzerPlugin()
    ]
};
