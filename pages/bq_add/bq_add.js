// pages/shenqingBQ/shenqingBQ.js
var SysConfig = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mUserId: "",
    部门:"",
    creator:"",
    onlynum:"",
    creator:"",//姓名
    creatorId:"",//userid
    depart: "",//部门
    tjr:"",//添加人
    qj_show: false,//请假弹框
    jiaqiarr: [],//请假类型select
    kqj:"",//考勤机
    xmwyid:"",//项目唯一ID
    leaveReason:"",//备注
    project_search: "",//项目名称搜索
   rowiddata:{
     rowid:""
   }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    if (options.id){
      if (!options.id) {
        this.setData({
          judge_id: ""
        })
      } else {
        this.setData({
          judge_id: options.id
        })
      }
      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYRSGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20200313134640464089322",
          "XDLMA": options.id
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      }).then((res)=>{
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          mUserName: res.rows[0].creator,
          depart: res.rows[0].部门,
          pageParams: {
            gzr: res.rows[0].补卡时间,
            linkid:  res.rows[0].关联编号,
            dksj: res.rows[0].补卡时间.slice(0,9)
          },
          project_name: res.rows[0].项目名称,
          message: res.rows[0].备注,
          项目唯一ID: res.rows[0].项目唯一ID,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })
      })
    }else{

      this.setData({
        onlynum: "BQ" + SysConfig.ToolBox.getTimeAndRandom(),
        pageParams: {
          gzr: options.gzr,
          linkid: options.linkid,
          dksj:options.gzr.slice(0,9)
        }
      })
     
     
      SysConfig.UserInfo.GetUserName().then((res) => {
        this.setData({
          mUserName: res.data
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
    // 获取项目
    SysConfig.SubSystemData.request({
      istoken:  true, //是否使用token
      XKLX:   "SYRSGL", //接口XKLX参数
      XAction:   "GetDataInterface", //接口XAction参数
      data:  { //接口body体内参数
        "XDLMCID":   "1001",
        "XDLMSID": "DYBH202003121430163016170221",
      },
      method:"GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      //接口成功之后返回值 失败则不会返回
      if (data.success) {
        let jiaqi = [];
        for (let i in data.rows) {
            if (data.rows[i].默认项目=="是"){
              this.setData({
                project_name: data.rows[i].项目名称,
                project_code: data.rows[i].项目编号,
                checkjiaqi: data.rows[i].项目名称 + "  " + data.rows[i].项目编号
              })
            }
            jiaqi.push({
              text: data.rows[i].项目名称 + "  " + data.rows[i].项目编号,
              Arrykqj: data.rows[i].钉钉考勤机.split(",")[0],
              Arryxmwy:data.rows[i].唯一ID,
              name: data.rows[i].项目名称,
              code: data.rows[i].项目编号
            })
          
        }
        this.setData({
          jiaqiarr: jiaqi,
        
        })
      }
    })
  },

    //请假事由
    onChangeReason(event) {
      this.setData({
        leaveReason: event.detail
      })
    },
    tiaoUrl() {
      wx.navigateTo({
        url: '/pages/bq_sqjl/bq_sqjl'
      })
    },
  submitTijiao() {
    let dataparams={}
    var that = this
    if (!that.data.project_name){
      wx.showToast({
        title: "请选择项目类型",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.rowiddata.rowid){
      dataparams={
        "XDLMCID": "6000",
        "XDLMSID": "DYBH202003131346404640201325",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMcreator": that.data.mUserName,
        "XDLM添加人":that.data.mUserName,
        "XDLM考勤机": that.data.kqj,
        "XDLM项目名称": that.data.project_name,
        "XDLM项目唯一ID": that.data.xmwyid,
        "XDLM备注":that.data.leaveReason,
        "XDLM工作日": that.data.pageParams.dksj,
        "XDLM补卡时间": that.data.pageParams.gzr,
      }
    }else{
      dataparams={
        "XDLMCID": "5000",
        "XDLMSID": "DYBH20200313134640464048323",
        "XDLMonlynum": that.data.onlynum,
        "XDLM关联编号": that.data.pageParams.linkid,
        "XDLM部门": that.data.depart,
        "XDLMcreator": that.data.mUserName,
        "XDLMcreator_id": that.data.creatorId,
        "XDLM添加人":that.data.mUserName,
        "XDLMtitle": that.data.mUserName + '的补卡申请',
        "XDLM项目名称": that.data.project_name,
        "XDLM考勤机": that.data.kqj,
        "XDLM项目唯一ID":that.data.xmwyid,
        "XDLMshzt": "待提交",
        "XDLM备注":that.data.leaveReason,
        "XDLM工作日":that.data.pageParams.dksj,
        "XDLM补卡时间":that.data.pageParams.gzr,
      }
    }
    // 2.提交表单
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYRSGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      method: "GET",
      data: dataparams,
    }).then((data) => {
      console.log(data)
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
    }).then((data) => {
      console.log(data)
          if(data.rows[0].isbmzr =="1"){
            if(data.rows[0].Position == "院长" || data.rows[0].Position == "所长"){
               return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请_院长');
            }else if(data.rows[0].Position == "副院长" || data.rows[0].Position == "副所长"){
               return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请_主任');
            }else{
               return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请_主任');
            }
        }else if(data.rows[0].Position == "院长" || data.rows[0].Position == "所长"){
           return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请_院长');
        }else if(data.rows[0].Position == "副院长" || data.rows[0].Position == "副所长"){
           return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请_主任');
        }else{
           return SysConfig.WorkflowManage.create(that.data.onlynum, '补卡申请');
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
            url: '/pages/bq_sqjl/bq_sqjl'
          })
          }
        }
      })
    })
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
  onConfirm(e) {
    this.setData({
      qj_show: false,
      checkjiaqi: e.detail.value.text,
      project_name: e.detail.value.name,
      project_code: e.detail.value.code,
      kqj:e.detail.value.Arrykqj,
      xmwyid:e.detail.value.Arryxmwy
    });
  },

  project_search_Change(e) {
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYRSGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202003121430163016170221",
        "QueryKey": e.detail,
        "QueryType": "模糊查询"
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      if (data.success) {
        let jiaqi = [];
        for (let i in data.rows) {
          jiaqi.push({
             text: data.rows[i].项目名称 + "  " + data.rows[i].项目编号,
            Arrykqj: data.rows[i].钉钉考勤机.split(",")[0],
            Arryxmwy: data.rows[i].唯一ID,
            name: data.rows[i].项目名称,
            code: data.rows[i].项目编号
          })
        }
        console.log(data)
        this.setData({
          jiaqiarr: jiaqi,
        })
      }
    })
  },
})

