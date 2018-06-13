import Vuex from 'vuex';
import Vue from 'vue';
import {init, IMAGE_URI} from "../common/config";
import axios from "axios";
import types from "./types";


Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userId: '2088002986608074',
        shopId: '80051001',
        tableId: '1',
        numberOfPeople: 0,
        isTopBarVisible: false,
        categoryList: [],
        dishList: [],
        merchantInfo: {
            logoImgUrl: '',
            defaultLogoImgUrl: '../../images/logo.png',
            defaultDishImgUrl: '../../images/dish.jpg',
            address: '',
            contactNumber: '',
            mainShopName: '点单易',
            branchShopName: '',
            businessHours: '',
            consumptionPerPerson: '',
            introduction: '',
            shopImgUrl: '',
            serviceFee: 0,
            serviceFeeId: '',
            isPaymentFirst: true,
        },
        snapshot: {
            categoryList: [],
            dishList: [],
        },
        cartItemList: [],
        cartTotalCount: 0,
        cartTotalAmount: 0,
        cartItemMap: new Map(),
        dishSKUMap: new Map(),
        orderTotalAmount: 0,
        totalServiceFee: 0,
        unpaidDishList: [],
        unpaidOrderId: null,
        unpaidOrderTotalAmount: 0,
        currentBrowser: '',
        isQRCodeVisible: false,
        orderCount: 0,
        defaultQrCodeImgUrl: '../../images/qrcode-placeholder.jpg',
        isOrderPaid: false,
    },
    getters: {
        // orderTotalAmount(state) {
        //
        //     let totalAmount = 0;
        //     for (let ud of state.unpaidDishList) {
        //         totalAmount += ud.price * ud.count;
        //     }
        //     totalAmount += state.cartTotalAmount;
        //     if (state.orderCount < 1) {
        //         totalAmount += state.merchantInfo.serviceFee * state.numberOfPeople;
        //     }
        //     return totalAmount;
        // },
        orderNoDiscountAmount(state) {

            let totalAmount = 0;
            totalAmount += state.unpaidOrderTotalAmount;
            for (let ci of state.cartItemList) {
                totalAmount += ci.noDiscountPrice * ci.count;
            }
            // totalAmount += state.merchantInfo.serviceFee * state.numberOfPeople;
            return totalAmount;
        }
    },
    mutations: {
        [types.TOP_BAR_VISIBILITY_SET](state, payload) {

            state.isTopBarVisible = payload;
        },
        [types.TABLE_INFO_SET](state, payload) {

            state.shopId = payload.shopid;
            state.tableId = payload.tableid;
            state.userId = payload.userid;
        },
        [types.CURRENT_BROWSER_SET](state, payload) {

            state.currentBrowser = payload;
        },
        [types.NUMBER_OF_PEOPLE_SET](state, payload) {

            state.numberOfPeople = payload;
        },
        [types.CART_ITEMS_SYNC](state, payload) {

            let cashStr = localStorage.getItem('cashObj');
            if (!cashStr) {
                return;
            }
            let cashObj = JSON.parse(cashStr);
            state.dishList = cashObj.dishList;
            state.categoryList = cashObj.categoryList;
            state.cartItemMap = new Map(cashObj.cartItemMap);
            state.dishSKUMap = new Map(cashObj.dishSKUMap);

            let cartItemList = [];
            let totalCount = 0;
            let totalAmount = 0;

            for (let item of state.cartItemMap.values()) {
                totalCount += item.count;
                totalAmount += item.count * item.additionInfo.actualPrice;
                cartItemList.unshift(item);
            }

            state.cartItemList = cartItemList;
            state.cartTotalCount = totalCount;
            state.cartTotalAmount = totalAmount;
        },
        [types.DISH_PLUS](state, payload) {

            let dish = Object.assign({}, state.dishList[payload.dishIndex], {additionInfo:payload.additionInfo, groupList:payload.groupList});
            dish.count++;
            state.dishList.splice(payload.dishIndex, 1, dish);

            let categoryIndex = dish.categoryIndex;
            let category = Object.assign({}, state.categoryList[categoryIndex]);
            category.count++;
            state.categoryList.splice(categoryIndex, 1, category);

            let cartItemList = [];
            let totalCount = 0;
            let totalAmount = 0;

            let dishSKUArr = state.dishSKUMap.get(dish.id);
            if (!dishSKUArr) {
                dishSKUArr = [];
            }
            dishSKUArr.push(dish.additionInfo.id);
            state.dishSKUMap.set(dish.id, dishSKUArr);

            let cartItem = state.cartItemMap.get(dish.additionInfo.id);
            if (!cartItem) {
                state.cartItemMap.set(dish.additionInfo.id, Object.assign({}, dish, {count: 1}));
            } else {
                cartItem.count++;
                state.cartItemMap.set(dish.additionInfo.id, cartItem);
            }
            for (let item of state.cartItemMap.values()) {
                totalCount += item.count;
                totalAmount += item.count * item.additionInfo.actualPrice;
                cartItemList.unshift(item);
            }

            state.cartItemList = cartItemList;
            state.cartTotalCount = totalCount;
            state.cartTotalAmount = totalAmount;

            let cashObj = {
                dishList:state.dishList,
                categoryList:state.categoryList,
                cartItemMap:state.cartItemMap,
                dishSKUMap:state.dishSKUMap
            };
            localStorage.setItem('cashObj', JSON.stringify(cashObj));
        },
        [types.DISH_MINUS](state, payload) {

            if (payload.count < 1) {
                return;
            }
            let dish = Object.assign({}, state.dishList[payload.dishIndex], payload);
            dish.count--;
            state.dishList.splice(payload.dishIndex, 1, dish);

            let categoryIndex = dish.categoryIndex;
            let category = Object.assign({}, state.categoryList[categoryIndex]);
            category.count--;
            state.categoryList.splice(categoryIndex, 1, category);

            let cartItemList = [];
            let totalCount = 0;
            let totalAmount = 0;

            let dishSKUArr = state.dishSKUMap.get(dish.id);
            let additionId = dishSKUArr.pop();
            state.dishSKUMap.set(dish.id, dishSKUArr);

            let cartItem = state.cartItemMap.get(additionId);
            cartItem.count --;
            if (cartItem.count < 1) {
                state.cartItemMap.delete(additionId);
            } else {
                state.cartItemMap.set(additionId, cartItem);
            }
            for (let item of state.cartItemMap.values()) {
                totalCount += item.count;
                totalAmount += item.count * item.additionInfo.actualPrice;
                cartItemList.unshift(item);
            }

            state.cartItemList = cartItemList;
            state.cartTotalCount = totalCount;
            state.cartTotalAmount = totalAmount;

            let cashObj = {
                dishList:state.dishList,
                categoryList:state.categoryList,
                cartItemMap:state.cartItemMap,
                dishSKUMap:state.dishSKUMap
            };
            localStorage.setItem('cashObj', JSON.stringify(cashObj));
        },
        [types.CART_ITEMS_CLEAR](state, payload) {

            state.cartTotalCount = 0;
            state.cartTotalAmount = 0;
            state.cartItemList = [];
            state.cartItemMap = new Map();
            state.dishSKUMap = new Map();

            state.dishList = state.snapshot.dishList.map(e => {
                return {...e}
            });
            state.categoryList = state.snapshot.categoryList.map(e => {
                return {...e}
            });

            localStorage.removeItem('cashObj');
        },
        [types.MERCHANT_INFO_SET](state, payload) {

            state.merchantInfo = Object.assign(state.merchantInfo, payload);
        },
        [types.CATEGORY_LIST_SET](state, payload) {

            state.categoryList = payload;
        },
        [types.QR_CODE_VISIBILITY_SET](state, payload) {

            state.isQRCodeVisible = payload;
        },
        [types.ORDER_STATUS_SET](state, payload) {

            state.isOrderPaid = payload;
        },
        [types.ORDER_INFO_SYNC](state, payload) {

            this.commit(types.CART_ITEMS_CLEAR);
            let unpaidDishList = [];
            for (let d of payload.goods) {
                unpaidDishList.push({
                    id: d.goodid,
                    name: d.goodname,
                    count: d.num,
                    price: d.price,
                    // liked: false,
                })
            }
            state.unpaidDishList = unpaidDishList;
            if (!state.unpaidOrderId && payload.tranFlowno) {
                state.orderCount++;
            }
            state.unpaidOrderId = payload.tranFlowno;
            state.unpaidOrderTotalAmount = payload.undisprice;
        },
    },
    actions: {
        [types.MERCHANT_INFO_QUERY]({state, commit}, payload) {

            axios.post(`shop/getinfo?shopId=${state.shopId}`)
                .then(res => {

                    const resData = res.data;
                    let merchantInfo = {
                        logoImgUrl: resData.logoImgUrl || state.merchantInfo.defaultLogoImgUrl,
                        address: resData.address,
                        contactNumber: resData.contactNumber,
                        mainShopName: resData.mainShopName,
                        branchShopName: resData.branchShopName,
                        shopName: resData.shopName,
                        isPaymentFirst: resData.isPaymentFirst,
                        serviceFee:resData.serviceFee,
                    };
                    commit(types.MERCHANT_INFO_SET, merchantInfo);
                })
                .catch(err => {
                    alert(err);
                });
        },
        [types.DISH_LIST_QUERY]({state, commit}, payload) {

            return axios.get(`newshop/getAllMenu?shopId=${state.shopId}&timstamp=${new Date().getTime()}`)
                .then(res => {

                    const resData = res.data;
                    let categoryList = [];
                    let dishList = [];
                    let k = 0;
                    for (let i = 0; i < resData.length; i++) {
                        let c = resData[i];
                        var category = {
                            id: c.categoryId,
                            name: c.categoryName,
                            count: 0,
                            anchor: 'anchor_' + i
                        };
                        categoryList.push(category);

                        for (let j = 0; j < c.dishList.length; j++) {
                            let d = c.dishList[j];
                            let dish = {
                                id: d.id,
                                name: d.name,
                                sales: d.sales,
                                price: d.price,
                                type: d.type,
                                dishIndex: k++,
                                count: 0,
                                isSoldOut:d.isSoldOut,
                                likedCount: d.liked,
                                imgUrl: d.imgUrl || state.merchantInfo.defaultDishImgUrl,
                                attributes:d.attributes,
                                categoryIndex: i
                                // noDiscountPrice: d.isdiscount === 1 ? 0 : d.realprice
                            };
                            if (j === 0) {
                                dish.anchor = category.anchor
                            }
                            dishList.push(dish);
                        }
                    }
                    state.categoryList = categoryList;
                    state.dishList = dishList;
                    state.snapshot.categoryList = categoryList.map(e => {
                        return {...e}
                    });
                    state.snapshot.dishList = dishList.map(e => {
                        return {...e}
                    });
                })
                .catch(err => {
                    alert(err);
                });
        },
        [types.UNPAID_DISH_LIST_QUERY]({state, commit}, payload) {

            return axios.get(`NewShop/GetSelectedOrder`, {
                params: {
                    shopId: state.shopId,
                    tableId: state.tableId,
                },
            }).then((res) => {
                const resData = res.data.data;
                if (res.data.code !== 200) {
                    // alert(res.data.message);
                    return;
                }
                let unpaidDishList = [];
                for (let d of resData.orderItems) {
                    unpaidDishList.push({
                        id: d.id,
                        name: d.name,
                        count: d.count,
                        price: d.price,
                        actualPrice:d.actualPrice,
                        type:d.type
                        // liked: false,
                    })
                }
                state.unpaidDishList = unpaidDishList;
                state.unpaidOrderId = resData.orderId;
                state.orderTotalAmount = resData.totalAmount;
                state.totalServiceFee = resData.totalServiceFee;
                state.numberOfPeople = resData.numberOfPeople;
                // state.unpaidOrderTotalAmount = resData.undisprice;
            }).catch((err) => {
                alert(err);
            })
        },
        [types.UNPAID_DISH_LIST_CREATE]({state, commit}, payload = {}) {

            if (state.cartItemList.length < 1) {
                return;
            }

            let orderItems = [];
            state.cartItemList.forEach((ci) => {

                let dish = {
                    id: ci.id,
                    name: ci.name,
                    price: ci.price,
                    actualPrice: ci.additionInfo.actualPrice,
                    count: ci.count,
                    type: ci.type
                };

                if (dish.type === 'single') {

                    let attributes = [];
                    ci.attributes.forEach((attr) => {
                        let attribute = {
                            id: attr.id,
                            name: attr.name,
                            options: []
                        };
                        attr.options.forEach((op) => {

                            if (op.selected) {
                                let option = {
                                    id: op.id,
                                    name: op.name,
                                    price: op.price
                                };
                                attribute.options.push(option);
                            }
                        });
                        attributes.push(attribute);
                    });
                    dish.attributes = attributes;

                } else if (dish.type === 'package') {

                    let groupList = [];
                    ci.groupList.forEach((g) => {

                        let group = {
                            id: g.name,
                            name: g.name,
                            dishList: []
                        };

                        g.dishList.forEach((d) => {

                            if (d.selected) {
                                let dish = {
                                    id: d.id,
                                    name: d.name,
                                    price:d.price,
                                    count: 1,
                                    type: 'single'
                                };
                                let attributes = [];
                                d.attributes.forEach((attr) => {
                                    let attribute = {
                                        id: attr.id,
                                        name: attr.name,
                                        options: []
                                    };
                                    attr.options.forEach((op) => {

                                        if (op.selected) {
                                            let option = {
                                                id: op.id,
                                                name: op.name,
                                                price: op.price
                                            };
                                            attribute.options.push(option);
                                        }
                                    });
                                    attributes.push(attribute);
                                });
                                dish.attributes = attributes;
                                group.dishList.push(dish);
                            }
                        });
                        groupList.push(group);
                    });
                    dish.groupList = groupList;
                }
                orderItems.push(dish);
            });

            let data = {
                shopId: state.shopId,
                tableId: state.tableId,
                userId: state.userId,
                numberOfPeople: state.numberOfPeople,
                orderItems: orderItems,
                // orderId: state.unpaidOrderId
            };

            // if (payload !== null) {
            //     data.isPrint = payload.isPrint || 0;
            // }
            //
            // if (state.unpaidOrderId !== null) {
            //     data.tranFlowno = state.unpaidOrderId
            // } else if (state.numberOfPeople > 0 && state.merchantInfo.serviceFee > 0) {
            //
            //     data.goods.push({
            //         goodid: state.merchantInfo.serviceFeeId,
            //         goodname: '服务费',
            //         num: state.numberOfPeople,
            //         price: state.merchantInfo.serviceFee,
            //     });
            // }

            // let dataStr = 'orderStr=' + JSON.stringify(data);
            // if (state.currentBrowser === 'ali') {
            //     dataStr += '&isAli=true'
            // }

            return axios.post('NewShop/Order', data, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then((res) => {
                const resData = res.data;
                if (resData.code !== 200) {
                    alert(resData.message);
                    return Promise.reject(new Error(resData.message));
                }
                state.unpaidOrderId = resData.data;
                state.orderCount++;

                if (!state.merchantInfo.isPaymentFirst) {
                    commit(types.CART_ITEMS_CLEAR);
                }
            })
        },
        [types.ORDER_CREATE_BY_ALI]({state, commit}, payload) {

            return axios.get(`alipay/CreateTrade`, {
                params: {
                    userId: state.userId,
                    shopId: state.shopId,
                    orderId: state.unpaidOrderId,
                    tableId: state.tableId
                },
            }).then((res) => {

                const resData = res.data;
                if (resData.code !== 200) {
                    return Promise.reject(resData.message);
                }
                commit(types.CART_ITEMS_CLEAR);
                var tradeNO = resData.data;
                return tradeNO;
            })
        },
        [types.ORDER_CREATE_BY_WECHAT]({state, commit}, payload) {

            let str = `uid=${state.userId}&sid=${state.shopId}&oid=${'6' + state.shopId + '_' + state.unpaidOrderId}&tableNo=${state.tableId}`;

            return axios.post(`pay/payneworderdishWX`, str, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res) => {

                const resData = res.data;
                // var orderId = resData.orderId;
                return resData;
            })
        },
        [types.QR_CODE_GET]({state, commit}, payload) {

            let str = `oid=${'6' + state.shopId + '_' + state.unpaidOrderId}&sid=${state.shopId}&tableNo=${state.tableId}&payType=${payload}`;

            return axios.post(`pay/createpaycode`, str, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res) => {

                const resData = res.data;
                if (!resData.success) {
                    return Promise.reject(resData.message);
                }
                return resData.data;
            })
        }
    }
});

export default store;