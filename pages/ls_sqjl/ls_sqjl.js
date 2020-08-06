
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: "",
    res: []
  },
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
          "XDLMSID": "DYBH2020022014535505500011",
          "XDLMB": this.data.mUserId
        }
      }).then((res) => {
        let ls_arr=[]
        for (let i = 0; i < res.rows.length;i++){
          ls_arr.push({
            id: res.rows[i].id,
            xmlcid: res.rows[i].xmlcid,
            onlynum: res.rows[i].onlynum,
            creator : res.rows[i].申请人,
            title  : res.rows[i].标题,
            fqsj  : res.rows[i].申请时间,
            book : res.rows[i].图书,
            shzt : res.rows[i].shzt
          })
        }
        this.setData({
          res: ls_arr
        })
      })
    })
  },
  //查看
  detailUrl: function (e) {
    wx.navigateTo({
      url: '../ls_sqjlxq/ls_sqjlxq?id=' + e.currentTarget.dataset.id
    })
  },
  //撤回
  recall_btn: function (e) {
    SysConfig.WorkflowManage.isCheHui(e.currentTarget.dataset.onlynum, e.currentTarget.dataset.xmlcid, this)
  },
  //修改
  edit_btn: function (e) {
    wx.navigateTo({
      url: '../ls_add/ls_add?id=' + e.currentTarget.dataset.id
    })
  },
  //删除
  del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH20190823102030203012024",
        "XDLMROWID": e.currentTarget.dataset.id
      }
    }, this)
  }
})