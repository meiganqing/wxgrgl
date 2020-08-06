
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserName: "",
    userid:"",
    pageNum:1,
    load: true,
    rows: 20
  },

  detailUrl: function (e) {
    console.log(e.currentTarget.dataset)
    var that = this;
    var id = e.currentTarget.dataset.id
    var xmlcid = e.currentTarget.dataset.xmlcid
    var onlynum = e.currentTarget.dataset.onlynum
    var module = e.currentTarget.dataset.module
    var urlid = e.currentTarget.dataset.url
    urlid = urlid.match(/id=(\S*)/);
    switch (module) {
      //补卡
      case ("考勤补卡表"):
        wx.navigateTo({
          url: '../bq_sqjlxq/bq_sqjlxq?id=' + urlid[1]
        })
        break;
      //请假，外出，加班，调休
      case ("wwAnnualVacation"):
        wx.navigateTo({
          url: '../jb_sqjlxq/jb_sqjlxq?id=' + urlid[1]
        })
        break;
      // 出差
      case ("officialBusiness"):
        wx.navigateTo({
          url: '../cc_sqjlxq/cc_sqjlxq?id='+ urlid[1]

        })
        break;
      // 参观接待
      case ("visitReception"):
        wx.navigateTo({
          url: '../cgjd_sqjlxq/cgjd_sqjlxq?id=' + urlid[1]
        })
        break;
      // 报文
      case ("Appmessage"):
        wx.navigateTo({
          url: '../bw_sqjlxq/bw_sqjlxq?id=' + urlid[1]
        })
        break;
      // 发新闻
      case ("AppNews"):
        wx.navigateTo({
          url: '../fxw_sqjlxq/fxw_sqjlxq?id=' + urlid[1]
        })
        break;
    // 公文群发
    case ("公文"):
      let isInterrupt;
      SysConfig.SubSystemData.request({ // 获取主表单行数据
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH202007101118581858144452",
          "XDLMA": urlid[1],
        },
        method: "GET"
      }).then((res) => {
        isInterrupt = res.rows[0].isInterrupt
        if (isInterrupt == "no") {
          // wx.navigateTo({
          //   url: '../gwqf_shenpi/gwqf_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
          // })
          wx.navigateTo({
            url: '../gwqf_sqxq/gwqf_sqxq?id=' +urlid[1]
          })
        } else {
          // wx.navigateTo({
          //   url: '../gwlz_shenpi/gwlz_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
          // })
          
          wx.navigateTo({
            url: '../gwcy_sqxq/gwcy_sqxq?id=' + urlid[1]
          })
        }
      })
      break;
      // case ("wwDocument"):
        // let isInterrupt;
        // SysConfig.SubSystemData.request({ // 获取主表单行数据
        //   istoken: true,
        //   XKLX: "SYBGGL",
        //   XAction: "GetDataInterface",
        //   data: {
        //     "XDLMCID": "1001",
        //     "XDLMSID": "DYBH201908231020302030146222",
        //     "XDLMA": urlid[1],
        //   },
        //   method: "GET"
        // }).then((res) => {
        //   isInterrupt = res.rows[0].isInterrupt
        //   if (isInterrupt == "no") {
        //     wx.navigateTo({
        //       url: '../gwqf_sqjlxq/gwqf_sqjlxq?id=' + urlid[1]
        //     })
        //   } else {
        //     wx.showToast({
        //       title: "暂不支持公文传阅功能",
        //       icon: 'none',
        //       duration: 2000
        //     })
        //   }
        // })
        // wx.navigateTo({
        //   url: '../gwqf_sqjlxq/gwqf_sqjlxq?id=' + urlid[1]
        // })
        // break; 
      // 领书
      case ("AppBook"):
        wx.navigateTo({
          url: '../ls_sqjlxq/ls_sqjlxq?id=' + urlid[1]
        })
        break;
      // 项目
      case ("wwProject"):
        // wx.navigateTo({
        //   url: '../fxw_sqjlxq/fxw_sqjlxq?id=' + urlid[1]
        // })
        wx.showToast({
          title: "暂不支持此功能",
          icon: 'none',
          duration: 2000
       })
        break;
    }
  },
  onLoad: function () {
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        userid: res.data
      })
    })
    SysConfig.UserInfo.GetUserName().then((res) => {
      this.data.mUserName = res.data
      SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030130321",
          "XDLME": "no",
          "XDLMD": "wwAnnualVacation,考勤补卡表,officialBusiness,公文,visitReception,Appmessage,AppNews,AppBook,wwProject",
          "XDLMF": "yes",
          "XDLML": this.data.userid,
          "page": this.data.pageNum,
          "rows": this.data.rows
        }
      }).then((res) => {
        this.setData({
          res: res.rows
        })
      })
    })
  },
  onReachBottom:function(){
    if (this.data.load) {
    wx.showLoading({
      title: '加载中',
    })
    SysConfig.SubSystemData.request({
      istoken: true,
      method: "GET",
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030130321",
        "XDLME": "no",
        "XDLMD": "wwAnnualVacation,考勤补卡表,officialBusiness,公文,visitReception,Appmessage,AppNews,AppBook,wwProject",
        "XDLMF": "yes",
        "XDLML": this.data.userid,
        "page": this.data.pageNum*1+1,
        "rows": this.data.rows
      }
    }).then((res) => {
      let resdata = this.data.res.concat(res.rows)
      if (res.rows.length < this.data.rows) {
          this.setData({
            pageNum: this.data.pageNum * 1 + 1,
            res: resdata,
            load: false
          })
      } else {
        this.setData({
          pageNum: this.data.pageNum * 1 + 1,
          res: resdata
        })
      }
      wx.hideLoading()
      }).catch(()=>{
        wx.hideLoading()
      })
    }
  }
})