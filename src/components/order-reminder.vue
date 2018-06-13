<template>

<div class="overlay" v-show="visible" @touchmove.prevent>
    <img id="order-reminder" src="../../images/order-reminder.jpg" />
</div>

</template>


<script>

import axios from 'axios';


export default {
    data () {
        return {}
    },
    props:['visible'],
    computed: {
    },
    methods: {
        query() {

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

@import "order-reminder.scss";

</style>