<template>

<div class="overlay" v-show="visible" @touchmove.prevent>
    <img id="bell-reminder" src="../../images/bell-reminder.png" />
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

@import "bell-reminder.scss";

</style>