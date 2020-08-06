
var SysConfig = require('../../utils/util.js');

Page({
  data: {
    onlynum:"",
    creator: "",//姓名
    creatorId: "",//userid
    depart: "",//部门
    sDate: "",//开始时间
    eDate: "",//结束时间
    sDate_data: "",
    eDate_data:"",
    showEnd: false,//结束时间弹框
    showStart: false,//开始时间弹框
    leaveReason: "",//申请事由
    days: "5小时",//时长共计
    leavenum: "5",//时长小时
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
          sDate: res.rows[0].startTime,
          sDate_data: new Date(res.rows[0].startTime).getTime(),
          eDate: res.rows[0].endTime,
          eDate_data: new Date(res.rows[0].endTime).getTime(),
          leaveReason: res.rows[0].leaveReason,
          days:  res.rows[0].leavenum+"小时",
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })
      })
    }else{
    this.setData({
      onlynum: SysConfig.ToolBox.getTimeAndRandom(),
      sDate: SysConfig.ToolBox.CurrentDate() + " " + "18:00:00",//开始时间
      eDate: SysConfig.ToolBox.CurrentDate() + " " + "23:00:00",//结束时间
      sDate_data: new Date(SysConfig.ToolBox.CurrentDate() + " " + "18:00:00").getTime(),
      eDate_data: new Date(SysConfig.ToolBox.CurrentDate() + " " + "23:00:00").getTime(),
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
      let timedata= getWorkOverTimes(SysConfig.ToolBox.transTime(e.detail, true),this.data.eDate)
      if (timedata.success) {
        this.setData({
          sDate_data: e.detail,
          showStart: false,
          sDate: SysConfig.ToolBox.transTime(e.detail, true),
          days: `${timedata.hours}小时`,
          leavenum: timedata.hours
        });
      }else{
        this.setData({
          showStart: false,
          sDate: "",
          days:"",
          leavenum: ""
        });
        wx.showToast({
          title: "开始时间不能大于结束时间",
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        sDate_data: e.detail,
        showStart: false,
        sDate: SysConfig.ToolBox.transTime(e.detail, true),
        days: "",
        leavenum: ""
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
    if (this.data.sDate) {
      let timedata = getWorkOverTimes(this.data.sDate, SysConfig.ToolBox.transTime(e.detail, true))
      console.log(timedata)
      if (timedata.success) {
        this.setData({
          eDate_data: e.detail,
          showEnd: false,
          eDate: SysConfig.ToolBox.transTime(e.detail, true),
          days: `${timedata.hours}小时`,
          leavenum: timedata.hours
        });
      } else {
        this.setData({
          showEnd: false,
          eDate: "",
          days: "",
          leavenum: ""
        });
        wx.showToast({
          title: "开始时间不能大于结束时间",
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        eDate_data: e.detail,
        showEnd: false,
        eDate: SysConfig.ToolBox.transTime(e.detail, true),
        days: "",
        leavenum: ""
      });
    }
  },
  //请假事由
  onChangeReason(event) {
    this.setData({
      leaveReason: event.detail
    })
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/jb_sqjl/jb_sqjl'
    })
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (!that.data.sDate) {
      wx.showToast({
        title: "请填写开始时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.eDate) {
      wx.showToast({
        title: "请填写结束时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.leaveReason) {
      wx.showToast({
        title: "请填写申请事由",
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
      }
    }else{
      dataparams={
        "XDLMCID": "5000",
        "XDLMSID": "DYBH20190823102030203043183",
        "XDLMonlynum": that.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMstate": "未调休",
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        "XDLMcreator_id": that.data.creatorId,
        "XDLMtitle": that.data.creator + '的加班申请',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMleavenum": that.data.leavenum,
        "XDLMleaveReason": that.data.leaveReason,
        "XDLMleaveType": '加班',
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      return SysConfig.WorkflowManage.create(that.data.onlynum, '加班申请')
      }).then((shlc) => {
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
              url: '/pages/jb_sqjl/jb_sqjl'
            })
            }
          }
        })
      })
  }
})
function getWorkOverTimes(start, end) {
  //开始加班的时间和结束时间
  var d1 = new Date(start);
  var d2 = new Date(end);
  let timeObj = {};
  if (d1.getTime() > d2.getTime()) {
    timeObj = { success: false, "hours": 0 };
  } else {
    var hours = Math.floor((d2.getTime() - d1.getTime()) / 1000 / 60 / 60);
    timeObj = { success: true, "hours": hours };
  }
  return timeObj;
}