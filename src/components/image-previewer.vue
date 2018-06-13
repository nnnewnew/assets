<template>

<div class="overlay" v-show="visible">
    <div>
        <div id="image-previewer-container">
            <img id="dish-image" :src="dish.imgUrl"/>
            <p id="dish-name">{{dish.name}}</p>
            <!--<ul id="tag-list">-->
                <!--<li v-for="(tag, i) of dish.tagList">-->
                    <!--<a class="tag" :class="{'active':tag.active}" @click="addTag(tag, i)">{{tag.name}}</a>-->
                <!--</li>-->
            <!--</ul>-->
            <div id="price-container">
                <span>￥ {{dish.price}}</span>
                <a class="btn plus" @click="add(dish)"></a>
            </div>
        </div>
        <a id="close-btn" @click="close()"></a>
    </div>
</div>

</template>


<script>

import axios from 'axios';


export default {
    data() {
        return {
            tagList: []
        }
    },
    methods: {
        add(d) {
            // d.selectedTagList = this.tagList;
            this.$emit('add', d);
        },
        close() {
            this.$emit('close');
        },
        addTag(tag, i) {
            let nt = Object.assign({}, tag, {active: true});
            this.dish.tagList.splice(i, 1, nt);
        }
    },
    props: ['dish', 'visible'],
    computed: {},
    created() {

    },
    mounted() {

    },
    destroyed() {

    }
}

</script>


<style lang="scss" scoped>

@import "image-previewer.scss";

</style>