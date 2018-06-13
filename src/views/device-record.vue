<template>
    <div class="page">
        <ul class="record-list-table">
            <li class="record-item"
                v-for="r in pageData.recordList">
                <span class="date-time">{{transDateTime(r.dateTime)}}</span>
                <span class="dots"></span>
                <span class="record-info">
                    <span>由</span>
                    <span class="did-by">{{r.name}}</span>
                    <span class="work">{{r.work}}</span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    import router from '../router';
    import Cookie from 'js-cookie';
    import axios from 'axios'
    import { API } from '../common/config';
    import dateFns from 'date-fns';


    export default {
        name: "device-record",
        data() {
            return {
                pageData: {
                    recordList: [
                        {
                            dateTime: '',
                            name: '',
                            work: ''
                        }
                    ]
                },

                testData: {
                    isTesting:true
                }
            }
        },
        computed: {

        },
        methods: {
            queryAsync() {
                let data = {
                    sn: Cookie.get('snId'),
                };
                axios.post(API.GET_ASSET_CHANGED_RECORD, data)
                    .then(res => {
                        this.pageData.recordList = res.recordList;
                    });

                if(this.testData.isTesting){
                    this.pageData.recordList = [
                        {
                            dateTime: 'Thu Jun 22 2017 19:07:30 GMT+0800',
                            name: '张三',
                            work: '发起采购'
                        },
                        {
                            dateTime: 'Thu Jun 22 2017 19:07:30 GMT+0800',
                            name: '李四',
                            work: '变更状态为待等级'
                        },
                        {
                            dateTime: 'Thu Jun 22 2017 19:07:30 GMT+0800',
                            name: '王五',
                            work: '变更状态为出库'
                        },
                        {
                            dateTime: 'Thu Jun 22 2017 19:07:30 GMT+0800',
                            name: '赵六',
                            work: '完成巡查'
                        },
                    ]
                }
            },
            transDateTime(d) {
                return dateFns.format(d,'MM.DD hh:mm')
            }
        },
        created() {

        },
        mounted() {
            this.queryAsync();
        },
        destroyed() {

        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/style';

    .page {

        .record-list-table {

            .record-item {
                padding:18px 22px;
                margin-top: 1px;
                background-color: $page-bg-color;
                display: flex;

                & > span:first-child {
                    flex: 0 0 90px;
                }

                & > span:nth-child(2) {
                    background-color: $dot-color-blue;
                    margin: 4px 9px 0;
                    flex: 0 0 10px;
                    height: 10px;
                    border-radius: 50%;
                }

                & > span:nth-child(3) {
                    flex: 1 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>