
var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "",
    creator: "",//姓名
    creatorId: "",//userid
    depart: "",//部门
    sptime: "",//申请时间
    sptime_data: "",
    showStart: false,//开始时间弹框
    leaveReason: "",//申请事由
    days: "",//时长共计
    leavenum: "",//时长小时
    radio:"上午",//单选
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
          checkjiaqi: res.rows[0].leaveType,
          sptime: res.rows[0].startTime.split(" ")[0],
          sptime_data: new Date(res.rows[0].startTime.split(" ")[0]).getTime(),
          sDate: res.rows[0].startTime,
          eDate: res.rows[0].endTime,
          leaveReason: res.rows[0].leaveReason,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
          radio:ds(res.rows[0].leavenum,res.rows[0].startTime)
        })
      })
    }else{
    this.setData({
      onlynum: SysConfig.ToolBox.getTimeAndRandom(),
      sptime: SysConfig.ToolBox.CurrentDate(),
      sptime_data: new Date().getTime()
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
  // 时间弹出层
  showPopupstartTime() {
    this.setData({
      showStart: true
    });
  },
  cancel_sDate() {//时间取消
    this.setData({
      showStart: false
    });
  },
  
  confirm_sDate(e) {//时间确定
      this.setData({
        sptime_data: e.detail,
        sptime: SysConfig.ToolBox.transTime(e.detail),
        showStart: false
      });
  },
  // 单选框选择
  onClickdan(event) {
    var that=this;
    const event_dataset = event.currentTarget.dataset
    const sptime = that.data.sptime + event_dataset.stime
    const eptime = that.data.sptime + event_dataset.etime
    if (sptime){
      that.setData({
        sDate: sptime,
        eDate: eptime,
        leavenum: event_dataset.numtime,
        radio: event_dataset.name
      });
    }else{
      wx.showToast({
        title: "请选择申请时间",
        icon: 'none',
        duration: 2000,
        radio:""
      })
    }
  },
 
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/wc_sqjl/wc_sqjl'
    })
  },
  // 事由改变
  onChangeReason(event) {
    this.setData({
      leaveReason: event.detail
    })
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (!that.data.radio) {
      wx.showToast({
        title: "请选择申请时间段",
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
        "XDLMonlynum":that.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        "XDLMcreator_id": that.data.creatorId,
        "XDLMleavenum": that.data.leavenum,
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMtitle": that.data.creator + '的外出申请',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMleaveType": '外出',  
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMleaveReason": that.data.leaveReason,
      }
    }else{
      dataparams={
        "XDLMCID": '5000',
        "XDLMSID": 'DYBH20190823102030203043183',
        "XDLMonlynum": that.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMstartTime": that.data.sDate,
        "XDLMendTime": that.data.eDate,
        "XDLMleavenum": that.data.leavenum,
        "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        "XDLMcreator_id": that.data.creatorId,
        "XDLMtitle": that.data.creator + '的外出申请',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMleaveType": '外出',
        "XDLMleaveReason": that.data.leaveReason,
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,//接口body体内参数
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      return SysConfig.WorkflowManage.create(that.data.onlynum, '外出申请')
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
              url: '/pages/wc_sqjl/wc_sqjl'
            })
            }
          }
        })
      })
  }
})


function  ds(sdtimr,starttime){
 
  if(sdtimr == 4){
      //上午或下午
      if(starttime.indexOf("7:00:00") != -1){
          return "上午"
      }else if(starttime.indexOf("13:00:00") != -1){
        return "下午"
      }
    }else{ //全天
      return "全天"
    }
}
