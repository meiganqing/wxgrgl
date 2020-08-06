
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
    ts_lyarr: [],
    ht_jd: null,//回退节点
    current: 1,
    xianyin: true,
    steps: [],//所有步骤
    active: 0,//	当前步骤
    activeNames: [],
    qyqk_data: []
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
          "XDLMSID": "DYBH20190823102030203025622",
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
            sqTime: res.rows[0].sqTime,
            yongtu: res.rows[0].yongtu,
            onlynum: res.rows[0].onlynum
          },
          active: res.rows[0].currentLCxh - 1
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
      this.setData({
        lzyj_data: res
      })
      return SysConfig.WorkflowManage.getWorkflowNodesState()
    }).then((res) => {
      this.setData({
        steps: res
      })
      return SysConfig.SubSystemData.request({ 
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200218170244244246381",
          "XDLMA": this.data.rowidData.onlynum
        },
        method: "GET"
      })
    }).then((res) => {
      let _fliedata = [];
      if (res.rows && res.rows.length > 0) {
        for (let i in res.rows) {
          _fliedata.push({
            book_name: res.rows[i].图书,
            book_num: res.rows[i].申请数
          })
        }
        this.setData({
          ts_lyarr: _fliedata
        })
      }
    })
  }
})