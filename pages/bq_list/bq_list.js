// pages/buqian/buqian.js
var SysConfig = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */

  data: {
    mUserID: "",
    arrData: []
  },
  tiaoUrl2: function (e) {
    var that = this;
    var linkid = e.currentTarget.dataset.linkid
    var gzr = e.currentTarget.dataset.gzr
    var bkzt = e.currentTarget.dataset.bkzt
    if (bkzt == "未补卡") {
      wx.navigateTo({
        url: '../bq_add/bq_add?linkid=' + linkid + "&gzr=" + gzr
      })
    } else {
      wx.showToast({
        title: '已申请补卡，请勿重复提交',
        icon: 'none',
        duration: 2000
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

 
  },
  onShow:function(){
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserID: res.data
      })

      var endTime = SysConfig.ToolBox.CurrentDate()
      var date = new Date();
      var dateStart = date.getFullYear() + '-' + "01" + '-' + "01"
      SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYRSGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH2019110412091991932241",
          "XDLMF": this.data.mUserID,
          "XDLMA": dateStart + "," + endTime,
          "XDLMH": "未打卡"
        }
      }).then((res) => {
        console.log(res)
        if (res.rows != "") {
          var bqArr = []
          for (var i = 0; i < res.rows.length; i++) {
            console.log(i)
            bqArr.push({
              用户名: res.rows[i].用户名,
              排班打卡时间: res.rows[i].排班打卡时间,
              考勤类型: res.rows[i].考勤类型,
              工作日: res.rows[i].工作日.slice(0, 9),
              打卡结果: res.rows[i].打卡结果,
              补卡审核状态: res.rows[i].补卡审核状态,
              唯一标识: res.rows[i].唯一标识
            })
          }
          this.setData({
            arrData: bqArr
          })
        } else {
          wx.showToast({
            title: "暂时还没有可补签的数据",
            icon: 'none',
            duration: 2000,
            success:()=>{
              setTimeout(()=>{
                wx.navigateBack({delta:1})
              },2000)
            }
          },)
        }
      })
    })
  }
})