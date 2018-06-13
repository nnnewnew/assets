import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookie from 'js-cookie';

import { Toast, Indicator } from 'mint-ui';

import Login from './views/login.vue';
import Index from './views/scanQRCode.vue';
import DeviceRecord from './views/device-record.vue';
import DeviceDetail from './views/device-detail.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/', component: Login,
        meta: {
            keepAlive: false,
            title: '登录',
        },
    },
    {
        path: '/index', component: Index,
        meta: {
            keepAlive: true,
            title: '扫码查询',
        },
    },
    {
        path: '/deviceDetail', component: DeviceDetail,
        meta: {
            keepAlive: true,
            title: '设备详情'
        }
    },
    {
        path: '/deviceRecord', component: DeviceRecord,
        meta: {
            keepAlive: true,
            title: '设备查询记录'
        }
    },
    {
        path: '*', redirect: '/',
    }
];

let router = new VueRouter({routes});

router.beforeEach((to, from, next) => {

    // if (to.meta.title) {
    //     document.title = to.meta.title;
    //     if (window.AlipayJSBridge) {
    //         AlipayJSBridge.call('setTitle', {
    //             title: to.meta.title,
    //         });
    //     }
    // }

    // if (to.path !== '/' && !!!Cookie.get('token')) {
    //     Toast({
    //         message: '未授权访问',
    //         position: 'bottom',
    //         duration: '5000'
    //     });
    //     return next('/');
    // }
    next();
});


export default router;