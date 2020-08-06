// pages/chuchaiDetail/chuchaiDetail.js
var SysConfig = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    imgshow: false,
    lzyj_data: [], //流转意见
    useData: { //用户数据
      mUserID: null
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
    ]
  },
  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageParams: {
        rowid: options.id,
        m_LConlynum: options.xmlcid,
        m_Onlynum: options.onlynum,
        module: options.module,
        urlid: options.urlid,
      }
    })
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        useData: {
          mUserID: res.data
        }
      })
      console.log(this.data.pageParams.urlid)
      return SysConfig.SubSystemData.request({ // 获取主表单行数据
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH2019082310203020307342",
          "XDLMA": this.data.pageParams.urlid,
        },
        method: "GET"
      })
    }).then((res) => {
      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
        res.rows[0].contents=res.rows[0].contents.replace(/<[^>]+>/g, "");
        this.setData({
          rowidData: {
            creator: res.rows[0].creator,
            zfsj: res.rows[0].zfsj,
            gwmc: res.rows[0].gwmc,
            onlynum: res.rows[0].onlynum,
            title: res.rows[0].title,
            tgTime: res.rows[0].tgTime,
            depart: res.rows[0].depart,
            contents: res.rows[0].contents

          }
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {

      console.log(this.data.rowidData.onlynum)
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
      if (res.rows) {

        let arr = [];
        res = res.rows

        res.forEach(function (item, index) {

          item['文件地址'] = 'http://192.168.28.251:8111/' + item['文件地址']
          var str = `{"${item['文件名']}":"${item['文件地址']}"}`
          console.log(str)
          var obj = JSON.parse(str)
          arr.push(obj)
        })
        this.setData({
          imgarr: arr,
          imgshow: true
        })

      }
    })
  },

  radioJiedian: function (e) {
    this.setData({
      ht_jd: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
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
  bindFormsubmit: function (e) {
    if (this.data.xianyin) {
      // 发送通过请求
      SysConfig.WorkflowManage.complete(e.detail.value.wQPYJ).then((res) => {
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1000,
          complete: () => {
            wx.reLaunch({
              url: '../daiwoshenpi/daiwoshenpi',
            })
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
            wx.reLaunch({
              url: '../daiwoshenpi/daiwoshenpi',
            })
          }
        })
      })
    }
  },
  // 预览图片：
  //轮播图点击预览
  imgYu: function (event) {
    var that = this;
    var src = event.currentTarget.dataset.src; //获取data-src
    var extension = src.substring(src.lastIndexOf('.') + 1);
    console.log(extension)
    if (extension != 'img' && extension != 'png' && extension != 'jpg') {
      // 下载
      wx.downloadFile({
        url: src, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              fileType: extension,
              success: function (res) {
              }
            })
          }
        }
      })
    } else {
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })
    }
  }
})