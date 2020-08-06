
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
    ],
    steps: [],//所有步骤
    active: 0,//	当前步骤
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
          "XDLMSID": "DYBH2019082310203020307342",
          "XDLMA": this.data.pageParams.urlid,
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

  radioJiedian: function (e) {
    this.setData({
      ht_jd: e.detail.value
    })
  },
  radioChange: function (e) {
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
            wx.navigateBack({
              delta: 1
            });
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
            wx.navigateBack({
              delta: 1
            });
          }
        })
      })
    }
  },
  showfile(e) {
    SysConfig.Upload.downloadFile(e.currentTarget.dataset.id)
  }
})