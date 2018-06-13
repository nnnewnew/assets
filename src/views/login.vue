<template>
    <div class="page">
        <div class="container">
            <div class="input-item">
                <span>手机号</span>
                <input id="mobile" type="text" placeholder="请输入手机号" v-model="pageData.username">
            </div>
            <div class="input-item">
                <span>密码</span>
                <input id="password" type="password" placeholder="请输入密码" v-model="pageData.password">
            </div>
            <div class="btn-login" @click="login">
                登录
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {API} from '../common/config';
    import router from '../router';
    import Cookie from 'js-cookie';

    export default {
        name: "login",
        data() {
            return {
                pageData: {
                    username: '',
                    password: ''
                },
            }
        },
        methods: {
            login() {
                let data = {
                    userName: this.pageData.username,
                    password: this.pageData.password
                };
                axios.post(API.LOGIN, data)
                    .then(res => {
                        Cookie.set('token',res.token);
                        Cookie.set('userName',res.userName);
                        Cookie.set('userRole',res.userRole);
                        router.push({
                            path: '/index'
                        });
                    });
                router.push({
                    path: '/index'
                });
            },
        },
        computed: {},
        created(){

        },
        mounted(){

        },
        destroyed(){

        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/style';

    .page {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: $page-bg-color;

        & > .container {
            height: 70%;
            padding: 0 15px;
            flex: 0 0 auto;
        }

        .input-item {
            display: flex;
            padding:.5em;
            line-height: 3;

            & > span {
                flex: 0 0 65px;
                font-size: $input-title-font-size;
            }

            & > input {
                flex: 1 1 calc(100% - 120px);
                font-size: $input-item-font-size;
                padding:.5em 1em;
                border:1px solid #ddd;
            }
        }

        .btn-login {
            width: 50%;
            padding:.5em 1em;
            background-color: $btn-submit-bg-color;
            color: $btn-submit-text-color;
            margin: 3em auto 0;
            font-size: $input-item-font-size;
            border: 1px solid $btn-submit-bg-color;
            border-radius: 8px;
            text-align: center;
        }
    }
</style>