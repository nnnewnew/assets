<template>
    <div class="page">
        <div class="container">
            <ul class="device-detail-table">
                <li class="device-detail-item">
                    <span>SN码</span>
                    <span>:</span>
                    <span>{{pageData.sn}}</span>
                    <!--<span v-show="isEditing">-->
                        <!--<input type="text" v-model="pageData.sn">-->
                    <!--</span>-->
                </li>
                <li class="device-detail-item">
                    <span>设备号</span>
                    <span>:</span>
                    <span>{{pageData.deviceNo}}</span>
                    <!--<span v-show="isEditing">-->
                        <!--<input type="text" v-model="pageData.deviceNo">-->
                    <!--</span>-->
                </li>
                <li class="device-detail-item">
                    <span>设备型号</span>
                    <span>:</span>
                    <span>{{pageData.deviceType}}</span>
                    <!--<span v-show="isEditing">-->
                        <!--<input type="text" v-model="pageData.deviceType">-->
                    <!--</span>-->
                </li>
                <li class="device-detail-item">
                    <span>所属项目</span>
                    <span>:</span>
                    <span>{{pageData.projectName}}</span>
                    <!--<span v-show="isEditing">-->
                        <!--<input type="text" v-model="pageData.projectName">-->
                    <!--</span>-->
                </li>
                <li class="device-detail-item">
                    <span>当前状态</span>
                    <span>:</span>
                    <span>{{pageData.status}}</span>
                    <!--<span v-show="isEditing">-->
                        <!--<input type="text" v-model="pageData.status">-->
                    <!--</span>-->
                </li>
                <li class="device-detail-item">
                    <span>当前位置</span>
                    <span>:</span>
                    <span v-show="!isEditing">{{pageData.position}}</span>
                    <span v-show="isEditing">
                        <input type="text" v-model="pageData.position">
                    </span>
                </li>
                <li class="device-detail-picture">
                    <span>照片信息</span>
                    <span>:</span>
                    <p class="picture-table" v-show="!isEditing">
                        <span v-for="p in pageData.pictures">
                            <img class="device-item-img"
                                 :src="imgSrc(p)" alt="">
                        </span>
                    </p>
                    <p class="picture-table" v-show="isEditing">
                        <span v-for="(p,index) in pageData.pictures">
                            <img class="device-item-img"
                                 :src="imgSrc(p)" alt="">
                            <span class="del" @click="delImg(index)">x</span>
                        </span>
                        <span @click="chooseToUpload()">
                            <img class="device-item-img"
                                 src="../../images/icon_add.png" alt="">
                            <input id="file-input" type="file" hidden/>
                        </span>
                    </p>
                </li>
            </ul>
            <div class="btn-submit"
                 v-show="!isEditing"
                 @click="modifyDetailInfo">
                修改
            </div>
            <div class="footer-bar">
                <div class="btn-submit"
                     v-show="!isEditing"
                     @click="changeRecords">
                    变更记录
                </div>
                <div class="btn-submit"
                     v-show="isEditing"
                     @click="submitInfoAsync">
                    提交修改
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie';
    import axios from 'axios';
    import {API, URLS} from '../common/config';
    import { Toast } from 'mint-ui';
    import router from '../router';

    export default {
        name: "device-detail",
        data() {
            return {
                pageData: {
                    sn: '',
                    deviceNo: '',
                    deviceType: '',
                    projectName: '',
                    status: '',
                    position: '',
                    pictures: []
                },
                imgUpload : {
                    imgUrl : '',
                    previewImgUrl : '',
                    setupTips: {
                        capacity: '1M',
                        imgFormat: 'PNG或JPG',
                        sizeX: '336',
                        sizeY: '336',
                    }
                },
                isEditing: false,
            }
        },
        computed: {

        },
        methods: {
            queryAsync() {
                axios.get(`/test/api/v1/asset/scan/`+Cookie.get('snId')+`?token=`+Cookie.get('token'), {})
                    .then(res => {
                        if(res.info){
                            this.pageData = {
                                sn : res.info[0].identifier,
                                deviceNo : res.info[0].uniqueId,
                                deviceType : res.info[0].assetType.typeName + '-' + res.info[0].assetModel.modelName,
                                projectName : res.info[0].currentStatus.projectId,
                                status : res.info[0].currentStatus.status,
                                position : res.info[0].currentStatus.location.locationName + '-' + res.info[0].currentStatus.location.locationDetail,
                            }
                        }else {
                            Toast({
                                message: '无有效数据',
                                position: 'bottom',
                                duration: '3500'
                            });
                        }
                        if(res.attributes){
                            this.pageData.pictures = res.attributes.imgs;
                        }
                    });
            },
            imgSrc(s) {
                return URLS.UPLOAD_IMG_URL + s.imgName
            },
            modifyDetailInfo() {
                this.isEditing = true;
            },
            imgLoadActionWatching() {
                document.getElementById('file-input').addEventListener('change', (e) => {
                    let file = e.target.files[0];
                    let formData = new FormData();
                    formData.append(file.name, file);
                    axios.post('file/upload', formData, {
                        // headers: {'content-type': 'multipart/form-data'},
                    }).then(res => {
                        this.pageData.pictures.push(res.FileUrl);
                    });
                    // var reader = new FileReader();
                    // reader.addEventListener("load", e2 => {
                    //     this.previewImgUrl = e2.currentTarget.result;
                    // }, false);
                    // reader.readAsDataURL(file);
                }, false)
            },
            chooseToUpload() {
                document.getElementById('file-input').click();
            },
            delImg(index) {
                this.pageData.pictures.splice(index,1);
            },
            submitInfoAsync() {
                let data = {
                    assetId: this.pageData.deviceNo,
                    data: this.pageData.position,
                    img: this.pageData.pictures
                };
                axios.post(`/test/api/v1/asset/install/`+this.pageData.deviceNo, data)
                    .then(res => {
                        Toast({
                            message: res.message,
                            position: 'bottom',
                            duration: '5000'
                        });
                        this.isEditing = false;
                    });
            },
            changeRecords() {
                router.push({
                    path: '/deviceRecord'
                })
            }
        },
        created() {

        },
        mounted() {
            this.imgLoadActionWatching();
            this.queryAsync();
        },
        destroyed() {

        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/style';

    .page {
        background-color: #f0f0f0;

        .container {
            position: relative;
            padding-bottom: 60px;
            height: 100%;

            .device-detail-table {

                .device-detail-item {
                    background-color: $page-bg-color;
                    padding:18px 22px;
                    margin-top: 1px;
                    display: flex;

                    & > span {
                        flex: 0 0 auto;
                    }

                    & > span:first-child{
                        color: $span-text-gray;
                        flex: 0 0 70px;
                        line-height: 2;
                    }

                    & > span:nth-child(2){
                        color: $span-text-gray;
                        flex: 0 0 20px;
                        line-height: 2;
                    }

                    & > span:nth-child(3) {
                        flex: 0 0 calc(100% - 90px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: 2;
                    }

                    & > span:nth-child(4) {
                        flex: 0 0 calc(100% - 90px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        & > input {
                            width: 100%;
                            border: 1px solid $span-text-gray;
                            padding:.5em 1em;
                            color: $span-text-gray;
                        }
                    }
                }

                .device-detail-picture {
                    background-color: $page-bg-color;
                    padding:18px 22px;
                    margin-top: 1px;

                    & > span:first-child{
                        color: $span-text-gray;
                    }

                    & > span:nth-child(2){
                        color: $span-text-gray;
                    }

                    .picture-table {
                        display: flex;
                        width: 100%;
                        padding-top: 1em;
                        justify-content: left;
                        flex-wrap: wrap;

                        & > span {
                            padding:.5em;
                            flex: 0 0 30%;
                            position: relative;

                            & > .del {
                                position: absolute;
                                top: .2em;
                                right: .2em;
                            }

                            .device-item-img {
                                width: 100%;
                            }
                        }
                    }
                }
            }
            .footer-bar {
                position: fixed;
                bottom: 0;
                width: 100%;
                height: 55px;
                border-top: 1px solid $footer-bar-border-color;
                background-color: $page-bg-color;
            }
        }

        .btn-submit {
            width: 50%;
            padding:.5em 1em;
            background-color: $btn-submit-bg-color;
            color: $btn-submit-text-color;
            margin: .6em auto 0;
            font-size: $input-item-font-size;
            border: 1px solid $btn-submit-bg-color;
            border-radius: 8px;
            text-align: center;
        }


    }

</style>