import axios from 'axios';
import qs from 'qs';
import {CookieUtil} from './utils';

export default function request(url, options = {}) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const isJson = options.contentType === 'application/json';
    let ajaxOption = {
        url,
        method: options.method || 'GET', // 默认 get
        baseURL: window.__API || ``, // baseURL 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        headers: {
            'Content-Type': options.contentType || 'application/json'
        },
        data: isJson ? JSON.stringify(options.data || {}) : qs.stringify(options.data || {}), // 'PUT', 'POST', 和 'PATCH'时body的参数
        timeout: options.timeout || 30000, // 超时时间 30 秒
        responseType: options.responseType || 'json', // 表示服务器响应的数据类型
        cancelToken: source.token
    };

    return new Promise((resolve, reject) => {
        axios(ajaxOption)
            .then(({data = {}, status}) => { // data就是后端接口返回的整体
                if(status === 200) {
                    const {status: responseStatus, message} = data;

                    if(responseStatus === 400) { // 未登录
                        if(location.pathname === '/login') {
                            return resolve(null);
                        }
                        window.location.href = `/login?redirect=${encodeURIComponent(location.href)}`;
                    }else{
                        return resolve(data);
                    }
                }else{
                    source.cancel(`响应错误`);
                    console.warn(`响应码: `, status);
                    return resolve(null);
                }
            })
            .catch(error => {
                source.cancel(`请求错误`);
                console.error(error.message);
                resolve(null);
            });
    });
}
