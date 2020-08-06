
var SysConfig = require("../../utils/util.js")
Page({
  data: {
    mUserId: "",
    userid:"",
    pageNum: 1,
    load:true,
    rows:20
  },
  detailUrl: function (e) {
    var id = e.currentTarget.dataset.id
    var xmlcid = e.currentTarget.dataset.xmlcid
    var onlynum = e.currentTarget.dataset.onlynum
    var module = e.currentTarget.dataset.module
    var urlid = e.currentTarget.dataset.url
    urlid = urlid.match(/id=(\S*)/);
    console.log(urlid)
    console.log(module)
    let url;
    switch (module) {
      //补签
      case ("考勤补卡表"):
        wx.navigateTo({
          url: '../bq_shenpi/bq_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
      
        break;
      //请假，外出，加班，调休
      case ("wwAnnualVacation"):
        wx.navigateTo({
          url: '../daiwoshenpi_shenpi/daiwoshenpi_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      // 出差
      case ("officialBusiness"):
        wx.navigateTo({
          url: '../cc_shenpi/cc_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      // 参观接待
      case ("visitReception"):
        wx.navigateTo({
          url: '../cgjd_shenpi/cgjd_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      // 公文
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
              url: '../gwqf_splc/gwqf_splc?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          } else {
            // wx.navigateTo({
            //   url: '../gwlz_shenpi/gwlz_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            // })
            wx.navigateTo({
              url: '../gwcy_splc/gwcy_splc?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }
        })
        break;
      // 报文
      case ("Appmessage"):
        wx.navigateTo({
          url: '../bw_shenpi/bw_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      // 发新闻
      case ("AppNews"):
        wx.navigateTo({
          url: '../fxw_shenpi/fxw_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      //领书
      case ("AppBook"):
        wx.navigateTo({
          url: '../ls_shenpi/ls_shenpi?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
        })
        break;
      // 项目
      case ("wwProject"):
        SysConfig.SubSystemData.request({ // 获取主表单行数据
          istoken: true,
          XKLX: "SYXMGL",
          XAction: "GetDataInterface",
          data: {
            "XDLMCID": "1001",
            "XDLMSID": "DYBH201908231026422642114212",
            "XDLMA": urlid[1],
          },
          method: "GET"
        }).then((res) => {
         let isInterrupt = res.rows[0].module
        
          if (isInterrupt == "调查主动项目") {
            wx.navigateTo({
              url: '../xm_dczd/xm_dczd?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          } else if (isInterrupt == "发掘主动项目") {
            wx.navigateTo({
              url: '../xm_fjzd/xm_fjzd?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "勘探主动项目") {
            wx.navigateTo({
              url: '../xm_ktzd/xm_ktzd?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "调查配合基建项目") {
            wx.navigateTo({
              url: '../xm_dcpj/xm_dcpj?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "发掘配合基建项目") {
            wx.navigateTo({
              url: '../xm_fjpj/xm_fjpj?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "勘探配合基建项目") {
            wx.navigateTo({
              url: '../xm_ktpj/xm_ktpj?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "资料整理") {
            wx.navigateTo({
              url: '../xm_zlzl/xm_zlzl?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "文物保护") {
            wx.navigateTo({
              url: '../xm_wwbh/xm_wwbh?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "图书出版") {
            wx.navigateTo({
              url: '../xm_tscb/xm_tscb?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "文物流转") {
            wx.navigateTo({
              url: '../xm_wwlz/xm_wwlz?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "社科项目") {
            wx.navigateTo({
              url: '../xm_skxm/xm_skxm?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if (isInterrupt == "抢救性考古发掘") {
            wx.navigateTo({
              url: '../xm_qjkg/xm_qjkg?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }else if(isInterrupt == "其他类") {
            wx.navigateTo({
              url: '../xm_any/xm_any?id=' + id + '&xmlcid=' + xmlcid + '&onlynum=' + onlynum + '&module=' + module + '&urlid=' + urlid[1]
            })
          }
        })
        break;
    }
  },
  onShow: function () {
    SysConfig.UserInfo.GetUserID().then((res) => {
      console.log(res)
      this.setData({
        userid: res.data
      })
    })
    SysConfig.UserInfo.GetUserName().then((res) => {
      this.setData({
        mUserName: res.data
      })
      SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030130321",
          "XDLML": this.data.userid,
          "XDLMD":"wwAnnualVacation,考勤补卡表,officialBusiness,visitReception,Appmessage,AppNews,AppBook,wwProject,公文",//wwDocument
          "XDLME": "no",
          "XDLMF": "no",
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
  onReachBottom: function () {
    if (this.data.load){
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
          "XDLMD": "wwAnnualVacation,考勤补卡表,officialBusiness,wwDocument,visitReception,Appmessage,AppNews,AppBook,wwProject",
          "XDLMF": "no",
          "XDLML": this.data.userid,
          "page": this.data.pageNum * 1 + 1,
          "rows": this.data.rows
        }
      }).then((res) => {
        let resdata = this.data.res.concat(res.rows)
        if (res.rows.length < this.data.rows){
          this.setData({
            pageNum: this.data.pageNum * 1 + 1,
            res: resdata,
            load:false
          })
        }else{
          this.setData({
            pageNum: this.data.pageNum * 1 + 1,
            res: resdata
          })
        }
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
      })
    }
   
  }
})