
var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "",//库内编码
    showrenyuan: false,//接收人弹出层
    renyuanlist: "",//人员显示
    renyuanlistarr: [],//人提交
    timedate: "",//时间
    creator: "",//登录人名称
    creatorId: "",//登录人id
    depart: "",//登录人部门
    filearray: [],//附件数组
    fileid: "公文流转",//文件关联id
    mainActiveIndex: 0,//左侧选中项的索引
    activeId: null,// 右侧选中项的 id，支持传入数组
    sxpeople: [],
    rowiddata: {
      rowid: ""
    },
    echodata:{//回显数据时使用
        添加时间:"",
        来文机关:"",
        文件字号:"",
        收文编号:"",
        拟办意见:"",
        内容:""
    },
    title:"",//公文标题
  },
  onLoad: function (options) {
    //获取选择部门
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYYHGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH20190823102601261218191",
      },
      method: "GET"
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
    if (options.id) {
      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH202007101118581858144452",
          "XDLMA": options.id
        },
        method: "GET"
      }).then((res) => {
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          title:res.rows[0].title,
          echodata:res.rows[0],
          onlynum:res.rows[0].onlynum,
          creatorId:res.rows[0].creator_id
        })
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200317113731373146231",
            "XDLMA": this.data.onlynum
          },
          method: "GET"
        })
      }).then((rydata) => {
        let tryqrarr = [];
        let tryqrarr_name = "";
        let activeId = []
        for (let i = 0; i < rydata.rows.length; i++) {
          tryqrarr.push({
            "rowid": rydata.rows[i].id,
            "XDLM部门": rydata.rows[i].部门,
            "XDLM人员": rydata.rows[i].人员,
            "XDLM人员ID": rydata.rows[i].人员ID,
            "XDLM库内编号": rydata.rows[i].库内编号,
            "XDLM关联编号": rydata.rows[i].关联编号,
            "XDLM是否已读": rydata.rows[i].是否已读,
          })
          if (i == rydata.rows.length - 1) {
            tryqrarr_name += rydata.rows[i]["人员"]
          } else {
            tryqrarr_name += rydata.rows[i]["人员"] + ","
          }
        }
        activeId=rydata.rows[0].人员ID;
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
      }).then((res) => {
        let rowidfiledata = [];
        for (let i = 0; i < res.rows.length; i++) {
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
    } else {
      this.setData({
        ['echodata.添加时间']: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        onlynum: SysConfig.ToolBox.getTimeAndRandom(),
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
  //公文标题
  titleChange(e){
    this.setData({
      title:e.detail
    })
  },
  gwjg(e){
    this.setData({
      ['echodata.来文机关']:e.detail
    })
  },
  wjzh(e){
    this.setData({
      ['echodata.文件字号']:e.detail
    })
  },
  swbh(e){
    this.setData({
      ['echodata.收文编号']:e.detail
    })
  },
  nbyj(e){
    this.setData({
      ['echodata.拟办意见']:e.detail
    })
  },
  gwnr(e){
    this.setData({
     ['echodata.内容']:e.detail
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
    let { activeId } = this.data;
    // const index = activeId.indexOf(detail.id);
    let tryqrarr = this.data.renyuanlistarr;
    let tryqrarr_name = "";
    let tryqrarr_=[];
    if(detail.id==this.data.creatorId){
      wx.showToast({
        title: "请勿选择自己！",
        icon: 'none',
        duration: 1000,
        complete: () => {
        }
      })
    }else{
    if (this.data.rowiddata.rowid) {
      if (tryqrarr.length>0&&tryqrarr[0].rowid) {
        SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "4000",
            "XDLMSID": "DYBH20200317113731373151234",
            "XDLMROWID": tryqrarr[0].rowid
          },
          method: "GET"
        })
      }
    }
    if (activeId!=detail.id) {
      tryqrarr_.push({
        "XDLM部门": detail.user_bm,
        "XDLM人员": detail.text,
        "XDLM人员ID": detail.id,
        "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
        "XDLM关联编号": this.data.onlynum,
        "XDLM是否已读": "否",
        "XDLM是否部门科室": "否"
      })
      activeId=detail.id
    } else {
      tryqrarr_=[]
      activeId=null
    }
    for (let i = 0; i < tryqrarr_.length; i++) {
      if (i == tryqrarr_.length - 1) {
        tryqrarr_name += tryqrarr_[i]["XDLM人员"]
      } else {
        tryqrarr_name += tryqrarr_[i]["XDLM人员"] + ","
      }
    }
    this.setData({
      renyuanlist: tryqrarr_name,
      renyuanlistarr: tryqrarr_,
      activeId
    });
  }
  },
  showrenyuan_close(e) {
    this.setData({ showrenyuan: false })
  },
  tiaoUrl() {//历史记录
    wx.navigateTo({
      url: '/pages/gwcy_sqjl/gwcy_sqjl'
    })
  },
  // 提交表单
  submitTijiao() {
    let dataparams = {}
    let gwcy_next_node_ry_name;
    let gwcy_next_node_ry_id;
    let gwlz_data;
    if(!this.data.title){
      wx.showToast({
        title: "请输入公文标题",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.renyuanlist) {
      wx.showToast({
        title: "请选择审核人",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.rowiddata.rowid) {
      dataparams = {
        "XDLMCID": "6000",
        "XDLMSID": "DYBH202007101118581858193455",
        "XDLMID": this.data.rowiddata.rowid,
        "XDLMtheme": this.data.title,
        "XDLMtitle": this.data.title,
        "XDLMmessage": this.data.title + "{***}",
        "XDLM来文机关": this.data.echodata['来文机关'],
        "XDLM文件字号": this.data.echodata['文件字号'],
        "XDLM收文编号": this.data.echodata['收文编号'],
        "XDLM拟办意见": this.data.echodata['拟办意见'],
        "XDLM内容": this.data.echodata['内容']
      }
    } else {
      dataparams = {
        "XDLMCID": "5000",
        "XDLMSID": "DYBH20200710111858185858453",
        "XDLMonlynum": this.data.onlynum,
        "XDLMshzt": "待提交",
        "XDLMcreator": this.data.creator,
        "XDLMcreator_id": this.data.creatorId,
        "XDLMdepart": this.data.depart,
        "XDLMisInterrupt": "no",
        "XDLMxmlcid": "2020071611160704620006",
        "XDLM添加时间": this.data.echodata['添加时间'],

        "XDLMtheme": this.data.title,
        "XDLMtitle": this.data.title,
        "XDLMmessage": this.data.title + "{***}",
        "XDLM来文机关": this.data.echodata['来文机关'],
        "XDLM文件字号": this.data.echodata['文件字号'],
        "XDLM收文编号": this.data.echodata['收文编号'],
        "XDLM拟办意见": this.data.echodata['拟办意见'],
        "XDLM内容": this.data.echodata['内容']

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
      let ryarr_data = []
      for (let i = 0; i < ryarr.length; i++) {
        if (!ryarr[i].rowid) {
          ryarr_data.push(ryarr[i])
        }
      }
      if(ryarr_data.length>0){
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
      }
    }).then((res) => {
      console.log(this.data.filearray)
      let file_data = this.data.filearray
      let file_data_obj = []
      for (let i in file_data) {
        if (!file_data[i].rowid) {
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
      if(file_data_obj.length>0){
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
      }
      return SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          XDLMCID: '1001',
          XDLMSID: 'DYBH202007101118581858226451',
          XDLMG:this.data.onlynum
        },
        method: "GET"
      })
    
    }).then((gwlzdata)=>{
      console.log(gwlzdata)
      gwlz_data=gwlzdata
      return SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          "XDLMCID": '1001',
          "XDLMSID": 'DYBH20200317113731373146231',
          "XDLMA": this.data.onlynum
        },
        method: "GET"
      })
      
    }).then((rydata)=>{
      for (let i in rydata.rows) {
          if (rydata.rows[i].是否已读 == "否") {
              gwcy_next_node_ry_name = rydata.rows[i].人员
              gwcy_next_node_ry_id = rydata.rows[i].人员ID
              break;
          }
      }
     return SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          XDLMCID: '9000',
          XDLMTID: '9210',
          XDLMSID: '9210001',
          xmonlynum: this.data.onlynum, //项目唯一编码
          lconlynum: gwlz_data.rows[0].xmlcid, //流程唯一编码
          jdbh: "2", //节点编号
          senderID:  this.data.creatorId,
          recipientID: gwcy_next_node_ry_id
        },
        method: "GET"
      })
    }).then((shlc) => {
       SysConfig.SubSystemData.request({
        istoken: true,
        XKLX: "SYBGGL",
        XAction: "GetDataInterface",
        data: {
          XDLMCID: '6000',
          XDLMSID: 'DYBH202007101118581858193455',
          XDLMID: gwlz_data.rows[0].id,
          XDLMshzt: "待完成"
        },
        method: "GET"
      })
      let icon;
      if (shlc.success) {
        icon = 'success';
      } else {
        icon = 'none';
      }
      wx.showToast({
        title:"已提交，请等待" + gwcy_next_node_ry_name + "审核或反馈！",
        icon: 'success',
        duration: 2000,
        success: () => {
          if (this.data.rowiddata.rowid != "") {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.redirectTo({
              url: '/pages/gwcy_sqjl/gwcy_sqjl'
            })
          }
        }
      })
    })
  },
  // 上传文件
  upload: function (e) {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let filenandp = {};
        filenandp.name = res.tempFiles[0].name
        SysConfig.Upload.upLoadFile(res.tempFiles[0].path, res.tempFiles[0].name).then((res) => {
          let allfile = []
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
  showfile(e) {
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