
var SysConfig = require('../../utils/util.js')
Page({
  data: {
    phone: '',
    password: '',
    text: '',
    mUserName: '',
  },
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录 
  login: function () {
    var that = this;
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else if (that.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else {
      SysConfig.SubSystemData.request({
        istoken: false,
        XKLX: "SYYHGL",
        XAction: "GetDataInterface",
        data: {
          "XKLX_APPID": "92837277",
          "XDLMCID": "7000",
          "XDLMSID": "DYBH2019100817082905540958",
          "XDLMTID": "7001",
          "XDLMmLoginName": this.data.phone,
          "XDLMPassword": this.data.password
        },
        method: "GET"
      }).then((data) => {
        if (data.success){
        wx.setStorageSync('mLoginName', this.data.phone)
        wx.setStorageSync('Password', this.data.password)
        
        wx.setStorageSync('mUserName', data.data[0].mUserName)
        wx.setStorageSync('mUserID', data.data[0].mUserID)
        wx.setStorageSync('mUserOnlyNum', data.data[0].onlynum)
        wx.setStorageSync('mDepartment', data.data[0].mDepart)
        wx.setStorageSync('sytoken', data.sytoken)
        
        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          duration: 1000,
          complete: () => {
            wx.redirectTo({
              //目的页面地址
              url: '/pages/index/index',
            })
          }
        })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  // 注册 
  register: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})
