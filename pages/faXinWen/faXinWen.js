var SysConfig = require('../../utils/util.js');

Page({
  data: {
    onlynum: "", //库内编码
    _title: "", //标题
    creator: "", //登录人名称
    creatorid: "", //登录人id
    depart: "", //登录人部门
    formats: {},
    
    tg_fx_show: false, // 投稿弹框
    tg_fx_name: [], //投稿方向选中
    tg_fx_arr: [], //投稿方向弹框数值
    timedate: "",
    filearray: [], //附件数组
    fileid: "", //文件关联id
    showStart: false, //投稿时间显
    sDate: "", //投稿时间
    sDate_data: "", //投稿时间插件值
    news_nr: "", //内容
    rowiddata: {
      rowid: ""
    },
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        SysConfig.Upload.upLoadFile(res.tempFiles[0].path, res.tempFiles[0].name).then((res) => {
          console.log(res, 333333333333)
          that.editorCtx.insertImage({
            src: SysConfig.http + JSON.parse(res.data).filepath,
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '50%',
            success: function () {
              console.log('insert image success')
            }
          })
        })
      }
    })
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
    // 获取方向
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202002181357205720121351",
        "XDLMA": "投稿方向"
      },
      method: "GET" //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      if (data.success) {
        let tgfxarr = [];
        for (let i in data.rows) {
          tgfxarr.push(data.rows[i].统计内容)
        }
        this.setData({
          tg_fx_arr: tgfxarr
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
          "XDLMSID": "DYBH2019082310203020307342",
          "XDLMA": options.id
        },
        method: "GET" //请求方式  目前接口先暂时全部使用get方式
      }).then((res) => {
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          _title: res.rows[0].title,
          creator: res.rows[0].creator,
          tg_fx_name: res.rows[0].tgDerection.split(","),
          sDate: res.rows[0].tgTime,
          sDate_data: new Date(res.rows[0].tgTime).getTime(),
          news_nr: res.rows[0].contents,
          onlynum: res.rows[0].onlynum,
        })
        //富文本回显
        var that = this
        wx.createSelectorQuery().select("#editor").context(function (res) {
          that.editorContext = res.context
          that.editorContext.setContents({
            html: that.data.news_nr,
            success: function (res) {},
            fail: function (err) {}
          })
        }).exec()
        return SysConfig.SubSystemData.request({ //附件
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200218104720472064331",
            "XDLMB": this.data.onlynum
          },
          method: "GET"
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
        timedate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        sDate_data: new Date().getTime()
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


  //标题
  title_change(e) {
    this.setData({
      _title: e.detail
    });
  },
  xwnr_event(e) {
    console.log(e.detail.html, '///////')
    this.setData({
      news_nr: e.detail.html
    });
  },
  tg_fx_click() {
    this.setData({
      tg_fx_show: true
    });
  },
  tg_fx_confirm(e) {
    console.log(e.detail)
    this.setData({
      tg_fx_name: e.detail
    });
  },
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  tg_fx_cancel() {
    this.setData({
      tg_fx_show: false
    });
  },
  // 投稿时间弹出层
  tg_time_click() {
    this.setData({
      showStart: true
    });
  },
  confirm_sDate(e) {
    this.setData({
      sDate_data: e.detail,
      showStart: false,
      sDate: transTime(e.detail)
    });
  },
  cancel_sDate() {
    this.setData({
      showStart: false
    });
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/fxw_sqjl/fxw_sqjl'
    })
  },

  // 提交表单
  submitTijiao() {
    let dataparams = {}
    if (!this.data._title) {
      wx.showToast({
        title: "请输入新闻标题",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.tg_fx_name) {
      wx.showToast({
        title: "请选择投稿方向",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.sDate) {
      wx.showToast({
        title: "请选择投稿时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.news_nr) {
      wx.showToast({
        title: "请输入内容",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (this.data.rowiddata.rowid) {
      dataparams = {
        "XDLMCID": "6000",
        "XDLMSID": "DYBH2019082310203020308845",
        "XDLMID": this.data.rowiddata.rowid,
        "XDLMtgDerection": this.data.tg_fx_name.join(","),
        "XDLMtgTime": this.data.sDate,
        "XDLMtitle": this.data._title,
        'XDLMcontents': this.data.news_nr
      }
    } else {
      dataparams = {
        'XDLMCID': '5000',
        'XDLMSID': 'DYBH2019082310203020306943',
        "XDLMonlynum": this.data.onlynum,
        "XDLMtgDerection": this.data.tg_fx_name.join(","),
        "XDLMdepart": this.data.depart,
        "XDLMcreator_id": this.data.creatorId,
        "XDLMshzt": "待提交",
        "XDLMcurrentLCxh": "1",
        'XDLMcreator': this.data.creator,
        "XDLMtgTime": this.data.sDate,
        "XDLMtitle": this.data._title,
        'XDLMcontents': this.data.news_nr
      }
    }
    // 2.提交表单
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
            "XDLM类型": "发新闻",
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
      return SysConfig.WorkflowManage.create(this.data.onlynum, '发新闻申请')
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
            url: '/pages/fxw_sqjl/fxw_sqjl'
          })
          }
        }
      })
    })
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
          console.log(res, 444444444444)
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

function transTime(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day;
  return timeSpanStr;
}