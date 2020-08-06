
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: ""
  },
  
  detailUrl: function (e) {
    let url="";
    if(e.currentTarget.dataset.type=="no"){//群发
      url='../gwqf_sqxq/gwqf_sqxq?id='
    }else{
      url='../gwcy_sqxq/gwcy_sqxq?id='
    }
    wx.navigateTo({
      url: url + e.currentTarget.dataset.id
    })
  },
   //撤回
  recall_btn: function (e) {
    SysConfig.SubSystemData.request({
      istoken: true,
      method: "GET",
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH20200317113731373146231",
        "XDLMA": e.currentTarget.dataset.onlynum,
      }
    }).then((rydata)=>{
        if(rydata.rows && rydata.rows.length > 0){
          for (let i in rydata.rows) {
              if (rydata.rows[i].是否已读 == "是") {
                wx.showToast({
                  title: "已审核不可撤回！",
                  icon: 'none',
                  duration: 2000
                })
                return
              }
          }
        }
    })
    SysConfig.WorkflowManage.isCheHui(e.currentTarget.dataset.onlynum, e.currentTarget.dataset.xmlcid,this)
  },
  //修改
  edit_btn: function (e) {
    let url="";
    if(e.currentTarget.dataset.type=="no"){//群发
      url='../gwqf_add/gwqf_add?id='
    }else{
      url='../gwcy_add/gwcy_add?id='
    }
    wx.navigateTo({
      url: url + e.currentTarget.dataset.id
    })
  },
    

   //删除 
   del_btn: function (e) {
    SysConfig.SubSystemData._deldata({
      XKLX:"SYBGGL",
      XAction:"GetDataInterface",
      data: {
        "XDLMCID": "4000",
        "XDLMSID": "DYBH202007101118581858158454",
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
          "XDLMSID": "DYBH202007101118581858226451",
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