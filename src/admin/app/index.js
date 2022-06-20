import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './../store';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import App from './app';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider>,
    document.getElementById('root')
);