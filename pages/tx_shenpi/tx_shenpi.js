// pages/chuchaiDetail/chuchaiDetail.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    current: 1,
    xianyin: true,
    items: [{
      name: 'ok',
      value: '同意完成',
      checked: 'true'
    },
    {
      name: 'no',
      value: '不同意'
    }

    ]

  },

  radioJiedian: function (e) {

    var that = this
    console.log(e.detail.value)
    that.setData({
      jiedian: e.detail.value
    })
  },
  radioChange: function (e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'no') {
      that.setData({
        xianyin: false
      })
      // 退回节点操作：
      util.postData('SYBGGL', "GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH201908231020302030164411', //【wonlynum == 项目唯一编号】
        XDLMA: that.data.m_LConlynum,
        XDLMC: that.data.currentLCxh,
        XDLMD: that.data.currentLCxh,
      }, that.callbackTuihui);


      console.log(that.data.xianyin)
    } else {

      that.setData({
        xianyin: true
      })
      console.log(that.data.xianyin)
    }
  },

  // 审核通过接口：

  bindFormsubmit: function (e) {
    var that = this
    console.log(e.detail.value.textarea)
    that.setData({
      textareaCont: e.detail.value.textarea
    })
    console.log(that.data.xianyin)
    if (that.data.xianyin) {
      // 发送通过请求
      util.postData('SYBGGL', "GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH20190823102030203078271', //【wonlynum == 项目唯一编号】
        XDLMlcbh: that.data.m_LConlynum, //【XDLMjdbh == jdbh】当前节点编号 当前currentLCxh值  
        XDLMxmonlynum: that.data.m_Onlynum, //【XDLMxmonlynum == xmonlynum】项目唯一编号
        XDLMjdbh: that.data.currentLCxh, //【XDLMjdbh==jdbh】当前节点编号 当前currentLCxh值
        XDLMrunCons: "等待用户反馈", //【XDLMrunCons == runCons】固定值 即 XDLMrunCons = 等待用户反馈
      }, that.callbackPass);


    } else {
      // 发送退回请求
      util.postData('SYBGGL', "ExtFC", {
        XDLMCID: 'JumpToJD',
        wonlynum: that.data.m_Onlynum, //【wonlynum == 项目唯一编号】
        wLConlynum: that.data.m_LConlynum, //【wLCID == 流程ID】
        comPeopleID: that.data.mUserID, //【comPeopleID == 提交人mUserID】
        wQPYJ: that.data.textareaCont, //【wQPYJ == 签批意见】
        wJDBH: that.data.currentLCxh, //【wJDBH == 当前流程节点编号】
        wCHJDBH: that.data.jiedian //【wCHJDBH == 目标流程节点编号】
      }, that.callbackRefuse);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'mUserID',
      success: function (res) {
        that.setData({
          mUserID: res.data
        })
      },
    })

    // 输入传入id
    var id = options.id;
    var xmlcid = options.xmlcid
    var onlynum = options.onlynum
    var module = options.module
    var urlid = options.urlid
    console.log(urlid)

    // console.log(xmlcid, onlynum)
    var that = this;
    that.setData({
      id: id,
      m_LConlynum: xmlcid,
      m_Onlynum: onlynum,
      module: module,
      urlid: urlid

    })
    var that = this
    var sytoken;
    // 获取流转意见
    console.log(util)
    util.postData('SYBGGL', 'GetDataInterface', {
      XDLMCID: '1001',
      XDLMSID: 'DYBH2020021415275906564857',
      XDLMA: that.data.m_Onlynum, //主表唯一编号
      XDLMB: that.data.m_LConlynum

    }, that.callback)

    // 获取主表内容

    util.postData('SYBGGL', 'GetDataInterface', {
      XDLMCID: '1001',
      XDLMSID: 'DYBH201908231020302030159182',
      XDLMA: that.data.urlid,

    }, that.callbackCont)

    // 获取步骤图
    util.postData('SYBGGL', "GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: 'DYBH201908231020302030164411', //【wonlynum == 项目唯一编号】
      XDLMA: that.data.m_LConlynum
    }, that.callbackStep);


  },
  // 回调
  callback: function (res) {
    var that = this
    var arr = [];
    var arr1 = [];
    res = res.data.rows
    console.log(res)

    res.forEach(function (item, index) {
      if (index == 0) {
        arr.push({
          "biaoti": item['流程名称'],
          "name": "申请人:" + item['签批人'],
          "time": "申请时间:" + item['签批时间']
        })
      } else {
        arr1.push({
          "biaoti": item['流程名称'],
          "name": "审核人:" + item['签批人'],
          "dep": "部门:" + item['签批人部门'],
          "time": "签批时间:" + item['签批时间'],
          "yijian": "签批意见:" + item['签批意见'],
        })
      }



    })
    arr = arr.concat(arr1)
    that.setData({
      newsList: arr
    })
    console.log(that.data.newsList)
  },
  callbackCont: function (res) {
    console.log(res)
    var that = this
    res = res.data.rows
    res.forEach(function (item, index) {

      that.setData({
        leaveType: item.leaveType,
        creator: item.creator,
        startTime: item.startTime,
        endTime: item.endTime,
        leaveReason: item.leaveReason,
        depart: item.depart,
        leavenum:item.leavenum,
        currentLCxh: item.currentLCxh,
        isComplete: item['isComplete']

      })
    })
  },
  callbackPass: function (res) {
    console.log(res);
    wx.showToast({
      title: res.data.rows[0].runCons,
      icon: 'success',
      duration: 2000
    })
    wx.redirectTo ({
      url: '../daiwoshenpi/daiwoshenpi',
    })
    
    var that = this
    return util.postData('SYBGGL', "ExtFC", {
      XDLMCID: 'UserReturn',
      wonlynum: that.data.m_Onlynum, //【wonlynum == 项目唯一编号】
      wLConlynum: that.data.m_LConlynum, //【wLCID == 流程ID】
      comPeopleID: that.data.mUserID, //【comPeopleID == 完成人mUserID】
      wJDBH: that.data.currentLCxh, //【wJDBH == 流程节点编号】
      wGNBH: res.data.rows[0].funcID, //【wGNBH == 流程功能编号】流程功能编号只能为3或4
      wQPYJ: that.data.textareaCont //【wQPYJ == 签批意见】
    }, that.callbackfinal);
  },
  callbackfinal: function (res) {
    console.log(res)
  },
  // 退回节点的回调
  callbackTuihui: function (res) {
    let nameArr = [];
    let lastName, lastXh
    let xhArr = []
    console.log(res)
    var that = this;
    res = res.data.rows;
    console.log(res)
    var obj = {}
    res.forEach(function (item, index) {
      if (index != (res.length - 1)) {
        obj[item.Lc_xh] = item.Lc_name

      }
      lastName = item.Lc_name
      lastXh = item.Lc_xh


    })

    console.log(obj)
    that.setData({
      nameArr: obj,
      lastName: lastName,
      lastXh: lastXh,
      jiedian: lastXh
    })

  },
  // 退回节点退回按钮的回调
  callbackRefuse: function (res) {

    if (res.data.msg) {
      wx.showToast({
        title: '退回成功!',
        icon: 'success',
        duration: 2000
      })

    } else {
      wx.showToast({
        title: '退回失败！',
        icon: 'false',
        duration: 2000
      })
    }
    wx.redirectTo ({
      url: '../daiwoshenpi/daiwoshenpi',
    })

  },
  callbackStep: function (res) {
    console.log(res)

    res = res.data.rows
    // res.forEach(function (item, index) {
    //   res[index].Lc_xh


    // })

  }
})