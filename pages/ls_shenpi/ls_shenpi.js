
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
    ts_lyarr:[],
    ht_jd: null, //回退节点
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
    // activeNames: [],
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
          "XDLMSID": "DYBH20190823102030203025622",
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
      return SysConfig.WorkflowManage.getWorkflowNodesState()//步骤图
    }).then((res) => {
      this.setData({
        steps: res
      })
      return SysConfig.SubSystemData.request({ // 获取领书内容
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200218170244244246381",
          "XDLMA": this.data.rowidData.onlynum,
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
  bindFormsubmit: function (e) {
    if (this.data.xianyin) {
      SysConfig.WorkflowManage.complete(e.detail.value.wQPYJ).then((completemsg) => {
        if (completemsg.msg) {
          if (completemsg.message == "流程已完成！") {
            return SysConfig.SubSystemData.request({ //签阅记录
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": '9000',
                "XDLMTID": '9203',
                "XDLMSID": "9203003",
                "关联编号": this.data.rowidData.onlynum
              },
              method: "GET"
            })
          } else {
            wx.showToast({
              title: completemsg.message,
              icon: 'success',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta: 1
                });
              }
            })
          }
        } else {
          wx.showToast({
            title: "流程失败",
            icon: 'none',
            duration: 1000,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          })
        }
      }).then((fsxx) => {
        if (fsxx.success) {
          wx.showToast({
            title: "审批完成",
            icon: 'success',
            duration: 1000,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          })
        } else {
          wx.showToast({
            title: "流程失败",
            icon: 'none',
            duration: 1000,
            complete: () => {
              wx.navigateBack({
                delta: 1
              });
            }
          })
        }
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
  }
})