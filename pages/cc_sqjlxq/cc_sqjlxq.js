
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
    ht_jd: null,//回退节点
    current: 1,
    xianyin: true,
    steps: [],//所有步骤
    active: 0,//	当前步骤
  },
  onLoad: function (options) {
    this.setData({
      pageParams: {
        rowid: options.id,
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
          "XDLMA": this.data.pageParams.rowid,
        },
        method: "GET"
      })
    }).then((res) => {
      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化

        this.setData({
          rowidData: {
            creator: res.rows[0].creator,
            depart: res.rows[0].depart,
            type: res.rows[0].type,
            ccry: res.rows[0]["出差人员"],
            coMedia: res.rows[0].coMedia,
            jingfei: res.rows[0].SourcesFunding,
            xmmc: res.rows[0].xmmc,
            xmbh: res.rows[0].xmbh,
            cfcs: res.rows[0].sCity,
            mdcs: res.rows[0].eCity,
            sTime: res.rows[0].sTime,
            eTime: res.rows[0].eTime,
            reason: res.rows[0].reason
          },
          active: res.rows[0].currentLCxh - 1
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
      this.setData({
        lzyj_data: res
      })
      // console.log(this.data.lzyj_data,111111111111111111111)
      return SysConfig.WorkflowManage.getWorkflowNodesState()
    }).then((res) => {
      this.setData({
        steps: res
      })
    })
  }
})