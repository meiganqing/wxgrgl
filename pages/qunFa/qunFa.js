
var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "",//库内编码
    onChangemingcheng:"",//公文名称
    // showDep_type: false,//部门弹出层
    depxuanze:[],//部门弹出选择器数据
    dep:"",//选中的部门
    showrenyuan: false,//接收人弹出层
    renyuanlist: [],//人员显示
    renyuanlistarr: [],//人提交
    timedate: "",
    creator:"",//登录人名称
    creatorid:"",//登录人id
    depart:"",//登录人部门
    filearray:[],//附件数组
    fileid:"",//文件关联id
    mainActiveIndex: 0,//左侧选中项的索引
    activeId: [],// 右侧选中项的 id，支持传入数组
    sxpeople: [],
    rowiddata: {
      rowid: ""
    },
  },
  onLoad: function(options) {
    if (!options.id) {
      this.setData({
        judge_id: ""
      })
    } else {
      this.setData({
        judge_id: options.id
      })
    }
    //获取选择部门
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYYHGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH20190823102601261218191",
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((bmData) => {
      let depArr = []
      if (bmData.success) {
        for (var i = 0; i < bmData.rows.length; i++) {
          depArr.push(bmData.rows[i].DepartName)
        }
      }
      this.setData({
        depxuanze: depArr
      })
      return SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYYHGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20190823102601261253201",
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      })
    }).then((res) => {
      const { depxuanze } = this.data;
      let peoplearr = [];
      if (res.rows && res.rows.length > 0 && depxuanze.length > 0) {
        for (let i = 0; i < depxuanze.length; i++) {
          let _children = []
          for (let j = 0; j < res.rows.length; j++) {
            if (depxuanze[i] == res.rows[j].mDepart) {
              _children.push({
                text: res.rows[j].mUserName,
                id: res.rows[j].mUserID,
                // user_id: res.rows[j].mUserID,
                user_bm: res.rows[j].mDepart
              })
            }
          }
          peoplearr.push({
            text: depxuanze[i],
            disabled: false,
            children: _children
          })
        }
      }
      this.setData({
        sxpeople: peoplearr
      });
    })
    if (options.id){
      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030146222",
          "XDLMA": options.id
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      }).then((res) => {
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          onChangemingcheng: res.rows[0].gwmc,
          timedate: res.rows[0].zfsj,
          onChangeneirong: res.rows[0].fj,
          creator: res.rows[0].creator,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200317113731373146231",
            "XDLMA": res.rows[0].onlynum
          },
          method: "GET"   //请求方式  目前接口先暂时全部使用get方式
        })
      }).then((rydata)=>{
        let tryqrarr =[];
        let tryqrarr_name = "";
        let activeId=[]
        for (let i = 0; i < rydata.rows.length;i++){
            tryqrarr.push({
              "rowid": rydata.rows[i].id,
              "XDLM部门": rydata.rows[i].部门,
              "XDLM人员": rydata.rows[i].人员,
              "XDLM人员ID": rydata.rows[i].人员ID,
              "XDLM库内编号": rydata.rows[i].库内编号,
              "XDLM关联编号": rydata.rows[i].关联编号,
              "XDLM是否已读": rydata.rows[i].是否已读,
            })
          activeId.push(rydata.rows[i].人员ID);
          if (i == rydata.rows.length - 1) {
            tryqrarr_name += rydata.rows[i]["人员"]
          } else {
            tryqrarr_name += rydata.rows[i]["人员"] + ","
          }
        } 
        this.setData({
          renyuanlist: tryqrarr_name,
          renyuanlistarr: tryqrarr,
          activeId
        });
        return SysConfig.SubSystemData.request({//附件
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200218104720472064331",
            "XDLMB": this.data.onlynum
          },
          method: "GET" 
        })
      }).then((res)=>{
        let rowidfiledata=[];
        for (let i = 0; i < res.rows.length;i++){
          rowidfiledata.push({
            rowid: res.rows[i].id,
            name: res.rows[i].文件名,
            path: res.rows[i].文件地址
          })
        }
        this.setData({
          filearray: rowidfiledata
        })
        
      })
    }else{
      this.setData({
        onlynum: SysConfig.ToolBox.getTimeAndRandom(),
        timedate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
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
    //获取附件公文群发分类id
    SysConfig.UserInfo.GetSysToken().then((res) => {
      wx.request({
        url: SysConfig.http + "/xdData/xdDataManage.ashx?XAction=GetDataInterface&XKLX=SYBGGL",
        method: 'GET',
        data:{
          XDLMCID: '2000',
          XDLMSID: 'DYBH2020021916292503615945',
          XDLMTID: "2002",
          XDLMItemName: "类型",
          XDLMItemValue: "公文群发"
        },
        header: {
          'Authorization': res.data
        },
        success: (res) => {
          if (!res.data.success && res.data.message == "NOTLOGIN") {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            this.setData({
              fileid: res.data.substring(res.data.indexOf('"id":') + 5, res.data.indexOf(',"name"'))
            })
          }
        },
        //失败
        fail: (err) => {
          wx.showToast({
            title: "抱歉,出现了一个错误",
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
  },
  //公文名称
  gw_event: function (e) {
    this.setData({
      onChangemingcheng: e.detail
    })
  },
  //公文内容
  gwnr_event(e) {
    this.setData({
      onChangeneirong: e.detail
    })
  },
  // 人员选择
  showRenyuan_true() {//人员弹框开启
      this.setData({
        showrenyuan: true
      });
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickItem({ detail = {} }) {
    const { activeId } = this.data;
    const index = activeId.indexOf(detail.id);
    let tryqrarr = this.data.renyuanlistarr;
    let tryqrarr_name = ""
    if (index > -1) {
      if (this.data.rowiddata.rowid) {
        if (tryqrarr[index].rowid){
          SysConfig.SubSystemData.request({
            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数
              "XDLMCID": "4000",
              "XDLMSID": "DYBH20200317113731373151234",
              "XDLMROWID": tryqrarr[index].rowid
            },
            method: "GET"
          })
        }
      }
      tryqrarr.splice(index, 1);
      activeId.splice(index, 1);
    } else {
      tryqrarr.push({
        "XDLM部门": detail.user_bm,
        "XDLM人员": detail.text,
        "XDLM人员ID": detail.id,
        "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
        "XDLM关联编号": this.data.onlynum,
        "XDLM是否已读": "否",
      })
      activeId.push(detail.id);
      // console.log(tryqrarr)
      // console.log(activeId)
    }
    for (let i = 0; i < tryqrarr.length; i++) {
      if (i == tryqrarr.length - 1) {
        // console.log(tryqrarr[i]["XDLM人员"])
        tryqrarr_name += tryqrarr[i]["XDLM人员"]
      } else {
        tryqrarr_name += tryqrarr[i]["XDLM人员"] + ","
      }
    }
    // console.log(tryqrarr_name)
    this.setData({
      renyuanlist: tryqrarr_name,
      renyuanlistarr: tryqrarr,
      activeId
    });
    // console.log(this.data.renyuanlist)
    // console.log(this.data.renyuanlistarr)
    // console.log(this.data.activeId)
  },
  showrenyuan_close(e) {
    console.log(e)
    this.setData({ showrenyuan: false })
  },
  tiaoUrl() {//历史记录
    wx.navigateTo({
      url: '/pages/gwqf_sqjl/gwqf_sqjl'
    })
  },
  // 提交表单
  submitTijiao() {
    let dataparams = {}
    if (!this.data.onChangemingcheng) {
      wx.showToast({
        title: "请输入公文名称",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.renyuanlist) {
      wx.showToast({
        title: "请选择接收人",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.timedate) {
      wx.showToast({
        title: "请选择发送时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.onChangeneirong) {
      wx.showToast({
        title: "请填写公文内容",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.rowiddata.rowid) {
      dataparams = {
        "XDLMCID": "6000",
        "XDLMSID": "DYBH201908231020302030135225",
        "XDLMID": this.data.rowiddata.rowid,
        "XDLMmessage": this.data.onChangemingcheng + "{***}",
        "XDLMtitle": this.data.onChangemingcheng,
        "XDLMgwmc": this.data.onChangemingcheng,
        "XDLMzfsj": this.data.timedate,
        "XDLMfj": this.data.onChangeneirong
      }
    }else{
      dataparams={
        "XDLMCID": "5000",
        "XDLMSID": "DYBH2019082310203020305223",
        "XDLMonlynum": this.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMcreator_id": this.data.creatorId,
        "XDLMmessage": this.data.onChangemingcheng + "{***}",
        "XDLMtitle": this.data.onChangemingcheng,
        "XDLMisInterrupt": "no",
        "XDLMxmlcid": "SY202003071225282528242",
        "XDLMcurrentLCxh": "1",
        "XDLMgwmc": this.data.onChangemingcheng,
        "XDLMzfsj": this.data.timedate,
        "XDLMfj": this.data.onChangeneirong
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,
      method: "GET"
    }).then((data) => {
      let ryarr = this.data.renyuanlistarr
      let ryarr_data=[]
      for (let i = 0; i < ryarr.length;i++){
        if (!ryarr[i].rowid){
              ryarr_data.push(ryarr[i])
          }
      }
      return SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "5001",
          "XDLMSID": "DYBH2020031711390201378368",
          "datalist": JSON.stringify({ "key": ryarr_data })
        },
        method: "GET"
      })
    }).then((res) => {
      // if (!this.data.rowiddata.rowid) {
      console.log(this.data.filearray)
        let file_data = this.data.filearray
        let file_data_obj = []
        for (let i in file_data) {
          if (!file_data[i].rowid){
            file_data_obj.push({
              "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
              "XDLM关联编号": this.data.onlynum,
              "XDLM文件名": file_data[i].name,
              "XDLM原文件名": file_data[i].name,
              "XDLM文件地址": file_data[i].path,
              "XDLM类型": this.data.fileid,
              "XDLM添加人": this.data.creator
            })
          }
        }
        SysConfig.SubSystemData.request({
          istoken: true,
          XKLX: "SYBGGL",
          XAction: "GetDataInterface",
          data: {
            "XDLMCID": '5001',
            "XDLMSID": 'DYBH2020032619111906955409',
            "datalist": JSON.stringify({ "key": file_data_obj })
          },
          method: "GET"
        })
      // }
      return SysConfig.WorkflowManage.create(this.data.onlynum, '公文群发')
    }).then((shlc) => {
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
              url: '/pages/gwqf_sqjl/gwqf_sqjl'
            })
            }
          }
        })
      })
  },
  // 上传文件
  upload: function(e) {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let filenandp={};
        filenandp.name = res.tempFiles[0].name
        SysConfig.Upload.upLoadFile(res.tempFiles[0].path,res.tempFiles[0].name).then((res)=>{
          let allfile=[]
          filenandp.path = JSON.parse(res.data).filepath
          allfile = that.data.filearray
          allfile.push(filenandp)
          that.setData({
            filearray: allfile
            });
        })
      }
    })
  },
  showfile(e){
    SysConfig.Upload.downloadFile(e.currentTarget.dataset.id)
  },
  delefile(e) {
    console.log(e)
    if (this.data.rowiddata.rowid && e.currentTarget.dataset.rowid) {
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "4000",
          "XDLMSID": "DYBH202002181047204720115334",
          "XDLMROWID": e.currentTarget.dataset.rowid
        },
        method: "GET"
      })
    }
    let UploadData = this.data.filearray
    UploadData.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      filearray: UploadData
    });
  } 
})