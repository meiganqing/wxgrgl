// pages/vactionDetail/vactionDetail.js
var SysConfig = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  tiaoUrl: function (e) {
    var gzr = e.currentTarget.dataset.gzr
    var txstyle = e.currentTarget.dataset.txstyle
  console.log(txstyle)
    if(txstyle == "已过期"){
      wx.showToast({
        title: "已过期不可调休",
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../tx_add/tx_add?gzr='+gzr
      })
    }
   
  },



    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        mUserID: res.data
      })
  
   
    SysConfig.SubSystemData.request({
      istoken: true,
      method: "GET",
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030191181",
        "XDLMA":"加班",
        "XDLMJ":"未调休",
        "XDLMC": this.data.mUserID,
        "XDLME":"已完成"
      }
    }).then((res) => {
      console.log(res)
      if(res.rows!=""){
        var txaRR=[]
      for(var i=0; i<res.rows.length;i++){
        console.log(i)
        txaRR.push({
          creator:res.rows[i].creator,
          fqsj:res.rows[i].fqsj,
          depart:res.rows[i].depart,
          leaveType:res.rows[i].leaveType,
          leavenum:res.rows[i].leavenum,
          txstyle:isOverdue(res.rows[i].endTime)

        } )
    }
          this.setData({
            txData:txaRR
          })
      }else{
        wx.showToast({
          title: "暂时还没有可调休的数据",
          icon: 'none',
          duration: 2000,
          success:()=>{
            setTimeout(()=>{
              wx.navigateBack({delta:1})
            },2000)
          }
        })
      }
     
  })
  })
  }
})

function isOverdue(jb_endTime){
  var jb_d = new Date(jb_endTime).getTime();
  var first_d = getDates().first_day;
  var last_d = getDates().last_day;
  // 若当次加班结束时间大于当月第一天，并且小于当月最后一天时

  if(jb_d >= new Date(first_d).getTime() && jb_d < new Date(last_d).getTime() ){
  
      return "可调休"; //可调休
  }else {
      return "已过期";  //过期
  }

}

// 获取当前月的第一天和最后一天
function getDates(){
  var now = new Date();
  var month = now.getMonth() + 1;  //获取到的是月份是 0-11 所以要加1
  if(month <= 9){
      month = "0" + month;
  }
  var year = now.getFullYear();
  var nextMonthFirstDay = new Date([year,parseInt(month) + 1,1].join('-')).getTime();
  if(nextMonthFirstDay <= 9){
      nextMonthFirstDay = "0" + nextMonthFirstDay;
  }
  var oneDay = 1000 * 24 * 60 * 60;
  var monthLast = new Date(parseInt(nextMonthFirstDay) - oneDay).getDate()
  return {"first_day": [year, month, "01"].join('-') + " 00:00:00", "last_day": [year, month, monthLast].join('-') + " 23:59:59"};
}



