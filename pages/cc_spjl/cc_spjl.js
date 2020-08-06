
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    lzyj_data: [], //流转意见
    useData: { //用户数据
      mUserID: null
    },
    pageParams: {}, //页面参数
    rowidData: {}, //单行数据
    backNode: [], //退回节点数据渲染
    ht_jd: null, //回退节点
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
  onLoad: function (options) {
    this.setData({
      pageParams: {
        rowid: options.id,
        m_LConlynum: options.xmlcid,
        m_Onlynum: options.onlynum,
        module: options.module,
        urlid: options.urlid,
      }
    })
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        useData: {
          mUserID: res.data
        }
      })
      return SysConfig.SubSystemData.request({ // 获取主表单行数据
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20190823102030203013692",
          "XDLMA": this.data.pageParams.urlid,
        },
        method: "GET"
      })
    }).then((res) => {
      console.log(res)
      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
        this.setData({
          rowidData: {
            creator: res.rows[0].creator,
            depart: res.rows[0].depart,
            type: res.rows[0].type,
            xmmc: res.rows[0].xmmc,
            ccry: res.rows[0]["出差人员"],
            coMedia: res.rows[0].coMedia,
            jingfei: res.rows[0].SourcesFunding,
            xmbh: res.rows[0].xmbh,
            cfcs: res.rows[0].sCity,
            mdcs: res.rows[0].eCity,
            sTime: res.rows[0].sTime,
            eTime: res.rows[0].eTime,
            reason: res.rows[0].reason
          }
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        lzyj_data: res
      })
    })
  },
  radioJiedian: function (e) {
    this.setData({
      ht_jd: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'no') {
      this.setData({
        xianyin: false
      })
      SysConfig.WorkflowManage.getRollbackNodeList().then((res) => {
        this.setData({
          backNode: res,
          ht_jd: res[0].Lc_xh
        })
      })
    } else {
      this.setData({
        xianyin: true
      })
    }
  },
  // 审核通过接口：
  bindFormsubmit: function (e) {
  
    if (this.data.xianyin) {
      // 发送通过请求
      SysConfig.WorkflowManage.complete(e.detail.value.wQPYJ).then((res) => {
        console.log(res)
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1000,
          complete: () => {
            wx.reLaunch({
              url: '../daiwoshenpi/daiwoshenpi',
            })
          }
        })

      })
    } else {
      // 发送退回请求
      SysConfig.WorkflowManage.gotoNode(e.detail.value.wQPYJ, this.data.ht_jd).then((res) => {
        console.log(res)
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1000,
          complete: () => {
            wx.reLaunch({
              url: '../daiwoshenpi/daiwoshenpi',
            })
          }
        })
      })
    }
  }
})