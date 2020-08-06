
var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "",
    creator:"",//姓名
    creatorId:"",//userid
    depart: "",//部门
    sDate: "",//开始时间
    eDate: "",//结束时间
    sDate_data:"",
    eDate_data:"",
    qj_show: false,//请假弹框
    jiaqiarr: [],//请假类型
    checkjiaqi: '',//请假类型
    showEnd: false,//结束时间弹框
    showStart: false,//开始时间弹框
    leaveReason:"",//请假事由
    days: "",//时长共计
    leavenum:"",//时长小时
    rowiddata:{},//单行数据
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
    // 获取请假类型
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH20190823102030203010411",
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      if (data.success) {
        let jiaqi = [];
        for (let i in data.rows) {
          if (data.rows[i].jqname != '假期' && data.rows[i].jqname != '调休')
            jiaqi.push(data.rows[i].jqname)
        }
        this.setData({
          jiaqiarr: jiaqi,
          checkjiaqi: jiaqi[0]
        })
      }
    })
    if (options.id){

      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030159182",
          "XDLMA": options.id
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      }).then((res)=>{
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          creator: res.rows[0].creator,
          depart: res.rows[0].depart,
          checkjiaqi: res.rows[0].leaveType,
          sDate: res.rows[0].startTime,
          sDate_data: new Date(res.rows[0].startTime).getTime(),
          eDate: res.rows[0].endTime,
          eDate_data: new Date(res.rows[0].endTime).getTime(),
          leaveReason: res.rows[0].leaveReason,
          days: `${getDays(res.rows[0].leavenum)}天（${res.rows[0].leavenum}小时）`,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })
      })
    }else{
      this.setData({
        onlynum: SysConfig.ToolBox.getTimeAndRandom()
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
      // 上午上班时间
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYRSGL", //接口XKLX参数
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20191024201400140207252",
          "XDLMB": "上午上班时间"
        },
        method: "GET"
      }).then((data) => {
        if (data.success) {
          this.setData({
            sDate: SysConfig.ToolBox.CurrentDate() + " " + data.rows[0].SysValue.split('-')[0],
            sDate_data: new Date(SysConfig.ToolBox.CurrentDate() + " " + data.rows[0].SysValue.split('-')[0]).getTime()
          })
        }
        // 下午上班时间
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYRSGL", //接口XKLX参数
          XAction: "GetDataInterface",
          data: {
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20191024201400140207252",
            "XDLMB": "下午上班时间"
          },
          method: "GET"
        })
      }).then((data) => {
        if (data.success) {
          this.setData({
            eDate: SysConfig.ToolBox.CurrentDate() + " " + data.rows[0].SysValue.split('-')[1],
            eDate_data: new Date(SysConfig.ToolBox.CurrentDate() + " " + data.rows[0].SysValue.split('-')[1]).getTime()
          })
          return SysConfig.SubSystemData.request({
            istoken: true,
            XKLX: "SYBGGL",
            XAction: "GetDataInterface",
            data: {
              XDLMCID: "9000",
              XDLMTID: "9203",
              XDLMSID: "9203053",
              sTime: this.data.sDate,
              eTime: this.data.eDate,
            },
            method: "GET"
          })
        }
      }).then((data) => {
        if (data.success) {
          this.setData({
            days: `${data.天数}天（${data.小时}小时）`,
            leavenum: data.小时
          });
        }
      })
    }
  },
  showPopup() {//请假单元格点击
    this.setData({
      qj_show: true
    });
  },
  onCancel(){//请假取消
    this.setData({
      qj_show: false
    });
  },
  onConfirm(e) {//请假确定
    this.setData({
      qj_show: false,
      checkjiaqi: e.detail.value
    });
  },
  // 开始时间弹出层
  showPopupstartTime() {
    this.setData({
      showStart: true
    });
  },
  cancel_sDate() {//开始时间取消
    this.setData({
      showStart: false
    });
  },
  confirm_sDate(e) {//开始时间确定
    if (this.data.eDate) {
      SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          XDLMCID: "9000",
          XDLMTID: "9203",
          XDLMSID: "9203053",
          sTime: SysConfig.ToolBox.transTime(e.detail,true),
          eTime: this.data.eDate,
        },
        method: "GET"
      }).then((data) => {
        if (data.success) {
          this.setData({
            sDate_data:e.detail,
            showStart: false,
            sDate: SysConfig.ToolBox.transTime(e.detail, true),
            days: `${data.天数}天（${data.小时}小时）`,
            leavenum: data.小时
          });
        }
      })
    }else{
      this.setData({
        sDate_data: e.detail,
        showStart: false,
        sDate: SysConfig.ToolBox.transTime(e.detail, true),
        days:"",
        leavenum:""
      });
    }
  },
  // 结束时间弹出层
  showPopupendTime() {
    this.setData({
      showEnd: true
    });
  },
  cancel_eDate() {//结束时间取消
    this.setData({
      showEnd: false
    });
  },
  confirm_eDate(e) {//结束时间确定
    if (this.data.sDate){
      SysConfig.SubSystemData.request({
        istoken: true, 
        XKLX: "SYBGGL", 
        XAction: "GetDataInterface", 
        data: { 
          XDLMCID: "9000",
          XDLMTID: "9203",
          XDLMSID: "9203053",
          sTime: this.data.sDate,
          eTime: SysConfig.ToolBox.transTime(e.detail, true),
        },
        method: "GET"   
      }).then((data) => {
        if (data.success) {
          this.setData({
            eDate_data: e.detail,
            showEnd: false,
            eDate: SysConfig.ToolBox.transTime(e.detail, true),
            days: `${data.天数}天（${data.小时}小时）`,
            leavenum: data.小时
          });
        }
      })
    }else{
      this.setData({
        eDate_data: e.detail,
        showEnd: false,
        eDate: SysConfig.ToolBox.transTime(e.detail, true),
        days:"",
        leavenum: ""
      });
    }
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/qj_sqjl/qj_sqjl'
    })
  },
  //请假事由
  onChangeReason(event) {
    this.setData({
      leaveReason: event.detail
    })
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (!that.data.checkjiaqi){
      wx.showToast({
        title: "请选择请假类型",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.sDate) {
      wx.showToast({
        title: "请选择开始时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.eDate) {
      wx.showToast({
        title: "请选择结束时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.leaveReason) {
      wx.showToast({
        title: "请填写请假事由",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.rowiddata.rowid){
      dataparams={
        "XDLMCID": "6000",
        "XDLMSID": "DYBH201908231020302030123185",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMleavenum": that.data.leavenum,
        "XDLMleaveReason": that.data.leaveReason,
        "XDLMleaveType": that.data.checkjiaqi,
      }
    }else{
      dataparams={
        "XDLMCID": "5000",
        "XDLMSID": "DYBH20190823102030203043183",
        "XDLMonlynum": that.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        "XDLMcreator_id": that.data.creatorId,
        "XDLMtitle": that.data.creator + '的请假申请',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMleavenum": that.data.leavenum,
        "XDLMleaveReason": that.data.leaveReason,
        "XDLMleaveType": that.data.checkjiaqi,
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
      if (data.success) {
        return SysConfig.SubSystemData.request({//获取用户是否一级审核人
            istoken: true,
            XKLX: "SYYHGL",
            XAction: "GetDataInterface",
            data: {
              "XDLMCID": "1001",
              "XDLMSID": "DYBH20190823102601261253201",
              "XDLMH": that.data.creatorId
            },
            method: "GET"
          })
      }
    }).then((data) => {
      if (data.success){
        if (data.rows[0].isbmzr == "1") {
          return SysConfig.WorkflowManage.create(that.data.onlynum, '部门主任请假')
        } else {
          if (that.data.checkjiaqi == '年假' || that.data.checkjiaqi == '探亲假') {
            return SysConfig.WorkflowManage.create(that.data.onlynum, '请假申请（大于2天）');
          } else {
            if (that.data.leavenum <= 16) {
              return SysConfig.WorkflowManage.create(that.data.onlynum, '请假申请');
            } else {
              return SysConfig.WorkflowManage.create(that.data.onlynum, '请假申请（大于2天）');
            }
          }
        }
      }
      }).then((shlc)=>{
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
        duration: 2000,
        success: () => {
          if (this.data.judge_id!="") {
          wx.navigateBack({
          delta: 1
          })
          }else{
          wx.redirectTo({
            url: '/pages/qj_sqjl/qj_sqjl'
          })
          }
        }
      })
    })
  }
})

//一天内的请假, 4小时以内算0.5天，8小时以内算1.0天
function getDays(hours) {   // hours 请假总小时数
  var days = 0;
  if (hours < 4 && hours > 0) {
    days += 0.5;
  }
  else if (hours >= 4) {
    days += Math.floor(hours / 8);
    days += Math.ceil(hours % 8 / 4) * 0.5;
  }
  return days; 
}
