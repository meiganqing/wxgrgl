
var SysConfig = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */

  data: {
    onlynum: SysConfig.ToolBox.getTimeAndRandom(),
    creator:"",//姓名
    creatorId:"",//userid
    depart: "",//部门
    sDate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),//开始时间
    eDate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),//结束时间
    eDate_data: new Date().getTime(),
    sDate_data: new Date().getTime(),
    qj_show: false,//请假弹框
    jiaqiarr: [],//请假类型select
    checkjiaqi: '',//请假类型
    showEnd: false,//结束时间弹框
    showStart: false,//开始时间弹框
    leaveReason:"",//请假事由
    days: "",//时长共计
    leavenum:"",//时长小时
    rowiddata:{
      rowid:""
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,22222222222222222222222222)
    if (!options.id) {
      this.setData({
        judge_id: ""
      })
    } else {
      this.setData({
        judge_id: options.id
      })
    }
    this.setData({
      rowiddata: {
        rowid: options.id
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
         
          creator: res.rows[0].creator,
          depart: res.rows[0].depart,
          checkjiaqi: res.rows[0].leaveType,
          sDate: res.rows[0].startTime,
          eDate: res.rows[0].endTime,
          days: res.rows[0].leavenum,
          gzr:res.rows[0].leavenum,
          leaveType: res.rows[0].leaveType,
          onlynum: res.rows[0].onlynum,
          leaveReason: res.rows[0].leaveReason,
          linkid: res.rows[0].linkid,
          leavenum: res.rows[0].leavenum,
          message:res.rows[0].leaveReason,
        })
      })
    }else{
      console.log(options.gzr)
    this.setData({
        gzr: options.gzr,
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
      let timedata= getWorkOverTimes(SysConfig.ToolBox.transTime(e.detail),this.data.eDate,this.data.gzr)
      console.log(SysConfig.ToolBox.transTime(e.detail,true))
      if (timedata.success) {
        this.setData({       
          sDate_data: e.detail,
          showStart: false,
          sDate: SysConfig.ToolBox.transTime(e.detail,true),
          days: `${timedata.hours}小时`,
          leavenum: timedata.hours
        });
      }else{
        this.setData({
          showStart: false,
          sDate: SysConfig.ToolBox.transTime(e.detail,true),
          days:"",
          leavenum: ""
        });
        wx.showToast({
          title: timedata.message,
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        sDate_data: e.detail,
        showStart: false,
        sDate: SysConfig.ToolBox.transTime(e.detail,true),
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

      let timedata = getWorkOverTimes(this.data.sDate, SysConfig.ToolBox.transTime(e.detail,true),this.data.gzr)
      console.log(timedata)
      if (timedata.success) {
        this.setData({
          eDate_data: e.detail,
          showEnd: false,
          eDate: SysConfig.ToolBox.transTime(e.detail,true),
          days: `${timedata.hours}小时`,
          leavenum: timedata.hours
        });
      } else {
        this.setData({
          showEnd: false,
          eDate:  SysConfig.ToolBox.transTime(e.detail, true),
          days: "",
          leavenum: ""
        });
        wx.showToast({
          title: timedata.message,
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      this.setData({
        eDate_data: e.detail,
        showEnd: false,
        eDate: SysConfig.ToolBox.transTime(e.detail,true),
        days: "",
        leavenum: ""
      });
    }
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/tx_sqjl/tx_sqjl'
    })
  },
  //请假事由
  onChangeReason(event) {
    this.setData({
      leaveReason: event.detail
    })
    console.log(this.data.leaveReason,111111111111)
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (!that.data.days) {
      wx.showToast({
        title: "请选择请假时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log(that.data.rowiddata.rowid,22222222222222)
    if (that.data.rowiddata.rowid){
      dataparams={
        "XDLMCID": "6000",
        "XDLMSID": "DYBH201908231020302030123185",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMleaveReason": that.data.leaveReason,
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
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
        "XDLMtitle": that.data.creator + '的调休申请',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMleavenum": that.data.leavenum,
        "XDLMleaveReason": that.data.leaveReason,
        "XDLMleaveType":"调休",
      }
    }
    // 2.提交表单
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams, //接口body体内参数
      method: "GET"
    }).then((data) => {
      return SysConfig.WorkflowManage.create(that.data.onlynum, '调休申请')
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
            url: '/pages/tx_sqjl/tx_sqjl'
          })
          }
        }
      })
    })
  }
})

// 计算加班时间
function getWorkOverTimes(start,end,ktime) {
  console.log(start)
  console.log(end)
  console.log(ktime)
  //开始加班的时间和结束时间
  var d1 = new Date(start);
  var d2 = new Date(end);
  let timeObj = {};
  if (d1.getTime() > d2.getTime()) {
    timeObj = { success: false, "hours": 0 };
  } else {
    var hours = Math.floor((d2.getTime() - d1.getTime()) / 1000 / 60 / 60);
    if(hours <= ktime){ 
      timeObj = {success: true, "hours":hours };
    }else{ //超出可调休范围
        timeObj = {success: false, "hours":hours, message: "您申请的时长已超出可调休时长，请重新选择！" };
    }
  }
  return timeObj;
}

