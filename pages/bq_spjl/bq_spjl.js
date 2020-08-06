// pages/chuchaiDetail/chuchaiDetail.js
var SysConfig = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
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
  /**
   * 生命周期函数--监听页面加载
   */
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
        XKLX: "SYRSGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200313134640464089322",
          "XDLMA": this.data.pageParams.urlid,
        },
        method: "GET"
      })
    }).then((res) => {

      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
        this.setData({
          rowidData: {
            creator: res.rows[0].creator,
            gongzuori: res.rows[0]["工作日"],
            bukashijian: res.rows[0]["补卡时间"],
            leaveReason: res.rows[0]["备注"],
          }
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
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
        console.log(res)
        this.setData({
          backNode: res,
          ht_jd: res[0].Lc_xh
        })
        console.log(this.data.ht_jd)
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
      console.log(e.detail.value.wQPYJ)
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