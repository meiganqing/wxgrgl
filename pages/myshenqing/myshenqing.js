// pages/myshenqing/myshenqing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

// 出差
  chuchai() {
    wx.navigateTo({
      url: '/pages/cc_sqjl/cc_sqjl'
    })
  },
  // 请假
  qingjia() {
    wx.navigateTo({
      url: '/pages/qj_sqjl/qj_sqjl'
    })
  },

   // 补签
   buqian() {
    wx.navigateTo({
      url: '/pages/bq_sqjl/bq_sqjl'
    })
  },

   // 调休
   tiaoxiu() {
    wx.navigateTo({
      url: '/pages/tx_sqjl/tx_sqjl'
    })
  },

   // 加班
   jiaban() {
    wx.navigateTo({
      url: '/pages/jb_sqjl/jb_sqjl'
    })
  },

   // 外出
   waichu() {
    wx.navigateTo({
      url: '/pages/wc_sqjl/wc_sqjl'
    })
  },

   // 公文
   gongwen() {
    wx.navigateTo({
      url: '/pages/gwcy_sqjl/gwcy_sqjl'
    })
  },

   // 参观接待
   canguan() {
    wx.navigateTo({
      url: '/pages/cgjd_sqjl/cgjd_sqjl'
    })
  },

   // 报文
   baowen() {
    wx.navigateTo({
      url: '/pages/bw_sqjl/bw_sqjl'
    })
  },

   // 发新闻
   faxinwen() {
    wx.navigateTo({
      url: '/pages/fxw_sqjl/fxw_sqjl'
    })
  },
    //领书
  lingshu(){
    wx.navigateTo({
      url: '/pages/ls_sqjl/ls_sqjl'
    })
  }
})