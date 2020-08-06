var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "", //库内编码
    creator: "", //登录人名称
    creatorid: "", //登录人id
    depart: "", //登录人部门
    _title: "", //文件标题
    nbrq: "", //拟办日期
    nbrq_data: "",
    nbrq_show: false, //日期弹框
    gw_zl_radio_arr: [], //公文种类
    gw_smcd_radio_arr: [], //涉密程度
    gw_zl_radio: "请示", //公文种类选中
    gw_smcd_radio: "普通", //涉密程度选中
    bw_zs: "", //主送
    bw_cs: "", //抄送
    bw_cb: "", //抄报
    bw_bz: "", //备注
    filearray: [], //附件数组
    rowiddata: {
      rowid: ""
    },
  },
  onLoad: function (options) {
    if (!options.id) {
      this.setData({
        judge_id: ""
      })
    } else {
      this.setData({
        judge_id: options.id
      })
    }
    //公文种类  涉密程度
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        XDLMCID: '1001',
        XDLMSID: 'DYBH202002181357205720121351',
        XDLMA: "公文种类,涉密程度"
      },
      method: "GET"
    }).then((typeadsm) => {
      if (typeadsm.rows && typeadsm.rows.length > 0) {
        let gwzl = []
        let smcd = []
        for (let i in typeadsm.rows) {
          if (typeadsm.rows[i].统计项目 == "公文种类") {
            gwzl.push(typeadsm.rows[i].统计内容)
          } else if (typeadsm.rows[i].统计项目 == "涉密程度") {
            smcd.push(typeadsm.rows[i].统计内容)
          }
        }
        this.setData({
          gw_zl_radio_arr: gwzl,
          gw_smcd_radio_arr: smcd
        })
      }
    })
    if (options.id) {
      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20190823102030203025232",
          "XDLMA": options.id
        },
        method: "GET" //请求方式  目前接口先暂时全部使用get方式
      }).then((res) => {
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          _title: res.rows[0].title,
          nbrq: res.rows[0].nbrq,
          nbrq_data: new Date(res.rows[0].nbrq).getTime(),
          gw_zl_radio: res.rows[0].types,
          gw_smcd_radio: res.rows[0].secretDegree,
          bw_zs: res.rows[0].sendUnit,
          bw_cs: res.rows[0].chaosr,
          bw_cb: res.rows[0].chaobao,
          bw_bz: res.rows[0].remark,
          depart: res.rows[0].depart,
          creator: res.rows[0].creator,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200218104720472064331",
            "XDLMB": res.rows[0].onlynum
          },
          method: "GET" //请求方式  目前接口先暂时全部使用get方式
        })
      }).then((res) => {
        let rowidfiledata = [];
        for (let i = 0; i < res.rows.length; i++) {
          rowidfiledata.push({
            rowid: res.rows[i].id,
            name: res.rows[i].文件名,
            path: res.rows[i].文件地址,
            size: res.rows[i].文件大小,
            type: res.rows[i].文件类型,
          })
        }
        this.setData({
          filearray: rowidfiledata
        })
      })
    } else {
      this.setData({
        onlynum: SysConfig.ToolBox.getTimeAndRandom(),
        nbrq: SysConfig.ToolBox.CurrentDate(),
        nbrq_data: new Date().getTime()
      })
      // 获取人名
      SysConfig.UserInfo.GetUserName().then((res) => {
        this.setData({
          creator: res.data
        })
      })
      // 获取人员id
      SysConfig.UserInfo.GetUserID().then((res) => {
        this.setData({
          creatorId: res.data
        })
      })
      // 获取部门
      SysConfig.UserInfo.GetUserDepart().then((res) => {
        this.setData({
          depart: res.data
        })
      })
    }

  },
  //文件标题
  _title_change(e) {
    this.setData({
      _title: e.detail
    })
  },
  //主送
  bw_zs_event(e) {
    this.setData({
      bw_zs: e.detail
    })
  },
  //抄送
  bw_cs_event(e) {
    this.setData({
      bw_cs: e.detail
    })
  },
  //抄报
  bw_cb_event(e) {
    this.setData({
      bw_cb: e.detail
    })
  },
  //备注
  bw_bz_event(e) {
    this.setData({
      bw_bz: e.detail
    })
  },
  //拟办日期
  nbrq_click() {
    this.setData({
      nbrq_show: true
    })
  },

  nbrq_confirm(e) {
    this.setData({
      nbrq_data: e.detail,
      nbrq_show: false,
      nbrq: SysConfig.ToolBox.transTime(e.detail)
    });
  },
  nbrq_cancel() {
    this.setData({
      nbrq_show: false
    });
  },
  gw_zl_click(e) {
    this.setData({
      gw_zl_radio: e.detail
    });
  },
  gw_smcd_click(e) {
    this.setData({
      gw_smcd_radio: e.detail
    });
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/bw_sqjl/bw_sqjl'
    })
  },
  // 提交表单
  submitTijiao() {
    let dataparams = {}

    if (!this.data._title) {
      wx.showToast({
        title: "请输入文件标题",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.rowiddata.rowid) {
      dataparams = {
        "XDLMCID": '6000',
        "XDLMSID": "DYBH2019082310203020304435",
        "XDLMID": this.data.rowiddata.rowid,
        "XDLMtitle": this.data._title,
        "XDLMnbrq": this.data.nbrq,
        "XDLMtypes": this.data.gw_zl_radio,
        "XDLMsecretDegree": this.data.gw_smcd_radio,
        "XDLMsendUnit": this.data.bw_zs,
        "XDLMchaosr": this.data.bw_cs,
        "XDLMchaobao": this.data.bw_cb,
        "XDLMremark": this.data.bw_bz
      }
    } else {
      dataparams = { //接口body体内参数
        "XDLMCID": '5000',
        "XDLMSID": "DYBH2019082310203020308033",
        "XDLMonlynum": this.data.onlynum,
        "XDLMdepart": this.data.depart,
        "XDLMcreator_id": this.data.creatorId,
        "XDLMshzt": "待提交",
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate(),
        "XDLMxmlcid": "SY20171222155817581783",
        "XDLMcurrentLCxh": "1",
        "XDLMtitle": this.data._title,
        "XDLMnbrq": this.data.nbrq,
        "XDLMnbr": this.data.creator,
        "XDLMnbdw": this.data.depart,
        "XDLMtypes": this.data.gw_zl_radio,
        "XDLMsecretDegree": this.data.gw_smcd_radio,
        "XDLMsendUnit": this.data.bw_zs,
        "XDLMchaosr": this.data.bw_cs,
        "XDLMchaobao": this.data.bw_cb,
        "XDLMremark": this.data.bw_bz
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,
      method: "GET"
    }).then((data) => {
      let file_data = this.data.filearray
      let file_data_obj = []
      for (let i in file_data) {
        if (!file_data[i].rowid) {
          file_data_obj.push({
            "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
            "XDLM关联编号": this.data.onlynum,
            "XDLM文件名": file_data[i].name,
            "XDLM原文件名": file_data[i].name,
            "XDLM文件地址": file_data[i].path,
            "XDLM文件大小": file_data[i].size,
            "XDLM文件类型": file_data[i].type,
            "XDLM类型": "发起报文申请",
            "XDLM添加人": this.data.creator
          })
        }
      }
      return SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": '5001',
          "XDLMSID": 'DYBH2020032619111906955409',
          "datalist": JSON.stringify({
            "key": file_data_obj
          })
        },
        method: "GET"
      })
    }).then(() => {
      return SysConfig.WorkflowManage.create(this.data.onlynum, '报文申请')
    }).then((shlc) => {
      let icon;
      if (shlc.success) {
        icon = 'success';
      } else {
        icon = 'none';
      }
      wx.showToast({
        title: shlc.message,
        icon: 'success',
        duration: 2000,
        success: () => {
          if (this.data.judge_id!="") {
          wx.navigateBack({
          delta: 1
          })
          }else{
          wx.redirectTo({
            url: '/pages/bw_sqjl/bw_sqjl'
          })
          }
        }
      })
    })
  },
  tishikuang(shlc) {
    console.log(shlc)
    let icon;
    if (shlc.success) {
      icon = 'success';

    } else {
      icon = 'none';

    }
    wx.showToast({
      title: shlc.message,
      icon: 'success',
      duration: 2000
    }, wx.navigateTo({
      url: '/pages/bw_sqjl/bw_sqjl'
    }))
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
          let allfile = []
          allfile = that.data.filearray
          allfile.push(filenandp)
          that.setData({
            filearray: allfile
          });
        })
      }
    })
  },
  showfile(e) {
    SysConfig.Upload.downloadFile(e.currentTarget.dataset.id)
  },
  delefile(e) {
    if (this.data.rowiddata.rowid && e.currentTarget.dataset.rowid) {
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "4000",
          "XDLMSID": "DYBH202002181047204720115334",
          "XDLMROWID": e.currentTarget.dataset.rowid
        },
        method: "GET"
      })
    }
    let UploadData = this.data.filearray
    UploadData.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      filearray: UploadData
    });
  }
})