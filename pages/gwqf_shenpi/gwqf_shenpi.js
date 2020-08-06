
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
    qyqk_data: {
      qyqk_data_name:"",
      qyqk_data_nameid: "",
    },
    readBtn_type:false,//阅读显示隐藏
    readremake_value: ""//阅读内容
  },
  onLoad: function(options) {
    console.log(options)
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
      console.log(this.data.pageParams.urlid)
      return SysConfig.SubSystemData.request({ // 获取主表单行数据
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030146222",
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
            gwmc: res.rows[0].gwmc,
            zfsj: res.rows[0].zfsj,
            fj: res.rows[0].fj,
            onlynum: res.rows[0].onlynum,
            lconlynum: res.rows[0].xmlcid,
            jdbh: res.rows[0].currentLCxh,
            shzt: res.rows[0].shzt
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
    }).then((res)=>{
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
      return SysConfig.SubSystemData.request({ //签阅记录
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200317113731373146231",
          "XDLMA": this.data.pageParams.m_Onlynum,
        }, 
        method: "GET"
      })
      }).then((gwpeople)=>{
        let gwpeople_name = "";
        let gwpeople_id = "";
        let readpeople="";
      if (gwpeople.rows && gwpeople.rows.length > 0) {
        for (let i in gwpeople.rows) {
          if (i == gwpeople.rows.length-1){
            gwpeople_name += gwpeople.rows[i].人员 
            gwpeople_id += gwpeople.rows[i].人员ID
            }else{
              gwpeople_name += gwpeople.rows[i].人员 + ","
              gwpeople_id += gwpeople.rows[i].人员ID + ","
          }
          if (this.data.useData.mUserID == gwpeople.rows[i].人员ID) { //
            readpeople = gwpeople.rows[i].id
            
            if (this.data.rowidData.shzt == '已完成' && gwpeople.rows[i].是否已读 == "否") {
              this.setData({
                readBtn_type:true
              })
            }
          }
        }
      }
      this.setData({
        qyqk_data: {
          qyqk_data_name: gwpeople_name,
          qyqk_data_nameid: gwpeople_id,
          readpeople_id: readpeople
        }, 
      })
    })
  },
  radioJiedian: function(e) {
    this.setData({
      ht_jd: e.detail.value
    })
  },
  radioChange: function(e) {
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
  bindFormsubmit: function(e) {
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // let indexprevPage = pages[pages.length - 3];
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
                "XDLMTID": '9210',
                "XDLMSID": "9210001",
                "xmonlynum": this.data.rowidData.onlynum,
                "lconlynum": this.data.rowidData.lconlynum,
                "senderID": this.data.useData.mUserID,
                "jdbh": this.data.rowidData.jdbh,
                "recipientID": this.data.qyqk_data.qyqk_data_nameid
              },
              method: "GET"
            })
          } else {
            // if (prevPage != undefined || prevPage != null) {
            //   prevPage.onLoad();
            // }
            // if (indexprevPage != undefined || indexprevPage != null) {
            //   indexprevPage.onLoad();
            // }
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
      }).then((fsxx)=>{
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
  },
  readremake(e){
    this.setData({
      readdata: e.detail.value
    })
  },
  readBtn(e){
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "6000",
        "XDLMSID": "DYBH202003171137313731161235",
        "XDLMID": this.data.qyqk_data.readpeople_id,
        "XDLM是否已读": "是",
        "XDLM已读时间": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        "XDLM备注": this.data.readdata ? this.data.readdata : "已读",
      },
      method: "GET"
    }).then((res)=>{
      if (res.success){
        return SysConfig.SubSystemData.request({
          istoken: true,
          XKLX: "SYBGGL",
          XAction: "GetDataInterface",
          data: {
            XDLMCID: "6000",
            XDLMSID: "DYBH201908231020302030171325",
            XDLMID: this.data.pageParams.rowid,
            XDLMisComplete: "yes",
          },
          method: "GET"
        })
      }else{
        wx.showToast({
          title: "签阅失败",
          icon: 'none',
          duration: 1000,
          complete: () => {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      } 
    }).then((res)=>{
      if (res.success) {
        wx.showToast({
          title: "签阅成功",
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
          title: "签阅失败",
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
  }
})