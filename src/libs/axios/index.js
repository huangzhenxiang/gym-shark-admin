import $form from 'axios';
import qs from 'qs';
import router from '@/router';
import env from '../../../build/env';
import {Message} from 'iview';
import Cookies from 'js-cookie';

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:3030/'
    : env === 'production'
        ? '/'
        : '/';
// 表单格式提交
$form.defaults.timeout = 30000; // 响应时间
$form.defaults.responseType = 'json';
$form.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头
$form.defaults.baseURL = ajaxUrl + 'api/'; // 配置接口地址
$form.defaults.transformRequest = [function (params) {
    return qs.stringify(params);
}];

function interceptorsRequestSuccess (config) {
    let token = Cookies.get('token');
    config.headers.Authorization = token;
    return config;
}

function interceptorsRequestError (error) {
    return Promise.reject(error);
}

function interceptorsResponseSuccess (response) {
    return Promise.resolve(response.data);
}

function interceptorsResponseError (error) {
    let msg;
    if (error.response && error.response.status === 401) {
        router.push('/login');
        Message.error({
            content: '请重新登录'
        });
    } else {
        if (error.response && error.response.data && error.response.data.msg) {
            msg = error.response.data.msg;
        } else {
            msg = '请求失败';
        }
        Message.error({
            content: msg
        });
    }
    return Promise.reject((error.response && error.response.data) || msg);
}

$form.interceptors.request.use(interceptorsRequestSuccess, interceptorsRequestError);
$form.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError);

// json格式提交
let $json = $form.create({
    baseURL: ajaxUrl + 'api/', // 配置接口地址
    headers: {
        post: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    },
    transformRequest: [function (params) {
        return JSON.stringify(params);
    }]
});

$json.interceptors.request.use(interceptorsRequestSuccess, interceptorsRequestError);
$json.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError);

const axios = {};
axios.install = function (Vue, options = {}) {
    Vue.prototype.$http = $form;
    Vue.prototype.$json = $json;
    Vue.prototype.$baseUrl = ajaxUrl;
};

export default axios;
export {$form, $json};
