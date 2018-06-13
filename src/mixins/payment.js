import Vue from 'vue';
import {mapState} from 'vuex';
import {WEBSOCKET_URL} from '../common/config';
import types from '../store/types.js';
import router from "../router";


export default {
    data() {
        return {
            pending: false
        }
    },
    computed: mapState([
        'currentBrowser',
        'unpaidOrderId'
    ]),
    methods: {
        callAliPay() {

            this.$store.dispatch(types.ORDER_CREATE_BY_ALI).then((tradeNO)=>{

                AlipayJSBridge.call("tradePay", {
                    tradeNO: tradeNO
                },  (result) => {
                    this.pending = false;

                    var c = result.resultCode;
                    switch (c) {
                        case "9000":
                            alert("支付成功!");
                            this.$store.commit(types.ORDER_STATUS_SET, true);
                            router.push({path: 'success'});
                            break;
                        case "6001":
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                            break;
                        case "6002":
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                            break;
                        case "7001":
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                            break;
                        case "4000":
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                            break;
                        case "99":
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                            break;
                        default:
                            alert("支付宝支付失败，返回码：" + JSON.stringify(result));
                            break;
                    }
                });
            }).catch(err=>{
                alert(err);
                this.pending = false;
            });
        },
        callWechatPay() {

            this.$store.dispatch(types.ORDER_CREATE_BY_WECHAT).then((obj)=>{

                WeixinJSBridge.invoke(
                    "getBrandWCPayRequest", obj, (res) => {
                        this.pending = false;

                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            this.$store.commit(types.ORDER_STATUS_SET, true);
                            router.push({path: 'success'});
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            this.$store.commit(types.CART_ITEMS_CLEAR);
                            this.$store.dispatch(types.UNPAID_DISH_LIST_QUERY);
                        } else {
                            alert("微信支付失败");
                        }
                    }
                );
            }).catch(err=>{
                alert(err);
                this.pending = false;
            });
        },
        checkOut() {

            if (this.pending) {
                return;
            }

            this.pending = true;
            if (this.currentBrowser === 'ali') {

                this.callAliPay();
            } else if (this.currentBrowser === 'wechat') {

                this.callWechatPay();
            } else {
                // alert('请用支付宝或微信扫码点单');
                this.$store.commit(types.QR_CODE_VISIBILITY_SET, true);
                this.pending = false;
            }
        },
        createOrderAndCheckOut() {

            if (this.pending) {
                return;
            }

            this.pending = true;
            this.$store.dispatch(types.UNPAID_DISH_LIST_CREATE).then(() => {

                if (this.currentBrowser === 'ali') {

                    this.callAliPay();
                } else if (this.currentBrowser === 'wechat') {

                    this.callWechatPay();
                } else {
                    // alert('请用支付宝或微信扫码点单');
                    this.$store.commit(types.QR_CODE_VISIBILITY_SET, true);
                    this.pending = false;
                }
            }).catch(()=>{
                this.pending = false;
            });
        }
    },
}