// url类方法
const Url = () => {
    // 获取URL中指定的参数
    const getQueryString = name => {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    };

    return {
        getQueryString
    };
};
// cookie类方法
const Cookie = () => {
    const getCookie = name => {
        const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
        const arr = document.cookie.match(reg);
        return arr ? unescape(arr[2]) : null;
    };
    const setCookie = (name, value, seconds='') => {
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + (seconds === '' ? Days * 24 * 60 * 60 : seconds) * 1000);
        window.document.cookie = `${name}=${escape(value)};path=/;expires=${exp.toGMTString()}`;
    };
    const delCookie = name => {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = getCookie(name);
        if (cval != null) {
            document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
        }
    };
    const clearCookie = () => {
        let keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
            const len = keys.length;
            for (let i = 0; i < len; i += 1) {
                document.cookie = `${keys[i]}=0;path=/;expires=${new Date(
                    0
                ).toUTCString()}`;
            }
        }

        // -f
        document.cookie = `session=0;path=/;expires=${new Date(
            0
        ).toUTCString()}`;
    };

    return {
        getCookie,
        setCookie,
        delCookie,
        clearCookie
    };
};
// object类方法
const Obj = () => {
    // 对象的深度拷贝
    const deepClone = (obj) => {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
            return obj;
        }
        let temp;
        if (obj instanceof Date) {
            temp = new obj.constructor();
        } else {
            temp = obj.constructor();
        }
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj.isActiveClone = null;
                temp[key] = deepClone(obj[key]);
                delete obj.isActiveClone;
            }
        }
        return temp;
    };

    return {
        deepClone
    };
};
// string类方法
const string = () => {
    // 连字符转驼峰
    const hyphenToHump = (str) => {
        return str.replace(/-(\w)/g, function () {
            return arguments[1].toUpperCase();
        });
    };
    // 驼峰转连字符
    const humpToHyphen = (str) => {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    };
    // hash
    const hashCode = (str='') => {
        let hash = 0;
        if (str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                hash = 31 * hash + str.charCodeAt(i);
                hash |= 0;
            }
        }
        return hash & 0x7fffffff;
    };

    return {
        hyphenToHump,
        humpToHyphen,
        hashCode
    };
};

export const UrlUtil = Url();
export const CookieUtil = Cookie();
export const ObjectUtil = Obj();
export const StringUtil = string();
