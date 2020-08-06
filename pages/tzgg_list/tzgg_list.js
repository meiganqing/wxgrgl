// pages/vactionDetail/vactionDetail.js
var SysConfig = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tzggData:""
  },

  tiaoUrl: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../tzgg_xq/tzgg_xq?id='+id
      })   
  },



    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserID: res.data
      })
  
   
    SysConfig.SubSystemData.request({
      istoken: true,
      method: "GET",
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030212311",
      }
    }).then((res) => {
      console.log(res)
        var tzggArr=[]
      for(var i=0; i<res.rows.length;i++){
        console.log(i)
        tzggArr.push({
          creator:res.rows[i].creator,
          tjsj:res.rows[i].tjsj,
          ggbt:res.rows[i].ggbt,
          id:res.rows[i].id
        } )
    }
      this.setData({
        tzggData:tzggArr
      })
  })
  })
  }

  
})






