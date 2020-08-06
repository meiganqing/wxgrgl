
var SysConfig = require('../../utils/util.js')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code:"",
    nikename:"",
    avatarUrl:"",//
    seeddata:"",//扫码获取的值
    yhmusid:""//用户useid
  },

  onLoad: function(query) {
    let _this=this
    // _this.seeding()//获取图片动态seed//测试
      wx.getSetting({
        success (res){
            //01 获取所扫码上的信息
    wx.login({
      success: function (res) {
        _this.setData({
          code:res.code,//赋值code\
          seeddata:decodeURIComponent(query.scene)//扫码页面自带参数
        })
      }})
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                _this.setData({
                  nikename:res.userInfo.nickName,//赋值名字
                  avatarUrl:res.userInfo.avatarUrl//复制地址
                })

              }
            })
          }
        }
      })
  
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },

//确认登录
  loginbutton:function(){
    let that=this
    console.log("小程序登录")
    console.log(this.data.code)

    wx.login({
      success: function (res) {
        // this.setData({
        //   code: res.code,//赋值code\
        //   // seeddata: decodeURIComponent(query.scene)//扫码页面自带参数

        // })
        SysConfig.SubSystemData.request({
          istoken: false,
          XKLX: "SYBGGL",
          XAction: "GetDataInterface",
          data: {
            "XKLX_APPID": "92837277",
            "XDLMCID": "9000",
            "XDLMSID": "9203051",
            "XDLMTID": "9203",
            'method': "autoLogin",
            'code': res.code
          },
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
        }).then((data) => {
          console.log("成功")
          console.log(data)
          wx.setStorageSync('mUserName', data.data[0].mUserName)
          wx.setStorageSync('mUserID', data.data[0].mUserID)
          wx.setStorageSync('mUserOnlyNum', data.data[0].onlynum)
          wx.setStorageSync('mDepartment', data.data[0].mDepart)
          wx.setStorageSync('sytoken', data.sytoken)

          that.setData({
            yhmusid: data.data[0].mUserID
          })
          console.log(that.data.yhmusid,11111111111111111)
          //  后台管理系统授权登录
          that.fourth()//授权后台管理系统登录

        }

        ).catch((data) => {

          wx.showToast({
            title: data.message,
            icon: 'loading',
            duration: 1000,
            complete: () => {
            }
          })

        })
      }
    })
   
  },

//04小程序扫码后台小程序码，授权登录
fourth:function(){
  console.log("授权登陆")
  SysConfig.SubSystemData.request({
    istoken: false,
    XKLX: "SYBGGL",
    XAction: "GetDataInterface",
    data: {
      "XKLX_APPID": "92837277",
      "XDLMCID": "9000",
      "XDLMSID": "9203051",
      "XDLMTID": "9203",
      'method':"authLogin",
      "MUserId": this.data.yhmusid,
      "seed":this.data.seeddata
    },
    method: "GET"
  }).then((data) => {
    console.log(data)
    wx.showToast({
      title: '操作成功',
      icon: 'success',
      duration: 1000,
      complete: () => {
        wx.redirectTo({
          //小程序首页面地址
          url: '/pages/index/index',
        })
      }
    })
  })

},



})



