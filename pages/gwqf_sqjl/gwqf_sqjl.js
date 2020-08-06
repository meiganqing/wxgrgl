
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: ""
  },
  detailUrl: function (e) {
    wx.navigateTo({
      url: '../gwqf_sqjlxq/gwqf_sqjlxq?id=' + e.currentTarget.dataset.id
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
        url: '../qunFa/qunFa?id=' + e.currentTarget.dataset.id
      })
    },
    

   //删除 
   del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX:"SYBGGL",
      XAction:"GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH201908231020302030209224",
        "XDLMROWID": e.currentTarget.dataset.id
      }
    },this)
  },

  onLoad: function () {
    
  },
  onShow:function(){
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserId: res.data
      })
      return SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030185221",
          "XDLMB": this.data.mUserId,
        }
      })
    }).then((res) => {
      // let qfarr=[]
      // for (let i in res.rows){
      //   if (res.rows[i].isInterrupt =="no"){
      //     qfarr.push(res.rows[i])
      //   }
      // }
      this.setData({
        res: res.rows
      })
    })
  }
})