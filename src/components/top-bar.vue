<template>

<div class="top-bar">
    <span>{{tableId}}桌：{{numberOfPeople}}位</span>
    <div class="icon-group">
        <!--<a class="icon__bell" @click="showBellReminder()"></a>-->
        <!--<a class="icon__more-people" @click="showNumberSelector()"></a>-->
        <!--<a class="icon__menu" @click="showNavList()"></a>-->
    </div>
    <!--<number-selector :visible="isNumberSelectorVisible" @selected="setNumberOfPeople"></number-selector>-->
    <nav-list :visible="isNavListVisible" @close="hideNavList" @popUp="showOrderReminder()"></nav-list>
    <bell-reminder :visible="isBellReminderVisible"></bell-reminder>
    <order-reminder :visible="isOrderReminderVisible"></order-reminder>
</div>

</template>
`

<script>

import axios from 'axios';
import router from '../router';
import BellReminder from '../components/bell-reminder.vue';
import OrderReminder from '../components/order-reminder.vue';
import NumberSelector from '../components/number-selector.vue';
import NavList from '../components/nav-list.vue';
import types from '../store/types';
import {mapState} from 'vuex';


export default {
    data() {
        return {
            isBellReminderVisible: false,
            isOrderReminderVisible: false,
            // isNumberSelectorVisible: false,
            isNavListVisible: false,
        }
    },
    methods: {
        showBellReminder() {
            this.isBellReminderVisible = true;
            setTimeout(() => {
                this.isBellReminderVisible = false;
            }, 2000)
        },
        showOrderReminder() {
            if (this.unpaidOrderId) {
                router.push({path: '/order'});
                return;
            }
            this.isOrderReminderVisible = true;
            setTimeout(() => {
                this.isOrderReminderVisible = false;
            }, 2000)
        },
        showNumberSelector() {
            this.isNumberSelectorVisible = true;
        },
        setNumberOfPeople(e) {
            this.$store.commit(types.NUMBER_OF_PEOPLE_SET, e);
            this.isNumberSelectorVisible = false;
        },
        showNavList() {
            this.isNavListVisible = true;
        },
        hideNavList() {
            this.isNavListVisible = false;
        }
    },
    computed: mapState([
        // 'categoryList',
        'shopId',
        'tableId',
        'numberOfPeople',
        'unpaidOrderId',
    ]),
    components: {
        'bell-reminder': BellReminder,
        'order-reminder': OrderReminder,
        'number-selector': NumberSelector,
        'nav-list': NavList,
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

@import "top-bar.scss";

</style>