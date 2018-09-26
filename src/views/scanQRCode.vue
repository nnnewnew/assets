<template>
  <div class="page">
    <div class="container">
      <div class="title">ID码查询</div>
      <div class="input-item">
        <span>SN</span>
        <input id="mobile" type="text" placeholder="请输入SN码" v-model="pageData.sn">
      </div>
      <div class="btn-login" @click="goToQueryPage">
        查询
      </div>
      <div class="scan-circle">
        <div class="scan-btn" id="wxsys" type="primary" @click="sys_click()">扫一扫</div>
      </div>
      <div class="info-table">
        <div class="info-item">
          <span>姓名:</span>
          <span>{{pageData.userName}}</span>
        </div>
        <div class="info-item">
          <span>角色:</span>
          <span>{{pageData.userRole}}</span>
        </div>
        <div class="btn-link" @click="logout()">
          退出登录
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import wx from 'weixin-js-sdk'
  import router from '../router'
  import axios from 'axios'
  import { API } from '../common/config'
  import { Toast } from 'mint-ui'
  import Cookie from 'js-cookie'

  export default {
    data () {
      return {
        pageData: {
          sn: '',
          userName: '',
          userRole: '',
        },

        testData: {
          isTesting: true
        }
      }
    },
    methods: {
      getUserInfo () {
        axios.get(`/test/api/v1/user/info?token=` + Cookie.get('token'), {}).then(res => {
          if (res.info) {
            this.pageData = {
              userName: res.info[0].name || '测试人员',
              userRole: res.info[0].role.name || '测试经理'
            }
          } else {
            Toast({
              message: '无有效信息',
              position: 'bottom',
              duration: '3500'
            })
          }
        })
      },
      sys_click () {
        this.axios({
          method: 'POST',
          url: '',
          data: {url: location.href.split('#')[0]}
        }).then(res => {
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识
            appId: res.appId,
            // 必填，生成签名的时间戳
            timestamp: res.timestamp,
            // 必填，生成签名的随机串
            nonceStr: res.nonceStr,
            // 必填，签名
            signature: res.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表
            jsApiList: ['checkJsApi', 'scanQRCode']
          })
        })
        wx.error(function (res) {
          alert('出错了：' + res.errMsg)//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        })
        // wx.config({
        //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //     appId: '', // 必填，公众号的唯一标识
        //     timestamp: '', // 必填，生成签名的时间戳
        //     nonceStr: '', // 必填，生成签名的随机串
        //     signature: '',// 必填，签名
        //     jsApiList: [] // 必填，需要使用的JS接口列表
        // });
        wx.ready(function () {
          wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {
              console.log('2')
            }
          })
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              // alert("扫描结果："+result);
              // window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
              this.pageData.sn = result
              Cookie.set('snId', this.pageData.sn)
              router.push({
                path: '/deviceDetail'
              })
            }
          })
        })
      },
      goToQueryPage () {
        Cookie.set('snId', this.pageData.sn)
        router.push({
          path: '/deviceDetail'
        })
      },
      logout () {
        Cookie.remove('token')
        Cookie.remove('userName')
        Cookie.remove('userRole')
        Cookie.remove('snId')
        axios.post(API.LOGOUT, {})
          .then(res => {
            router.push({
              path: '/'
            })
          })

        if (this.testData.isTesting) {
          router.push({
            path: '/'
          })
        }
      },
    },
    created () {

    },
    mounted () {
      this.getUserInfo()
    },
    destroyed () {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../common/style';

  .page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $page-bg-color;

    & > .container {
      height: 70%;
      padding: 0 15px;
      flex: 0 0 auto;

      .title {
        text-align: center;
        margin-bottom: .6em;
      }

      .input-item {
        display: flex;
        padding: .5em;
        line-height: 3;

        & > span {
          flex: 0 0 50px;
          font-size: $input-title-font-size;
        }

        & > input {
          flex: 1 1 calc(100% - 120px);
          font-size: $input-item-font-size;
          padding: .5em 1em;
          border: 1px solid #ddd;
        }
      }

      .btn-login {
        width: 50%;
        padding: .5em 1em;
        background-color: $btn-submit-bg-color;
        color: $btn-submit-text-color;
        margin: .6em auto 0;
        font-size: $input-item-font-size;
        border: 1px solid $btn-submit-bg-color;
        border-radius: 8px;
        text-align: center;
      }

      .scan-circle {
        margin: 46px auto 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #D8D8D8;

        .scan-btn {
          flex: 0 0 auto;
          text-align: center;
        }
      }

      .info-table {
        margin: 46px auto 0;

        .info-item {
          padding: .5em;
          text-align: center;

          & > span {
            color: $span-text-gray;
          }

          & > span:last-child {
            color: $span-text-black;
          }
        }

        .btn-link {
          margin-top: 1em;
          text-align: center;
          cursor: pointer;
          color: $link-blue;
        }
      }
    }
  }
</style>