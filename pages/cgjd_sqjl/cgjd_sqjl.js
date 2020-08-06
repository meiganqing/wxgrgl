// pages/vactionDetail/vactionDetail.js
var SysConfig = require("../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mUserId: ""
  },
  // 查看
  detailUrl: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../cgjd_sqjlxq/cgjd_sqjlxq?id=' + id 
    })
  },
  //撤回
  recall_btn: function (e) {
    console.log(e)
    SysConfig.WorkflowManage.isCheHui(e.currentTarget.dataset.onlynum, e.currentTarget.dataset.xmlcid,this)
  },
    //修改
    edit_btn: function (e) {
      wx.navigateTo({
        url: '../cgjd_add/cgjd_add?id=' + e.currentTarget.dataset.id
      })
    },

   //删除
   del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX:"SYBGGL",
      XAction:"GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH201908231020302030129174",
        "XDLMROWID": e.currentTarget.dataset.id
      }
    },this)
  },


// 初始化
  onLoad: function () {
   
  },
  onShow:function(){
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserId: res.data
      })

      SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030221171",
          "XDLMJ": this.data.mUserId,
        }
      }).then((res) => {
        console.log(res)
        this.setData({
          res: res.rows
        })
      })
    })
  }

})