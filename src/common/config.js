import axios from 'axios';
import { Toast, Indicator } from 'mint-ui';
import Cookie from 'js-cookie';

const API = {
    //获取账户信息
    LOGIN: 'Interface/login',
    //注销登录
    LOGOUT: 'Interface/logout',
    //通过SN编号查询资产信息
    GET_ASSET_INFO_BY_SN: 'Interface/getAssetInfoBySn',
    //修改资产信息
    UPDATE_DEVICE_DETAIL: 'Interface/updataDeviceDetail',

    GET_ASSET_CHANGED_RECORD: 'Interface/getAssetChangedRecord'

    // //身份认证
    // IDENTITY_VERIFICATION: 'Interface/getOldPasswordTest',
};

const URLS = {
    BASE_URL: 'http://ddyb.api.51shoubei.com/api/',
    UPLOAD_IMG_URL: '../../images/',
};

function init() {

    axios.defaults.baseURL = URLS.BASE_URL;
    axios.defaults.withCredentials = false;
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    // 超时时间
    axios.defaults.timeout = 20000;

    // http请求拦截器
    // let loadinginstace = Loading.service({ fullscreen: true });
    // loadinginstace.close();
    axios.interceptors.request.use(config => {
        // if (token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        //     config.headers.Authorization = token;
        // }
        if (config.method === 'post' && config.url.indexOf('file/upload') === -1) {
            let token = Cookie.get('token');
            if (!!token) {
                config.data = Object.assign({}, config.data, {token: token});
            }
        }
        // loadinginstace = Loading.service({fullscreen: true});// element ui Loading方法
        Indicator.open('加载中...');
        return config;
    }, error => {
        // loadinginstace.close();
        Indicator.close();
        // Message.error({
        //     message: '加载超时',
        // });
        Toast({
            message: '加载超时',
            position: 'bottom',
            duration: '5000'
        });
        return Promise.reject(error);
    });

    // http响应拦截器
    axios.interceptors.response.use(res => {// 响应成功关闭loading
        // loadinginstace.close();
        Indicator.close();
        if (res.status === 200) {
            if (res.data.ErrorCode === 0) {
                return Promise.resolve(res.data.Value);
            } else if (res.data.ErrorCode === 1) {
                // Message({
                //     message: res.data.ErrorMessages[0],
                //     type: 'error'
                // });
                Toast({
                    message: res.data.ErrorMessages[0],
                    position: 'bottom',
                    duration: '5000'
                });
                return Promise.reject(new Error(res.data.ErrorMessages[0]));
            } else {
                //180606增加对高聪同步桌台请求的返回值处理机制
                if (res.data.code===200){
                    // Message({
                    //     message: res.data.message,
                    //     type: 'success'
                    // });
                    Toast({
                        message: res.data.message,
                        position: 'bottom',
                        duration: '5000'
                    });
                    return Promise.resolve(res.data.message);
                }else {
                    // Message({
                    //     message: res.data.message,
                    //     type: 'error'
                    // });
                    Toast({
                        message: res.data.message,
                        position: 'bottom',
                        duration: '5000'
                    });
                    return Promise.reject(new Error("无效返回值!"));
                }
                // return Promise.reject(new Error("无效返回值"));
            }
        } else {
            return Promise.reject(new Error("服务器错误"));
        }
    }, error => {
        // loadinginstace.close();
        Indicator.close();

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 这里写清除token的代码
                    // router.replace({
                    //     path: 'login',
                    //     query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                    // });
                    // Message.error({
                    //     message: '加载失败',
                    // });
                    Toast({
                        message: '加载失败',
                        position: 'bottom',
                        duration: '5000'
                    });
                case 404:
                    // Message.error({
                    //     message: '接口错误',
                    // });
                    Toast({
                        message: '接口错误',
                        position: 'bottom',
                        duration: '5000'
                    });
            }
        }
        return Promise.reject(error);
    });
}

let test = function () {
    console.log('****test****');
};

export {init, API, URLS, test}

