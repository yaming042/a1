import axios from 'axios';
import qs from 'qs';

export default function request(url, options = {}) {
    // contentType 默认值: application/json
    // application/x-www-form-urlencoded
    const needUrlEncoded = options.contentType === 'application/x-www-form-urlencoded';
    let ajaxOption = {
        url,
        method: options.method || 'GET', // 默认 get
        baseURL: window.__API || ``, // baseURL 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        headers: {
            'Content-Type': options.contentType || 'application/json'
        },
        data: needUrlEncoded ? qs.stringify(options.data || {}) : JSON.stringify(options.data || {}),
        timeout: options.timeout || 30000, // 超时时间 30 秒
        responseType: options.responseType || 'json', // 表示服务器响应的数据类型
    };

    return new Promise((resolve, reject) => {
        axios(ajaxOption)
            .then(({data, status}) => { // data就是后端接口返回的整体
                if(200 === status) {
                    const {status} = data || {};
                    if(400 === status) {
                        // 未登录
                        // window.location.href = `/login?redirect=${encodeURIComponent(location.href)}`;
                        window.location.href = `/login`;
                        return;
                    }
                    resolve(data || {});
                }else{
                    // 非200响应码，说明不是前端想要的返回，请求出现了问题
                    reject(`响应异常(response code: ${status})`);
                }
            })
            .catch(error => {
                console.error(error.message);
                reject(error.message || `请求异常`);
            });
    });
}
