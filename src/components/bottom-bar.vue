<template>

<transition name="cart-bar">
    <div id="bottom-bar" v-show="isBottomBarVisible">
        <div id="cart-item-container" v-show="isCartItemsVisible" @touchmove.stop>
            <div>
                <div id="cart-header">
                    <span>已点菜品</span>
                    <div @click="clear()"><i id="icon__trash"></i>清空</div>
                </div>
            </div>
            <ul id="cart-item-list">
                <li>
                    <div class="cart-item" v-for="ci of cartItemList">
                        <div>
                            <div>{{ci.name}}</div>
                            <div>{{ci.additionInfo.desc}}</div>
                        </div>
                        <div>
                            ￥{{ci.additionInfo.actualPrice * ci.count | currency('', 2)}}
                        </div>
                        <div class="btn-group">
                            <a class="btn minus" @click="minus(ci)"></a>
                            <span>{{ci.count}}</span>
                            <a class="btn plus" @click="plus(ci)"></a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <footer id="cart-bar">
            <div id="price-bar" @click="toggleCartItems()">
                <div id="cart">
                    <i id="icon__bracket"></i>
                    <span id="dish-count" v-show="cartTotalCount > 0">{{cartTotalCount}}</span>
                </div>
                <span id="price">
            ￥ {{cartTotalAmount | currency('', 2)}}
                </span>
            </div>
            <a id="checkout-btn" @click="next()">
                选好了
            </a>
        </footer>
    </div>
</transition>

</template>


<script>

import router from '../router';
import {mapState} from 'vuex';

export default {
    data() {
        return {
            isCartItemsVisible: false
        }
    },
    computed: {
        ...mapState([
            // 'categoryList',
            'numberOfPeople',
            'cartItemList',
            'cartTotalAmount',
            'cartTotalCount'
        ]),
        isBottomBarVisible() {
            return this.cartTotalCount > 0;
        }
    },
    // props: ['item-list', 'total-count', 'total-amount'],
    methods: {
        plus(ci) {
            this.$emit('plus', ci);
        },
        minus(ci) {
            this.$emit('minus', ci);
        },
        clear() {
            this.isCartItemsVisible = false;
            this.$emit('clear');
        },
        toggleCartItems() {
            if (this.cartItemList.length < 1 && !this.isCartItemsVisible) {
                return
            }
            this.isCartItemsVisible = !this.isCartItemsVisible;
        },
        next() {
            this.$emit('next');
            // router.push({path:'confirmation'});
        },
    },
    created() {

    },
    mounted() {

    },
    destroyed() {

    }
}

</script>

<style lang="scss">

@import "bottom-bar.scss";

</style>