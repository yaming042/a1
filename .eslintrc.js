module.exports = {
    'extends': ['eslint:recommended'],
    'plugins': ['react-hooks', 'eslint-plugin-react'], //定义了该eslint文件所依赖的插件
    'parser': '@babel/eslint-parser',
    'parserOptions': {
        //指定ESLint可以解析JSX语法
        'ecmaVersion': 2019,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'env': {
        'es6': true,
        'browser': true, // 浏览器可以用window
        'node': true, // 可用global
        'commonjs': true,
        'amd': true,
        'worker': true,
        'jquery': true
    },
    'rules': {
        'indent': ['error', 4, {
            'SwitchCase': 2
        }],
        'semi': ['error', 'always'],
        'prefer-reflect': 'off',
        'generator-star-spacing': 0,
        'no-extend-native': 0,
        'space-before-function-paren': 0,
        'object-curly-spacing': 1,
        'comma-dangle': 0,
        'no-unused-expressions': 0,
        'no-var': 1,
        'no-unused-vars': 0,
        'no-prototype-builtins': 0,
        'strict': 1
    },
    'settings': {
        'react': {
            'version': '18' // React version, default to the latest React stable release
        }
    },
    'globals': {
        'Map': true,
        'Set': true,
        'Promise': true,
        '$': true
    }
};