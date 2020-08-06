//index.js
var SysConfig = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    mUserName: "",
    userid:"",
    mUserOnlyNum:"",
    qx_FW:{},
    "logo_top": 'https://syoa.october3d.com/wx/image/lanse0.png',//首页头部图片
    Imgs:"https://syoa.october3d.com/wx/image/new.png",
    items0: [  {
      title: '待我审批',
      img: 'https://syoa.october3d.com/wx/image/tongzhi.png',
      url: 'daiwoshenpi',
      xiaoxi: true
    },
    {
      title: '审批记录',
      img: 'https://syoa.october3d.com/wx/image/shenpi.png',
      url: 'shenpijilu',
    }, {
      title: '我的申请',
      img: 'https://syoa.october3d.com/wx/image/jiaban.png',
      url: 'myshenqing',
    }],
    items: [{
      title: '请假',
      img: 'https://syoa.october3d.com/wx/image/qingjia.png',
      url: 'qj_add1'
    },
    {
      title: '出差',
      img: 'https://syoa.october3d.com/wx/image/chuchai.png',
      url: 'cc_add3'
    },
    {
      title: '补签',
      img: 'https://syoa.october3d.com/wx/image/buka.png',
      url: 'bq_list'
    },
    {
      title: '调休',
      img: 'https://syoa.october3d.com/wx/image/tiaoxiu.png',
      url: 'tx_list'
    },
    {
      title: '加班',
      img: 'https://syoa.october3d.com/wx/image/jiaban.png',
      url: 'jb_add'
    },
    {
      title: '外出',
      img: 'https://syoa.october3d.com/wx/image/waichu.png',
      url: 'wc_add',
    }],
    items2: [{
      title: '公文传阅',
      img: 'https://syoa.october3d.com/wx/image/qunfa.png',
      url: 'gwcy_add'
    },
    {
      title: '公文审核',
      img: 'https://syoa.october3d.com/wx/image/qunfa.png',
      url: 'gwqf_add'
    },
    {
      title: '参观接待',
      img: 'https://syoa.october3d.com/wx/image/canguan.png',
      url: 'cgjd_add'
    },
    {
      title: '报文',
      img: 'https://syoa.october3d.com/wx/image/baowen.png',
      url: 'baoWen'
    },
    {
      title: '发新闻',
      img: 'https://syoa.october3d.com/wx/image/xinwen.png',
      url: 'faXinWen'
    },
    {
      title: '领书',
      img: 'https://syoa.october3d.com/wx/image/lingshu.png',
      url: 'ls_add'
    },
    {
      title: '议题申报',
      img: 'https://syoa.october3d.com/wx/image/yiti0.png'
    },
    {
      title: '委托书',
      img: 'https://syoa.october3d.com/wx/image/weituo0.png'
    },
    {
      title: '预算申报',
      img: 'https://syoa.october3d.com/wx/image/yusuan0.png'
    },
    {
      title: '验收申请',
      img: 'https://syoa.october3d.com/wx/image/yanshou0.png'
    },

    ],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
// 点击跳转
  bindViewTap: function (e) {
    var $data = e.currentTarget.dataset;
    if ($data.item){
      wx.navigateTo({
        url: '../' + $data.item + '/' + $data.item
      })
    }else{
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 1000
      })
    }
  },

  bindViewTap2: function (e) {
    var $data = e.currentTarget.dataset;
    if ($data.item) {
      wx.navigateTo({
        url: '../' + $data.item + '/' + $data.item
      })
    } else {
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 点击通知公告
  bindViewTap3: function (e) {
      wx.navigateTo({
        url: "../tzgg_xq/tzgg_xq?id="+e.currentTarget.dataset.id
      })
  },
    // 点击更多通知公告
    bindViewTap4: function (e) {
      wx.navigateTo({
        url: "../tzgg_list/tzgg_list"
      })
  },
  onShow: function () {
    let pagemoudle = [...this.data.items0, ...this.data.items, ...this.data.items2]
    let item = "";
    for (var i in pagemoudle) {
      item += pagemoudle[i].title + ",";
    }
    item = item.substring(0, item.length - 1);
    SysConfig.UserInfo.GetUserOnlynum().then((res) => {
      this.setData({
        mUserOnlyNum: res.data
      })
      return SysConfig.SubSystemData.request({
        istoken: true,
        method: "GET",
        XKLX: "SYYHGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "7000",
          "XDLMSID": "DYBH2020031120324905158571",
          "XDLMTID": "7021",
          "XDLMUserID": this.data.mUserOnlyNum,
          "XDLMItemName": item,
          "XDLMxmbh": "sygr"
        }
      })
    }).then((res) => {
      if (res.qx.length > 0) {
        let qx_obj={}
        for (let j in res.qx) {
          if (res.qx[j].mDataStrValue.substring(1, 2) == "1") {
            qx_obj[res.qx[j].mDataName]=true
          }else{
            qx_obj[res.qx[j].mDataName] = false
          }
        }
        // }
        console.log(qx_obj)
        this.setData({
          qx_FW: qx_obj
        })
        wx.stopPullDownRefresh()
      }
    })
    SysConfig.UserInfo.GetUserID().then((res) => {
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
          "XDLMD": "wwAnnualVacation,考勤补卡表,officialBusiness,公文,visitReception,Appmessage,AppNews,AppBook,wwProject",
          "XDLME": "no",
          "XDLMF": "no"
        }
      }).then((res) => {
        this.setData({
          num: res.rows.length
        })
      })
    })
    SysConfig.SubSystemData.request({
      istoken: true,
      method: "GET",
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030212311",
        "page": "1",
        "rows": "4"
      }
    }).then((res) => {
      var tzggArr=[]
      for(var i =0;i<res.rows.length;i++){
        tzggArr.push({
          ggbt:res.rows[i].ggbt,
          tjsj:res.rows[i].tjsj.slice(0,9),
          id:res.rows[i].id,
        })
      }
      this.setData({
        tzgg: tzggArr
      })
    })
  },

  onPullDownRefresh:function(e){
    this.onLoad()
  }
})

