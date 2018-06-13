<template>

<div id="app">
    <transition name="slide">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
            </router-view>
        </keep-alive>
    </transition>

    <transition name="slide">
        <router-view v-if="!$route.meta.keepAlive">
        </router-view>
    </transition>
</div>

</template>


<script>

import router from './router';
import Vue from 'vue';
import store from './store';
import Vue2Filters from 'vue2-filters'; //过滤器
import FastClick from 'fastclick';      //FastClick消除点击延时提高程序的运行效率
import {init} from "./common/config";
import types from './store/types.js';
import WS from './plugins/websocket';

Vue.use(Vue2Filters);
// Vue.use(WS, store, router);

let mixin = {
    created : function () {
        // test();
        init();
    }
};

export default {
    router,
    store,
    components: {},
    mixins: [mixin],
    data() {
        return {}
    },
    created: function () {

        FastClick.attach(document.body); //FastClick消除点击延时提高程序的运行效率

        // document.addEventListener('AlipayJSBridgeReady', () => {
        //     this.$store.commit(types.CURRENT_BROWSER_SET, 'ali');
        // }, false);
        //
        // document.addEventListener("WeixinJSBridgeReady", () => {
        //     this.$store.commit(types.CURRENT_BROWSER_SET, 'wechat');
        // }, false);
    },

}

</script>


<style lang="scss">

@import "app.scss";

</style>