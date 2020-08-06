
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: "",
    res:[]
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
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030191181",
          "XDLMC": this.data.mUserId,
          'XDLMA': '年假,丧假,婚假,陪产假,产假,病假,事假'
        }
      }).then((res) => {
          this.setData({
            res: res.rows
          })
      })
    })
  },

  //查看
  detailUrl: function (e) {
    wx.navigateTo({
      url: '../qj_sqjlxq/qj_sqjlxq?id=' + e.currentTarget.dataset.id
    })
  },
  //撤回
  recall_btn: function (e) {
    SysConfig.WorkflowManage.isCheHui(e.currentTarget.dataset.onlynum, e.currentTarget.dataset.xmlcid,this)
  },
  //修改
  edit_btn: function (e) {
    wx.navigateTo({
      url: '../qj_add1/qj_add1?id=' + e.currentTarget.dataset.id
    })
  },
  //删除
  del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX:"SYBGGL",
      XAction:"GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH20190823102030203061184",
        "XDLMROWID": e.currentTarget.dataset.id
      }
    },this)
  },
})