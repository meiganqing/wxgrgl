// pages/vactionDetail/vactionDetail.js
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  detailUrl: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var xmlcid = e.currentTarget.dataset.xmlcid
    var onlynum = e.currentTarget.dataset.onlynum
    var module = e.currentTarget.dataset.module
    var urlid = e.currentTarget.dataset.url
    urlid = urlid.match(/id=(\S*)/);
   
    wx.navigateTo({
      url: '../qj_shenpi/qj_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
    })
  },
  tiaoUrl: function() {
    wx.navigateTo({

      url: '../qj_add/qj_add'
    })
  },
  onLoad: function() {
    var mUserName;    
    var sytoken; 
    var res = []; 
    var ress = [];  
    var that = this
    wx.getStorage({      
      key: 'mUserName',
            success: function(res) {    

        mUserName = res.data
        wx.getStorage({
          key: 'sytoken',
          success: function(res) {

            sytoken = res.data
            wx.request({
              url: 'http://117.34.118.124:9988/xdData/xdDataManage.ashx?XAction=GetDataInterface&XKLX=SYBGGL' + '&XDLMSID=DYBH201908231020302030130321&XDLMC=' + mUserName + '&XDLMCID=1001'+'&XDLME=no'+'&XDLMF=no',
              method: 'GET',
              header: {
                'Authorization': sytoken
              },
              success: function(res) {
                res = res.data.rows
                that.setData({
                  res: res
                })
              }
            })      
          }
        })
      }   
    })


    
  }

})