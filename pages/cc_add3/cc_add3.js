
var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "",
    creator: "",//姓名
    creatorId: "",//userid
    depart: "",//部门
    zb:"",//类别
    cctype:"",//出差类型
    cctypearr: [],//出差类型_弹框数据
    showleixing: false,//出差类型_弹框隐显
    showDep_show: false,//部门_弹框隐显
    renyuanlist:[],//随行人员显示
    renyuanlistarr: [],//随行人员添加
    jiaotongmsg:"",//交通工具
    traffic_show: false,//交通工具_弹框隐显
    jiaotongArr: [],//交通工具_弹框数据
    sCity:"陕西省-西安市-雁塔区",//出发城市
    S_province_show: false,//出发城市省 弹框
    S_province_data:[],//出发城市省
    S_province_value: "",  
    S_city_show: false,//出发城市市 弹框
    S_city_data:[],//市
    S_city_value: "",  
    S_county_show: false,//出发城市区 弹框
    S_county_data:[],//区
    S_county_value: "",  

    E_province_show: false,//目的城市省 弹框
    E_province_data: [],//目的城市省
    E_province_value: "",
    E_city_show: false,//目的城市省 弹框
    E_city_data: [],//市
    E_city_value: "",
    E_county_show: false,//目的城市省 弹框
    E_county_data: [],//区
    E_county_value: "",  

    sDate:"",//开始时间
    sDate_data:"",
    showStart: false,//开始时间弹框
    eDate: "",//结束时间
    eDate_data: "",
    showEnd: false,//结束时间弹框
    reason: "",//申请事由
    days: "",//时长共计
    radio:"行政经费",
    _jsshow: false,//项目名称显示
    project_name:"",//项目名称
    project_code: "",//项目编号
    project_show:false,//项目名称弹框
    project_search: "",//项目名称搜索

    mainActiveIndex: 0,//左侧选中项的索引
    activeId: [],// 右侧选中项的 id，支持传入数组
    sxpeople: [],
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
    // 获取出差类型
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202002181357205720121351",
        "XDLMA": "出差类型",
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      if (data.success) {
        let arr = []
        for (var i = 0; i < data.rows.length; i++) {
          arr.push(data.rows[i].统计内容)
        }
        this.setData({
          cctypearr: arr //类型
        })
      }
    })
    // 获取交通类型
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202002181357205720121351",
        "XDLMA": "交通工具",
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      // console.log(data)
      if (data.success) {
        let arr = []
        for (var i = 0; i < data.rows.length; i++) {
          arr.push(data.rows[i].统计内容)
        }
        this.setData({
          jiaotongArr: arr
        })
      }
    })
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
          "XDLMSID": "DYBH20190823102030203013692",
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
          renyuanlist: res.rows[0].出差人员,
          cctype: res.rows[0].type,
          jiaotongmsg: res.rows[0].coMedia,
          eDate: res.rows[0].eTime,
          eDate_data: new Date(res.rows[0].eTime).getTime(),
          sDate: res.rows[0].sTime,
          sDate_data: new Date(res.rows[0].sTime).getTime(),
          reason : res.rows[0].reason,
          eCity:res.rows[0].eCity,
          sCity:res.rows[0].sCity,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
          days:res.rows[0].duringDate,
          radio:res.rows[0].SourcesFunding,
          _jsshow: res.rows[0].SourcesFunding =="项目经费"?true:false,
          project_code:res.rows[0].xmbh,
          project_name:res.rows[0].xmmc,
        })
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH20200313173552355214531",
            "XDLMA": res.rows[0].onlynum
          },
          method: "GET"   //请求方式  目前接口先暂时全部使用get方式
        })
        }).then((rydata)=>{
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
            "XDLM关联编号": rydata.rows[i].联编号,
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
      })
    }else{
      this.setData({
        onlynum: SysConfig.ToolBox.getTimeAndRandom(),
        sDate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        sDate_data: new Date().getTime(),
        eDate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
        eDate_data: new Date().getTime()
      });
      // 获取人名
      SysConfig.UserInfo.GetUserName().then((res) => {
        this.setData({
          creator: res.data
        })
      })
        // 获取人员id
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        creatorId: res.data,
      })
      return SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYYHGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20190823102601261253201",
          "XDLMH": res.data
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      })
    }).then((data) => {
      this.setData({
        zb: data.rows[0].zc
      })
    })
    // 获取部门
    SysConfig.UserInfo.GetUserDepart().then((res) => {
      this.setData({
        depart: res.data
      })
    })
    this.setData({
      days: datedifference(this.data.sDate, this.data.eDate)
    });
  }
},

  //类型弹框展示
  showType() {
    this.setData({
      showleixing: true
    });
  },
  
  // 类型弹框完成
  cctype_confirm(e){
    this.setData({
      showleixing: false,
      cctype: e.detail.value
    });
  },
  cctype_cancel(e) {
    this.setData({
      showleixing: false,
    });
  },
//交通工具
  traffic_event() {
    this.setData({
      traffic_show: true
    });
  },
  traffic_confirm(e){
    this.setData({
      jiaotongmsg: e.detail.value,
      traffic_show: false
    });
  },
  traffic_cancel(e) {
    this.setData({
      traffic_show: false
    });
  },
  // 人员弹框
  showRenyuan(){
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
              "XDLMSID": "DYBH20200313173552355221034",
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
        "XDLM关联编号": this.data.onlynum
      })
      activeId.push(detail.id);
    }
    for (let i = 0; i < tryqrarr.length; i++) {
      if (i == tryqrarr.length - 1) {
        tryqrarr_name += tryqrarr[i]["XDLM人员"]
      } else {
        tryqrarr_name += tryqrarr[i]["XDLM人员"] + ","
      }
    }
    this.setData({
      renyuanlist: tryqrarr_name,
      renyuanlistarr: tryqrarr,
      activeId
    });
  },
  showrenyuan_close(e) {
    this.setData({ showrenyuan: false })
  },

  // 出发城市弹出层
  S_province() {//出发省级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: { 
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": "-1",
      },
      method: "GET"
    }).then((data) => {
      let province_name=[]
      if (data.rows && data.rows.length>0){
        for (let i in data.rows){
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        console.log(province_name)
        this.setData({
          S_province_show: true,
          S_province_data: province_name
        })
      }
    })
  },
  S_province_confirm(event){
    console.log(event.detail.value.text)
    this.setData({
      S_province_show: false,
      S_province_value: event.detail.value.text,
      sCity: event.detail.value.text,
      S_province_id: event.detail.value.type_id,
      S_city_value:"",
      S_county_value:""
    })
  },
  S_province_cancel() {
    this.setData({
      S_province_show: false
    })
  },
  S_city() {//出发市级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": this.data.S_province_id,
      },
      method: "GET"
    }).then((data) => {
      let province_name = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        this.setData({
          S_city_show: true,
          S_city_data: province_name
        })
      }
    })
  },
  S_city_confirm(event) {
    let _sCity = this.data.S_province_value + "-" + event.detail.value.text
    this.setData({
      S_city_show: false,
      S_city_value: event.detail.value.text,
      sCity: _sCity,
      S_city_id: event.detail.value.type_id,
      S_county_value: ""
    })
  },
  S_city_cancel() {
    this.setData({
      S_city_show: false
    })
  },
  S_county() {//出发区级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": this.data.S_city_id,
      },
      method: "GET"
    }).then((data) => {
      let province_name = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        this.setData({
          S_county_show: true,
          S_county_data: province_name
        })
      }
    })
  },
  S_county_confirm(event) {
    let _sCity = this.data.S_province_value + "-" + this.data.S_city_value + "-"  + event.detail.value.text
    this.setData({
      S_county_show: false,
      S_county_value: event.detail.value.text,
      sCity: _sCity
    })
  },
  S_county_cancel() {
    this.setData({
      S_county_show: false
    })
  },
  // 目的城市弹出层
  E_province() {//目的省级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": "-1",
      },
      method: "GET"
    }).then((data) => {
      let province_name = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        this.setData({
          E_province_show: true,
          E_province_data: province_name
        })
      }
    })
  },
  E_province_confirm(event) {
    console.log(event.detail.value.text)
    this.setData({
      E_province_show: false,
      E_province_value: event.detail.value.text,
      eCity: event.detail.value.text,
      E_province_id: event.detail.value.type_id,
      E_city_value: "",
      E_county_value: ""
    })
  },
  E_province_cancel() {
    this.setData({
      E_province_show: false
    })
  },
  E_city() {//出发市级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": this.data.E_province_id,
      },
      method: "GET"
    }).then((data) => {
      let province_name = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        this.setData({
          E_city_show: true,
          E_city_data: province_name
        })
      }
    })
  },
  E_city_confirm(event) {
    let _sCity = this.data.E_province_value + "-" + event.detail.value.text
    this.setData({
      E_city_show: false,
      E_city_value: event.detail.value.text,
      eCity: _sCity,
      E_city_id: event.detail.value.type_id,
      E_county_value: ""
    })
  },
  E_city_cancel() {
    this.setData({
      E_city_show: false
    })
  },
  E_county() {//出发区级
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH202006240941494149160331",
        "XDLMA": this.data.E_city_id,
      },
      method: "GET"
    }).then((data) => {
      let province_name = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          province_name.push({
            type_id: data.rows[i].分类id,
            text: data.rows[i].分类名
          })
        }
        this.setData({
          E_county_show: true,
          E_county_data: province_name
        })
      }
    })
  },
  E_county_confirm(event) {
    let _sCity = this.data.E_province_value + "-" + this.data.E_city_value + "-"+ event.detail.value.text
    this.setData({
      E_county_show: false,
      E_county_value: event.detail.value.text,
      eCity: _sCity
    })
  },
  E_county_cancel() {
    this.setData({
      E_county_show: false
    })
  },
  // 开始时间弹出层
  showPopupstartTime() {
    this.setData({
      showStart: true
    });
  },
  cancel_sDate() {//开始时间取消
    this.setData({
      showStart: false
    });
  },
  confirm_sDate(e) {//开始时间确定
    if (this.data.eDate) {
      let dayNums = datedifference(SysConfig.ToolBox.transTime(e.detail, true), this.data.eDate);
      if (dayNums == 0) {
        this.setData({
          sDate_data: e.detail,
          showStart: false,
          sDate: "",
          days: ""
        });
      } else {
        this.setData({
          sDate_data: e.detail,
          showStart: false,
          sDate: SysConfig.ToolBox.transTime(e.detail, true),
          days: dayNums
        });
      }
    } else {
      this.setData({
        sDate_data: e.detail,
        showStart: false,
        sDate: SysConfig.ToolBox.transTime(e.detail, true),
        days: ""
      });
    }
  },
  // 结束时间弹出层
  showPopupendTime() {
    this.setData({
      showEnd: true
    });
  },
  cancel_eDate() {//结束时间取消
    this.setData({
      showEnd: false
    });
  },
  confirm_eDate(e) {//结束时间确定
    if (this.data.sDate) {
      let dayNums = datedifference(this.data.sDate,SysConfig.ToolBox.transTime(e.detail, true));
      console.log(dayNums)
      if (dayNums == 0) {
        this.setData({
          eDate_data: e.detail,
          showEnd: false,
          eDate: "",
          days:""
        });
      }else{
        this.setData({
          eDate_data: e.detail,
          showEnd: false,
          eDate: SysConfig.ToolBox.transTime(e.detail, true),
          days: dayNums
        });
      }
    } else {
      this.setData({
        eDate_data: e.detail,
        showEnd: false,
        eDate: SysConfig.ToolBox.transTime(e.detail, true),
        days: "",
      });
    }
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/cc_sqjl/cc_sqjl'
    })
  },
  // 单选框选择
  onClickdan(event) {
    const event_dataset = event.currentTarget.dataset
    if (event_dataset.name == "行政经费") {
      this.setData({
        radio: event_dataset.name,
        project_name:"",
        project_code:"",
        _jsshow: false
      });
    } else {
      this.setData({
        radio: event_dataset.name,
        _jsshow: true
      });
    }
  },
  project_click(){
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYXMGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231026422642127211",
        "QueryKey": this.data.project_search,
        "QueryType": "模糊查询"
      },
      method: "GET"
    }).then((data) => {
      let project_name_arr = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          project_name_arr.push({
            text: data.rows[i].xmmc + "  " + data.rows[i].xmbh,
            name: data.rows[i].xmmc,
            code: data.rows[i].xmbh
          })
        }
        this.setData({
          project_show: true,
          project_data: project_name_arr
        })
      }
    })
  },
  project_confirm(event){
    this.setData({
      project_show: false,
      project_name: event.detail.value.name,
      project_code: event.detail.value.code
    })
  },
  project_cancel() {
    this.setData({
      project_show: false
    })
  },
  project_search_Change(e) {
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYXMGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231026422642127211",
        "QueryKey": e.detail,
        "QueryType": "模糊查询"
      },
      method: "GET"
    }).then((data) => {
      let project_name_arr = []
      if (data.rows && data.rows.length > 0) {
        for (let i in data.rows) {
          project_name_arr.push({
            text: data.rows[i].xmmc + "  " +data.rows[i].xmbh,
            name: data.rows[i].xmmc,
            code: data.rows[i].xmbh,
          })
        }
        this.setData({
          project_search: e.detail,
          project_data: project_name_arr
        })
      }
    })
  },
  // 事由
  onChangeReason(event) {
    this.setData({
      reason: event.detail
    })
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (!this.data.cctype) {
      wx.showToast({
        title: "请选择类型",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.jiaotongmsg) {
      wx.showToast({
        title: "请选择交通工具",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.sCity) {
      wx.showToast({
        title: "请选择出发城市",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.eCity) {
      wx.showToast({
        title: "请选择目的城市",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.reason) {
      wx.showToast({
        title: "请填写出差事由",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!this.data.sDate) {
      wx.showToast({
        title: "请选择开始时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.eDate) {
      wx.showToast({
        title: "请选择结束时间",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.radio) {
      wx.showToast({
        title: "请选择经费来演",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.rowiddata.rowid){
      dataparams={
        "XDLMCID": "6000",
        "XDLMSID": "DYBH20190823102030203018395",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMtype": that.data.cctype,
        "XDLMcoMedia": that.data.jiaotongmsg,
        "XDLMeTime": that.data.eDate,
        "XDLMsTime": that.data.sDate,
        "XDLMreason": that.data.reason,
        "XDLMeCity": that.data.eCity,
        "XDLMsCity": that.data.sCity,
        "XDLMonlynum": that.data.onlynum,
        "XDLMduringDate": that.data.days,
        "XDLMSourcesFunding": that.data.radio,
        "XDLMxmmc": that.data.project_name,
        "XDLMxmbh": that.data.project_code,
      }
    }else{
      dataparams={
      "XDLMCID": "5000",
      "XDLMSID": "DYBH20190823102030203012293",
      "XDLMonlynum": this.data.onlynum,
      "XDLMshzt": "待提交",
      "XDLMfqr": this.data.creator,
      "XDLMzb": this.data.zb,
      "XDLMfqsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
      "XDLMtitle": this.data.creator + '的出差申请',
      "XDLMcreator": this.data.creator,
      "XDLMcreator_id": this.data.creatorId,
      "XDLMdepart": this.data.depart,
      "XDLMtype": this.data.cctype,
      "XDLMsTime": this.data.sDate,
      "XDLMeTime": this.data.eDate,
      "XDLMduringDate": this.data.days,
      "XDLMcoMedia": this.data.jiaotongmsg,
      "XDLMsCity": this.data.sCity,
      "XDLMeCity": this.data.eCity,
      "XDLMSourcesFunding": this.data.radio,
      "XDLMxmmc": this.data.project_name,
      "XDLMxmbh": this.data.project_code,
      "XDLMreason": this.data.reason
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
      return SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "5001",
          "XDLMSID": "DYBH2020031317415704893356",
          "datalist": JSON.stringify({ "key": ryarr_data })
        },
        method: "GET"
      })
    }).then((data)=>{
      return SysConfig.WorkflowManage.create(this.data.onlynum, '出差申请')
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
              url: '/pages/cc_sqjl/cc_sqjl'
            })
            }
          }
        })
      })
  }
})

function datedifference(sDate1, sDate2) { 
    var dateSpan,
      iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    if (dateSpan >= 0) {
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000) + 1);
      return iDays
    } else {
      wx.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none',
        duration: 2000
      })
      return 0
    }
};