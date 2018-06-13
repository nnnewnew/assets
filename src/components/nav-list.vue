<template>

<div class="overlay" @click="close()" v-show="visible" @touchmove.prevent>
    <ul id="nav-list">
        <!--<li><a class="nav" @click="navigateTo('about')"><img class="icon shop" src="../../images/icon-shop.png" />店铺信息</a></li>-->
        <li><a class="nav" @click="navigateTo('menu')"><img class="icon home" src="../../images/icon-home.png" />点菜页面</a></li>
        <!--<li><a class="nav" @click="navigateTo('invoice')"><img class="icon printer" src="../../images/icon-printer.png" />打印发票</a></li>-->
        <!--<li><a class="nav" @click="navigateTo('points')"><img class="icon printer" src="../../images/icon-vip.png" />会员积分</a></li>-->
        <li><a class="nav no-bottom-border" @click="popUp()"><img class="icon printer" src="../../images/icon-fork.png" />正在用餐</a></li>
    </ul>
</div>

</template>


<script>

import axios from 'axios';
import router from '../router';


export default {
    data() {
        return {}
    },
    props: ['visible'],
    computed: {},
    methods: {
        popUp() {
            this.$emit('popUp');
        },
        close(){
            this.$emit('close');
        },
        navigateTo(p) {
            router.push({path: p});
        }
    },
    created() {

    },
    mounted() {

    },
    destroyed() {

    }
}

</script>


<style lang="scss" scoped>

@import "nav-list.scss";

</style>