
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
    steps: [],//所有步骤
    active: 0,//	当前步骤
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      pageParams: {
        rowid: options.id
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
          "XDLMSID": "DYBH2019082310203020307342",
          "XDLMA": this.data.pageParams.rowid,
        },
        method: "GET"
      })
    }).then((res) => {
      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
        // res.rows[0].contents = res.rows[0].contents.replace(/<[^>]+>/g, "");
        this.setData({
          rowidData: {
            creator: res.rows[0].creator,
            zfsj: res.rows[0].zfsj,
            gwmc: res.rows[0].gwmc,
            onlynum: res.rows[0].onlynum,
            title: res.rows[0].title,
            tgTime: res.rows[0].tgTime,
            depart: res.rows[0].depart,
            contents: res.rows[0].contents,
            tgDerection: res.rows[0].tgDerection
          },
            active: res.rows[0].currentLCxh - 1
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
      this.setData({
        lzyj_data: res
      })
      return SysConfig.SubSystemData.request({ // 获取附件内容
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200218104720472064331",
          "XDLMB": this.data.rowidData.onlynum,
        },
        method: "GET"
      })
    }).then((res) => {
      let _fliedata = [];
      if (res.rows && res.rows.length > 0) {
        for (let i in res.rows) {
          _fliedata.push({
            name: res.rows[i].文件名,
            path: res.rows[i].文件地址
          })
        }
        this.setData({
          filearray: _fliedata
        })
      } 
      return SysConfig.WorkflowManage.getWorkflowNodesState()
      }).then((res) => {
        this.setData({
          steps: res
        })
      })
  },
  showfile(e) {
    SysConfig.Upload.downloadFile(e.currentTarget.dataset.id)
  }
})