<template>

<div class="overlay" v-show="isQRCodeVisible" @touchmove.prevent>
    <div id="qr-code-container">
        <div>
            <img :src="qrCodeImgSrc || defaultQrCodeImgUrl"/>
        </div>
        <div>
            <figure class="pay-channel active">
                <a :class="{'active':type==='ali'}">
                    <img @click="getAliPayQRCode()" src="../../images/logo-alipay.jpg"/>
                </a>
                <div>支付宝支付</div>
            </figure>
            <figure class="pay-channel">
                <a :class="{'active':type==='wechat'}">
                    <img @click="getWechatQRCode()" src="../../images/logo-wechat.jpg"/>
                </a>
                <div>微信支付</div>
            </figure>
        </div>
    </div>
</div>

</template>


<script>

import {mapState} from 'vuex';
import types from '../store/types';
import QRious from 'qrious';


export default {
    data() {
        return {
            qrCodeImgSrc: '',
            type: ''
        }
    },
    props: ['visible'],
    computed: mapState([
        'isQRCodeVisible',
        'defaultQrCodeImgUrl'
    ]),
    methods: {
        getWechatQRCode() {
            this.$store.dispatch(types.QR_CODE_GET, 'WQR').then((data) => {

                var qr = new QRious({
                    value: decodeURIComponent(data)
                });

                this.qrCodeImgSrc = qr.toDataURL();
                this.type = 'wechat';
            });
        },
        getAliPayQRCode() {

            this.$store.dispatch(types.QR_CODE_GET, 'AQR').then((data) => {

                var qr = new QRious({
                    value: decodeURIComponent(data)
                });

                this.qrCodeImgSrc = qr.toDataURL();
                this.type = 'ali';
            });
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

@import "qr-code.scss";

</style>