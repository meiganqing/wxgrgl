
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    lzyj_data: [], //流转意见
    useData: { //用户数据
      mUserID: "",
      mUserName:"",
      mUserdepart:""
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
      qyqk_data_name: "",
      qyqk_data_nameid: "",
    },
    readBtn_type: false,//阅读显示隐藏
    readremake_value: ""//阅读内容
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

    SysConfig.UserInfo.GetUserDepart().then((res) => {
      this.setData({
        "useData.mUserdepart": res.data
      })
    })

    SysConfig.UserInfo.GetUserName().then((res) => {
      this.setData({
        "useData.mUserName": res.data
      })
    })
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        "useData.mUserID":res.data
      })
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
            rowid: res.rows[0].id, 
            creator: res.rows[0].creator, 
            gwmc: res.rows[0].gwmc,
            zfsj: res.rows[0].zfsj,
            fj: res.rows[0].fj,
            onlynum: res.rows[0].onlynum,
            lconlynum: res.rows[0].xmlcid,
            jdbh: res.rows[0].currentLCxh,
            funcID: res.rows[0].funcID,
            Lc_name: res.rows[0].Lc_name,
            zfsj: res.rows[0].zfsj,
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
    }).then((gwpeople) => {
      let gwpeople_name = "";
      let gwpeople_id = "";
      let readpeople = "";
      if (gwpeople.rows && gwpeople.rows.length > 0) {
        for (let i in gwpeople.rows) {
          if (i == gwpeople.rows.length - 1) {
            gwpeople_name += gwpeople.rows[i].人员
            gwpeople_id += gwpeople.rows[i].人员ID
          } else {
            gwpeople_name += gwpeople.rows[i].人员 + ","
            gwpeople_id += gwpeople.rows[i].人员ID + ","
          }
          if (this.data.useData.mUserID == gwpeople.rows[i].人员ID) { //
            readpeople = gwpeople.rows[i].id
            if (this.data.rowidData.shzt == '已完成' && gwpeople.rows[i].是否已读 == "否") {
              this.setData({
                readBtn_type: true
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
    let that=this
    if (that.data.xianyin) {
      // 1. 获取下步节点信息 
     SysConfig.SubSystemData.request({ 
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030164411",
          "XDLMA": that.data.rowidData.lconlynum,
          "XDLME": that.data.rowidData.jdbh,
          "XDLMD": that.data.rowidData.jdbh,
          "page": "1",
          "rows": "1"
        },
        method: "GET"
     }).then((lc_next_node_msg)=>{
        if (lc_next_node_msg.rows && lc_next_node_msg.rows.length > 0){
          that.setData({
            lc_next_node_msg:{
              Lc_xh: lc_next_node_msg.rows[0].Lc_xh
            }
          })
          SysConfig.SubSystemData.request({ //2. 获取下步节点审核人
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": "1001",
                "XDLMSID": "DYBH201908231020302030189261",
                "XDLMA": that.data.rowidData.lconlynum,
                "XDLMB": that.data.rowidData.jdbh,
                "XDLMC": "3,4"
              },
              method: "GET"
            }).then((lc_next_node_auditor)=>{
              if (lc_next_node_auditor.rows && lc_next_node_auditor.rows.length > 0){
                that.setData({
                  lc_next_node_auditor:{
                    runPeoID: lc_next_node_auditor.rows[0].runPeoID,
                    Lc_xh: lc_next_node_auditor.rows[0].Lc_xh
                  }
                })
                SysConfig.SubSystemData.request({  //5.  添加节点功能执行记录表
                  istoken: true,
                  XKLX: "SYBGGL",
                  XAction: "GetDataInterface",
                  data: {
                    "XDLMCID": "5000",
                    "XDLMSID": "DYBH20190823102030203065273",
                    "XDLMlcbh": that.data.rowidData.lconlynum, //流程唯一编码
                    "XDLMjdbh": that.data.rowidData.jdbh, //节点序号
                    "XDLMfuncID": that.data.rowidData.funcID, //功能编号
                    "XDLMrunTime": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
                    "XDLMrunPeo": that.data.useData.mUserName,
                    "XDLMrunCons": "完成",
                    "XDLMxmonlynum": that.data.rowidData.onlynum
                  },
                  method: "GET"
                }).then(()=>{

                  console.log(that.data.useData)
                  return SysConfig.SubSystemData.request({  // 7.添加节点完成表
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      "XDLMCID": "5000",
                      "XDLMSID": "DYBH2019082310203020306423",
                      "XDLMcom_person": that.data.useData.mUserName,
                      "XDLMcom_time": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
                      "XDLMjdxh": that.data.rowidData.jdbh, //节点编号
                      "XDLMxmlcmc": that.data.rowidData.Lc_name, //流程名
                      "XDLMxmlclx": that.data.rowidData.lconlynum, //流程唯一编码
                      "XDLMxmaddPerson": that.data.rowidData.creator,
                      "XDLMxmaddTime": that.data.rowidData.zfsj,
                      "XDLMcondepart": that.data.useData.mUserdepart,
                      "XDLMonlynum": that.data.rowidData.onlynum,
                      "XDLMconstat": "已完成",
                    },
                    method: "GET"
                  })
                }).then(()=>{
                  console.log(that.data.useData)
                  return SysConfig.SubSystemData.request({ // 6.添加签批表
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      "XDLMCID": "5000",
                      "XDLMSID": "DYBH20190823102030203078343",
                      "XDLMonlynum": that.data.rowidData.onlynum,
                      "XDLMLc_id": that.data.rowidData.lconlynum, //流程唯一编码
                      "XDLMjd": that.data.rowidData.jdbh, //节点编号
                      "XDLMqpr": that.data.useData.mUserName,
                      "XDLMqprbm": that.data.useData.mUserdepart,
                      "XDLMqpyj": e.detail.value.wQPYJ ? e.detail.value.wQPYJ: "同意",
                      "XDLMqpsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
                    },
                    method: "GET"
                  })
                }).then(()=>{
                  return SysConfig.SubSystemData.request({  //3. 向下一步审核人发送站内消息
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      XDLMCID: '9000',
                      XDLMTID: '9210',
                      XDLMSID: '9210001',
                      xmonlynum: that.data.rowidData.onlynum, //项目唯一编码
                      lconlynum: that.data.rowidData.lconlynum, //流程唯一编码
                      jdbh:that.lc_next_node_msg.Lc_xh, //节点编号
                      senderID: that.data.useData.mUserID,
                      recipientID: that.data.lc_next_node_auditor.runPeoID
                    },
                    method: "GET"
                  })
                }).then(()=>{
                  return SysConfig.SubSystemData.request({//修改表单  
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      XDLMCID: '6000',
                      XDLMSID: 'DYBH201908231020302030135225',
                      XDLMID: that.data.pageParams.urlid,
                      XDLMshr: that.data.lc_next_node_auditor.runPeoID, //流程配置中的审核人
                      XDLMcurrentLCxh: that.data.lc_next_node_auditor.Lc_xh, //流程序号
                    },
                    method: "GET"
                  })
                }).then(()=>{
                  SysConfig.SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      "XDLMCID": '6000',
                      "XDLMSID": 'DYBH201908231020302030171325',
                      "XDLMID": that.data.pageParams.rowid,
                      "XDLMisComplete": "yes",
                    },
                    method: "GET"
                  })
                  wx.showToast({
                    title: "已提交，请等待" + that.data.lc_next_node_auditor.runPeoID + "审核或反馈！",
                    icon: 'success',
                    duration: 1000,
                    complete: () => {
                      wx.navigateBack({
                        delta:1
                    })
                    }
                  })
                }).catch(()=>{
                  wx.showToast({
                    title: "审批失败",
                    icon: 'none',
                    duration: 1000,
                    complete: () => {
                      wx.navigateBack({
                        delta:1
                    })
                    }
                  })
                })
              }else{
                wx.showToast({
                  title: "未找到节点审核人 ",
                  icon: 'none',
                  duration: 1000,
                  complete: () => {
                    wx.navigateBack({
                      delta:1
                  })
                  }
                }) 
              }
            })  
        }else{
          SysConfig.SubSystemData.request({
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": "1001",
              "XDLMSID": "DYBH20200317113731373146231",
              "XDLMA": that.data.rowidData.onlynum
            },
            method: "GET"
          }).then((gwcy_ry) => {
            if (gwcy_ry.rows && gwcy_ry.rows.length > 0) {
              for (let i in gwcy_ry.rows) {
                if (gwcy_ry.rows[i].是否已读 == "否") {
                  that.data.gwcy_next_node_ry_name = gwcy_ry.rows[i].人员
                  that.data.gwcy_next_node_ry_id = gwcy_ry.rows[i].人员ID
                  break;
                }
              }
            }
            console.log(that.data.useData)
            return SysConfig.SubSystemData.request({  // 6.添加签批表
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": '5000',
                "XDLMSID": 'DYBH20190823102030203078343',
                "XDLMonlynum": that.data.rowidData.onlynum,
                "XDLMLc_id": that.data.rowidData.lconlynum, //流程唯一编码
                "XDLMjd": that.data.rowidData.jdbh, //节点编号
                "XDLMqpr": that.data.useData.mUserName,
                "XDLMqprbm": that.data.useData.mUserdepart,
                "XDLMqpyj": e.detail.value.wQPYJ ? e.detail.value.wQPYJ : "同意",
                "XDLMqpsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
              },
              method: "GET"
            })
          }).then(() => {
            return SysConfig.SubSystemData.request({  //3. 向下一步审核人发送站内消息
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                XDLMCID: '9000',
                XDLMTID: '9210',
                XDLMSID: '9210001',
                xmonlynum: that.data.rowidData.onlynum, //项目唯一编码
                lconlynum: that.data.rowidData.lconlynum, //流程唯一编码
                jdbh: that.data.rowidData.jdbh, //节点编号
                senderID: that.data.useData.mUserID,
                recipientID: that.data.gwcy_next_node_ry_id
              },
              method: "GET"
            })
          }).then(() => {
            return SysConfig.SubSystemData.request({  // 6.添加签批表
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": '6000',
                "XDLMSID": 'DYBH201908231020302030135225',
                "XDLMID": that.data.pageParams.urlid,
                "XDLMshzt": "已完成",
              },
              method: "GET"
            })
          }).then(() => {
            SysConfig.SubSystemData.request({
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": '6000',
                "XDLMSID": 'DYBH201908231020302030171325',
                "XDLMID": that.data.pageParams.rowid,
                "XDLMisComplete": "yes",
              },
              method: "GET"
            })
            wx.showToast({
              title: "审批完成，传阅给" + that.data.gwcy_next_node_ry_name,
              icon: 'success',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta:1
              })
              }
            })
          }).catch(() => {
            wx.showToast({
              title: "审批失败",
              icon: 'none',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta:1
              })
              }
            })
          })
        }
      })
    } else {
      SysConfig.SubSystemData.request({   // 6.添加签批表
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": '5000',
          "XDLMSID": 'DYBH20190823102030203078343',
          "XDLMonlynum": that.data.rowidData.onlynum,
          "XDLMLc_id": that.data.rowidData.lconlynum, //流程唯一编码
          "XDLMjd": that.data.rowidData.jdbh, //节点编号
          "XDLMqpr": that.data.useData.mUserName,
          "XDLMqprbm": that.data.useData.mUserdepart,
          "XDLMqpyj": e.detail.value.wQPYJ ? e.detail.value.wQPYJ : "不同意",
          "XDLMqpsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
        },
        method: "GET"
      }).then(()=>{
        if (that.data.ht_jd =="1"){
          SysConfig.SubSystemData.request({  //修改表单
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": '6000',
              "XDLMSID": 'DYBH201908231020302030135225',
              "XDLMID": this.data.pageParams.urlid,
              "XDLMshr": "",
              "XDLMcurrentLCxh": this.data.ht_jd,
              "XDLMshzt": "待提交",
            },
            method: "GET"
          }).then(() => {
            SysConfig.SubSystemData.request({
              istoken: true,
              XKLX: "SYBGGL",
              XAction: "GetDataInterface",
              data: {
                "XDLMCID": '6000',
                "XDLMSID": 'DYBH201908231020302030171325',
                "XDLMID": that.data.pageParams.rowid,
                "XDLMisComplete": "yes",
              },
              method: "GET"
            })
            wx.showToast({
              title: "审批完成",
              icon: 'success',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta:1
              })
              }
            })
          }).catch(() => {
            wx.showToast({
              title: "流程失败",
              icon: 'none',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta:1
              })
              }
            })
          }) 
        }else{
          SysConfig.SubSystemData.request({   //2. 获取上步节点审核人
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": '1001',
              "XDLMSID": 'DYBH201908231020302030189261',
              "XDLMA": this.data.rowidData.lconlynum,
              "XDLMB": this.data.ht_jd,
              "XDLMC": "3,4"
            },
            method: "GET"
          }).then((lc_next_node_auditor)=>{
            if (lc_next_node_auditor.rows && lc_next_node_auditor.rows.length > 0){
              SysConfig.SubSystemData.request({   //3. 向上一步审核人发送站内消息
                  istoken: true,
                  XKLX: "SYBGGL",
                  XAction: "GetDataInterface",
                  data: {
                    "XDLMCID": '9000',
                    "XDLMTID": '9210',
                    "XDLMSID": '9210001',
                    "xmonlynum": this.data.rowidData.onlynum, //项目唯一编码
                    "lconlynum": this.data.rowidData.lconlynum, //流程唯一编码
                    "jdbh": this.data.ht_jd, //节点编号
                    "senderID": this.data.useData.mUserName,
                    "recipientID": lc_next_node_auditor.rows[0].runPeoID
                  },
                  method: "GET"
                }).then(()=>{
                  return SysConfig.SubSystemData.request({ //修改表单
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      "XDLMCID": '6000',
                      "XDLMSID": 'DYBH201908231020302030135225',
                      "XDLMID": this.data.pageParams.urlid,
                      "XDLMshr": lc_next_node_auditor.rows[0].runPeo,
                      "XDLMcurrentLCxh": this.data.ht_jd
                    },
                    method: "GET"
                  })
                }).then(()=>{
                  SysConfig.SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                      "XDLMCID": '6000',
                      "XDLMSID": 'DYBH201908231020302030171325',
                      "XDLMID": that.data.pageParams.rowid,
                      "XDLMisComplete": "yes",
                    },
                    method: "GET"
                  })
                  wx.showToast({
                    title: "审批完成",
                    icon: 'success',
                    duration: 1000,
                    complete: () => {
                      wx.navigateBack({
                        delta:1
                    })
                    }
                  })
                }).catch(() => {
                  wx.showToast({
                    title: "流程失败",
                    icon: 'none',
                    duration: 1000,
                    complete: () => {
                      wx.navigateBack({
                        delta:1
                    })
                    }
                  })
                })
             }else{
                wx.showToast({
                  title: "流程失败",
                  icon: 'none',
                  duration: 1000,
                  complete: () => {
                    wx.navigateBack({
                      delta:1
                  })
                  }
                })
             }
          }).catch(()=>{
            wx.showToast({
              title: "流程失败",
              icon: 'none',
              duration: 1000,
              complete: () => {
                wx.navigateBack({
                  delta:1
              })
              }
            })
          }) 
        }     
      })
    }
  },
  showfile(e) {
    SysConfig.Upload.downloadFile(e.currentTarget.dataset.id)
  },
  readremake(e) {
    this.setData({
      readdata: e.detail.value
    })
  },
  readBtn(e) {
    let gwcy_next_node_ry_name;
    let gwcy_next_node_ry_id;
    let gwcy_next_readnode_ry_id;
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH20200317113731373146231",
        "XDLMA": this.data.rowidData.onlynum
      },
      method: "GET"
    }).then((gwcy_ry)=>{
      if (gwcy_ry.rows && gwcy_ry.rows.length > 0){
        for (let i in gwcy_ry.rows) {
          if (this.data.useData.mUserID == gwcy_ry.rows[i].人员ID) {
            gwcy_next_readnode_ry_id = gwcy_ry.rows[i].id //当前阅读人id
            break;
          }
        }
        for (let i in gwcy_ry.rows) {
          if (gwcy_ry.rows[i].是否已读 == "否" && this.data.useData.mUserID != gwcy_ry.rows[i].人员ID) {
            gwcy_next_node_ry_name = gwcy_ry.rows[i].人员
            gwcy_next_node_ry_id = gwcy_ry.rows[i].人员ID
            break;
          }
        }
      }
      if (gwcy_next_node_ry_name){
        SysConfig.SubSystemData.request({
          istoken: true,
          XKLX: "SYBGGL",
          XAction: "GetDataInterface",
          data: {
            XDLMCID: '9000',
            XDLMTID: '9210',
            XDLMSID: '9210001',
            xmonlynum: this.data.rowidData.onlynum, //项目唯一编码
            lconlynum: this.data.rowidData.lconlynum, //流程唯一编码
            jdbh: this.data.rowidData.jdbh, //节点编号
            senderID: this.data.useData.mUserID,
            recipientID: gwcy_next_node_ry_id
          },
          method: "GET"
        })
      }

      SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "6000",
          "XDLMSID": "DYBH202003171137313731161235",
          "XDLMID": gwcy_next_readnode_ry_id,
          "XDLM是否已读": "是",
          "XDLM已读时间": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
          "XDLM备注": this.data.readdata ? this.data.readdata : "已读",
        },
        method: "GET"
      }).then((res) => {
        if (res.success) {
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
        } else {
          wx.showToast({
            title: "签阅失败",
            icon: 'none',
            duration: 1000,
            complete: () => {
              wx.navigateBack({
                delta:1
            })
            }
          })
        }
      }).then((res) => {
          wx.showToast({
            title: "签阅成功",
            icon: 'success',
            duration: 1000,
            complete: () => {
              wx.navigateBack({
                delta:1
            })
            }
          })
      }).catch(()=>{
        wx.showToast({
          title: "签阅失败",
          icon: 'none',
          duration: 1000,
          complete: () => {
            wx.navigateBack({
              delta:1
          })
          }
        })
      })
    })
  }
})