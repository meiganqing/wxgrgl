// pages/tzgg_xq/tzgg_xq.js
var SysConfig = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    creator:"",
    depart:"",
    ggbt:"",
    ggnr:"",
    tjsj:"",
    formats: {},
    readOnly: true,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    rowidData:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      pageParams: {
        rowid: options.id,
      }
    })
    SysConfig.SubSystemData.request({ // 获取主表单行数据
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030129312",
        "XDLMA": this.data.pageParams.rowid,
      },
      method: "GET"
    }).then((res) => {
      console.log(res)
      this.setData({
        rowidData:res.rows[0]
      })
    })
     
  },
 
})