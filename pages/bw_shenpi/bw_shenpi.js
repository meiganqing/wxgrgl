
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    lzyj_data: [], //流转意见
    useData: { //用户数据
      mUserID: null,
      creator:null
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
    fileid:"",//附件类型
    bw_last:false,
    _bwbh:"",
    _bwfcrq:"", 
    nbrq_show: false,
    nbrq_data:"",
  },
  onLoad: function(options) {
    this.setData({
      pageParams: {
        rowid: options.id,
        m_LConlynum: options.xmlcid,
        m_Onlynum: options.onlynum,
        module: options.module,
        urlid: options.urlid,
      },
      _bwfcrq: SysConfig.ToolBox.CurrentDate(),
      nbrq_data: new Date().getTime()
    })
    // 获取人名
    SysConfig.UserInfo.GetUserName().then((res) => {
      this.setData({
         useData: {
           creator: res.data
        }
      })
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
          "XDLMSID": "DYBH20190823102030203025232",
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
            zfsj: res.rows[0].zfsj,
            gwmc: res.rows[0].gwmc,
            onlynum: res.rows[0].onlynum, 
            title: res.rows[0].title,
            types: res.rows[0].types,
            chaosr: res.rows[0].chaosr,
            secretDegree: res.rows[0].secretDegree,
            sendUnit: res.rows[0].sendUnit,
            chaobao: res.rows[0].chaobao,
            nbrq: res.rows[0].nbrq,
            remark: res.rows[0].remark,
            fcrq: res.rows[0].fcrq,
            nbdw: res.rows[0].nbdw,
            nbr: res.rows[0].nbr,
            depart: res.rows[0].depart
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
        if (this.data.active == res.length-1){
          this.setData({
            fileid: res[this.data.active].text,
            steps: res,
            bw_last:true
          })
        }else{
          this.setData({
            fileid: res[this.data.active].text,
            steps: res
          })
        }
      })
  },
  //报文编号
  _bwbh_change(e) {
    this.setData({
      _bwbh: e.detail
    })
  },
  //发出时间
  _bwfcrq_change(){
    this.setData({
      nbrq_show: true
    })
  },
  nbrq_confirm(e) {
    this.setData({
      nbrq_data: e.detail,
      nbrq_show: false,
      _bwfcrq: SysConfig.ToolBox.transTime(e.detail)
    });
  },
  nbrq_cancel() {
    this.setData({
      nbrq_show: false
    });
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
  bindFormsubmit: function(e) {
    if (this.data.xianyin) {
      // 发送通过请求
      SysConfig.WorkflowManage.complete(e.detail.value.wQPYJ).then((res) => {
        console.log(res)
        if (this.data.bw_last){
          SysConfig.SubSystemData.request({ // 获取附件内容
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": "6000",
              "XDLMSID": "DYBH2019082310203020304435",
              "XDLMID": this.data.pageParams.urlid,
              "XDLMbh": this.data._bwbh,
              "XDLMfcrq": this.data._bwfcrq,
            },
            method: "GET"
          })
        }
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
      console.log(e.detail.value.wQPYJ)
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
  },
  // 上传文件
  upload: function (e) {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res)
        let filenandp = {};
        filenandp.name = res.tempFiles[0].name
        filenandp.size = res.tempFiles[0].size
        filenandp.type = res.tempFiles[0].type
        SysConfig.Upload.upLoadFile(res.tempFiles[0].path, res.tempFiles[0].name).then((res) => {
          filenandp.path = JSON.parse(res.data).filepath

          return SysConfig.SubSystemData.request({ //添加附件
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": '5000',
              "XDLMSID": 'DYBH202002181047204720151333',
              "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
              "XDLM关联编号": that.data.rowidData.onlynum,
              "XDLM文件名": filenandp.name,
              "XDLM原文件名": filenandp.name,
              "XDLM文件地址": filenandp.path,
              "XDLM文件大小": filenandp.size,
              "XDLM文件类型": filenandp.type,
              "XDLM类型": that.data.fileid,
              "XDLM添加人": that.data.useData.creator
            },
            method: "GET"
          })
        }).then((res)=>{
          if (res.success){
            let allfile = []
            allfile = that.data.filearray
            allfile.push(filenandp)
            that.setData({
              filearray: allfile
            });
          }
        })
      }
    })
  },
})
