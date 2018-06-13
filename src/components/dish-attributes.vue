<template>

<div class="overlay" v-show="isOverlayVisible" @touchmove.prevent @click="close()">
    <transition name="dish-attributes">
        <div id="dish-attributes-container" v-show="isDishAttributesVisible" @click.stop>
            <div id="dish-title">{{dish.name}}</div>
            <div id="attributes-group-wrapper">
                <dl class="attributes-group" v-for="attr of dish.attributes">
                    <dt>{{attr.name}}</dt>
                    <dd v-for="o of attr.options">
                        <a class="option" :class="{'active':o.selected}" @click="selectOption(o, attr.options)">{{o.name}}</a>
                    </dd>
                </dl>
            </div>
            <div id="dish-summary" v-if="type === 'single'">
                <div>
                    <span>￥{{additionInfo.actualPrice}}</span>
                    <span>{{additionInfo.desc}}</span>
                </div>
                <div class="btn-group">
                    <a v-show="count > 0" class="btn minus" :class="{'disabled':count <=1}" @click="minus()"></a>
                    <span v-show="count > 0">{{count}}</span>
                    <a class="btn plus" @click="plus()"></a>
                </div>
            </div>
            <a id="confirm-btn" @click="setAttributes()" :class="{'inactive':!additionInfo.isSelectionCompleted}">
                确 定
            </a>
        </div>
    </transition>
</div>

</template>


<script>

import axios from 'axios';


export default {
    data() {
        return {
            // isOverlayVisible1:false,
            count:1
        }
    },
    props: ['dish', 'type', 'isOverlayVisible'],
    computed: {
        isDishAttributesVisible() {
            return this.isOverlayVisible;
        },
        additionInfo() {
            let additionPrice = 0;
            let count = 0;
            let selectedOptions = [];
            let id = this.dish.id + '';
            if(this.dish.attributes){
                this.dish.attributes.forEach((attr) => {
                    attr.options.forEach((o, i) => {
                        if (o.selected) {
                            count++;
                            additionPrice += o.price;
                            selectedOptions.push(o.name);
                            id += i;
                        }
                    })
                });
            }
            return {
                actualPrice: (additionPrice + this.dish.price),
                isSelectionCompleted: this.dish.attributes ? (count === this.dish.attributes.length) : false,
                desc: selectedOptions.length > 0 ? `(${selectedOptions.join('、')})` : '',
                id:id
            };
        },
    },
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        isOverlayVisible: function (newVal, oldVal) {
            if(!oldVal & newVal){
                this.count = 1;
            }
        }
    },
    methods: {
        query() {

        },
        close() {
            this.$emit('close');
        },
        selectOption(option, options) {

            options.forEach((o, i) => {
                if (o.name === option.name) {
                    o.selected = !o.selected;
                } else {
                    o.selected = false;
                }
                options.splice(i, 1, o);
            });
        },
        setAttributes() {

            if (!this.additionInfo.isSelectionCompleted) {
                return;
            }
            this.dish.additionInfo = this.additionInfo;
            this.$emit('setAttributes', this.count);
        },
        plus() {

            this.count ++;
        },
        minus() {
            if (this.count <= 1) {
                return;
            }
            this.count--;
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


<style lang="scss" scoped>

@import "./dish-attributes.scss";

</style>