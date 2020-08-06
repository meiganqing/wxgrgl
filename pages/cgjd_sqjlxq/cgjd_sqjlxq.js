// pages/chuchaiDetail/chuchaiDetail.js
var SysConfig = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    steps: [],//所有步骤
    active: 0,//	当前步骤
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

      }
    })
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        useData: {
          mUserID: res.data
        }
      })
      return SysConfig.SubSystemData.request({ // 获取主表单行数据
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030256172",
          "XDLMA": this.data.pageParams.rowid,
        },
        method: "GET"
      })
    }).then((res) => {
      console.log(res)
      if (res.rows) {
        SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
        this.setData({
          rowidData: {
            visitTime: res.rows[0].visitTime,
            nameList: res.rows[0].nameList,
            visitingUnit: res.rows[0].visitingUnit,
            visitingpeo: res.rows[0].visitingpeo,
            creator: res.rows[0].creator,
            entourage: res.rows[0].entourage,
            visitContent: res.rows[0].visitContent,
            remark: res.rows[0].remark,
            title: res.rows[0].title,
          },
          active: res.rows[0].currentLCxh - 1
        })
        return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        lzyj_data: res
      })
      return SysConfig.WorkflowManage.getWorkflowNodesState()
    }).then((res) => {
      this.setData({
        steps: res
      })
    })
  },
})