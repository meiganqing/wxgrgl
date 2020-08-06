
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: "",
    res:[]
  },
  detailUrl: function(e) {
    wx.navigateTo({
        url: '../bq_sqjlxq/bq_sqjlxq?id=' + e.currentTarget.dataset.id
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
        url: '../bq_add/bq_add?id=' + e.currentTarget.dataset.id
      })
    },

   //删除
   del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX:"SYRSGL",
      XAction:"GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH202003131346404640116324",
        "XDLMROWID": e.currentTarget.dataset.id
      }
    },this)
  },
  onLoad: function() {
 
  },
  onShow:function(){
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserId: res.data
      })
      SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYRSGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH202003131346404640180321",
          "XDLMB": this.data.mUserId,
          
        }
      }).then((res) => {
          this.setData({
            res: res.rows
          })
      })
    })
  }
})