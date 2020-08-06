var SysConfig = require('../../utils/util.js')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function(query) {
    let _this=this
    // 查看是否授权
    wx.getSetting({
        //授权成功
    success(res){
     //01 获取所扫码上的信息
      wx.login({
        success: function (res) {
          console.log(res.code)
          _this.setData({
            code:res.code,//赋值code\
            seeddata:decodeURIComponent(query.scene)//扫码页面自带参数
   
          })
        }})
      // 02步绑定
        if (res.authSetting['scope.userInfo']) {
          // 获取用户信息
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

// 01扫码后绑定系统账号
firstdata:function(){
 
  console.log("请求seed")
  SysConfig.SubSystemData.request({
    istoken: false,
    XKLX: "SYBGGL",
    XAction: "GetDataInterface",
    data: {
      "XKLX_APPID": "92837277",
      "XDLMCID": "9000",
      "XDLMSID": "9203051",
      "XDLMTID": "9203",
      'method':"bind",
      "userName": this.data.nikename,//用户名字
      'code':this.data.code,//页面进入获取的code
      'seed':this.data.seeddata,//二维码带的参数
      "avatarUrl": this.data.avatarUrl,//地址
    },
    method: "GET"
  }).then((data) => {
    console.log("yyyyyy")
    if(data.success==true){
      let  _this=this
      wx.login({
        success: function (res) {
          _this.setData({
            code: res.code,//赋值code
          })
          wx.showToast({
          title: '绑定成功',
            icon: 'success',
            duration: 1000,
            complete: () => {
              _this.threeth()
            }
          })
        }
      })
    }else{
      let  _this=this
      wx.login({
        success: function (res) {
          console.log(res)
          _this.setData({
            code: res.code,//赋值code
       
          })
        }
      })
      wx.showToast({
        title: data.message,
        icon: 'loading',
        duration: 1000,
        complete: () => {
        }
      })
    }
  }).catch((data)=>{
    wx.showToast({
      title: data.message,
      icon: 'loading',
      duration: 1000,
      complete: () => {
      }
    })

  })
},

//02,小程序登录首页
threeth:function(){
  console.log("小程序登录")
  SysConfig.SubSystemData.request({
    istoken: false,
    XKLX: "SYBGGL",
    XAction: "GetDataInterface",
    data: {
      "XKLX_APPID": "92837277",
      "XDLMCID": "9000",
      "XDLMSID": "9203051",
      "XDLMTID": "9203",
      'method':"autoLogin",
      'code':this.data.code
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
  }).then((data) => {
    console.log(data)
    wx.setStorageSync('mUserName', data.data[0].mUserName)
    wx.setStorageSync('mUserID', data.data[0].mUserID)
    wx.setStorageSync('mUserOnlyNum', data.data[0].onlynum)
    wx.setStorageSync('mDepartment', data.data[0].mDepart)
    wx.setStorageSync('sytoken', data.sytoken)

    wx.redirectTo({
      //小程序首页面地址
      url: '/pages/index/index',
    })
  }).catch((data)=>{
    wx.showToast({
      title: data.message,
      icon: 'loading',
      duration: 1000,
      complete: () => {
      }
    })
  })
},

})