<template>

<div class="overlay" v-show="visible" @touchmove.prevent>
    <div id="number-selector-container">
        <header id="header">请选择用餐人数</header>
        <ul id="number-selector-list">
            <li v-for="n of numberList">
                <a class="number-selector" :class="{'selected':selectedNumber === n}" @click="select(n)">{{n}}</a>
            </li>
        </ul>
        <a id="start-btn" @click="start()">
            {{btnText}}
        </a>
    </div>
</div>

</template>


<script>

import axios from 'axios';


export default {
    data() {
        return {
            numberList: [],
            selectedNumber: null
        }
    },
    props: ['visible', 'btnText'],
    methods: {
        select(n) {
            this.selectedNumber = n;
        },
        start() {
            if (this.selectedNumber === null) {
                return;
            }
            this.$emit('selected', this.selectedNumber);
        }
    },
    computed: {},
    created() {

    },
    mounted() {
        for (let i = 1; i <= 20; i++) {
            this.numberList.push(i);
        }
    },
    destroyed() {

    }
}

</script>


<style lang="scss" scoped>

@import "number-selector.scss";

</style>