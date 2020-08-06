
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
    steps: [],//所有步骤
    active: 0,//	当前步骤
    // activeNames: [],
    qyqk_data: {
      qyqk_data_name:"",
      qyqk_data_nameid: "",
      readpeople_id:""
    },
    readremake_value: ""//阅读内容
  },
  onLoad: function(options) {
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
          "XDLMSID": "DYBH202007101118581858144452",
          "XDLMA": this.data.pageParams.urlid,
        },
        method: "GET"
      })
      
    }).then((res) => {
      if (res.rows) {
        this.setData({
          rowidData:res.rows[0],
        })
        return SysConfig.SubSystemData.request({ // 获取流转意见
          istoken: true,
          XKLX: "SYBGGL",
          XAction: "GetDataInterface",
          data: {
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200317113731373146231",
            "XDLMA": this.data.rowidData.onlynum,
          },
          method: "GET"
        })
      }
    }).then((rydata) => {
      let yiarr=[]
      let lcarr=[{
        text:"发起申请"
      }]
      yiarr.push({
        biaoti:"公文流转申请",
        name:`申请人【${this.data.rowidData.creator}】`,
        time:`申请时间【${this.data.rowidData['添加时间']}】`
      })
      if(rydata.rows && rydata.rows.length > 0){
          for(let i=0;i<rydata.rows.length;i++){
            if(rydata.rows[i]['是否已读']== "是"){
              if(i==0){
                yiarr.push({
                  biaoti:rydata.rows[i]['人员']+"审核",
                  name:`审核人【${rydata.rows[i]['人员']}】`,
                  dep:`部门【${rydata.rows[i]['部门']}】`,
                  tixing_time:`提醒时间【${this.data.rowidData['添加时间']}】`,
                  yijian:`签批意见【${rydata.rows[i]['备注']}】`,
                  time:`签批时间【${rydata.rows[i]['已读时间']}】`
                })
              }else{
                yiarr.push({
                  biaoti:rydata.rows[i]['人员']+"审核",
                  name:`审核人【${rydata.rows[i]['人员']}】`,
                  dep:`部门【${rydata.rows[i]['部门']}】`,
                  tixing_time:`提醒时间【${rydata.rows[i-1]['已读时间']}】`,
                  yijian:`签批意见【${rydata.rows[i]['备注']}】`,
                  time:`签批时间【${rydata.rows[i]['已读时间']}】`
                })
              }
            }
            lcarr.push({
              text: rydata.rows[i]['人员']
            }) 
          }

          for (let i = 0; i < rydata.rows.length; i++) {
              if (rydata.rows[i].是否已读 == "否") {
                  this.setData({
                    active:  i + 1,
                  })
                  break;
              }
          }
          
          for (let i = 0; i < rydata.rows.length; i++) {
            if (this.data.useData.mUserID==rydata.rows[i].人员ID) {
                this.setData({
                  ['qyqk_data.readpeople_id']:rydata.rows[i].id
                })
                break;
            }
          }
          for (let i = 0; i < rydata.rows.length; i++) {
            if (rydata.rows[i].是否已读 == "否" &&this.data.useData.mUserID!=rydata.rows[i].人员ID) {
                this.setData({
                  ["qyqk_data.qyqk_data_name"]:rydata.rows[i].人员,
                  ["qyqk_data.qyqk_data_nameid"]:rydata.rows[i].人员ID
                })
                break;
            }
          }
      }
      this.setData({
        lzyj_data: yiarr,
        steps:lcarr
      })
      return SysConfig.SubSystemData.request({ // 附件
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200218104720472064331",
          "XDLMB": this.data.rowidData.onlynum
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

    })
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
    if(this.data.qyqk_data.qyqk_data_name){
      SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID":"9000",
          "XDLMTID":"9210",
          "XDLMSID":"9210001",
          "xmonlynum":this.data.rowidData.onlynum,
          "lconlynum":this.data.rowidData.xmlcid,
          "jdbh":"2",
          "senderID": this.data.useData.mUserID,
          "recipientID": this.data.qyqk_data.qyqk_data_nameid
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
        if(this.data.qyqk_data.qyqk_data_name){
          wx.showToast({
            title: "已传阅给"+this.data.qyqk_data.qyqk_data_name,
            icon: 'success',
            duration: 1000,
            complete: () => {
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                });
              },1000)
            }
          })
        }else{
          SysConfig.SubSystemData.request({
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              XDLMCID: "6000",
              XDLMSID: "DYBH202007101118581858193455",
              XDLMID: this.data.pageParams.urlid,
              XDLMshzt: "已完成",
            },
            method: "GET"
          })
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
        }
      
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