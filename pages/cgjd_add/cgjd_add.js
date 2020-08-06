var SysConfig = require('../../utils/util.js');
Page({
  data: {
    visitingUnit:"",//到访人员单位
    nameList:"",//到访人员名单
    jiaotongArr: [],//陪同人员_弹框数据
    cgaddArr:["泾渭基地","五楼展室"],
    depart:"",//部门
    title:"",//标题
    reason:"",//事由
    visitingUnit:"",//到访人员单位
    renyuanlistarr:[],
    entourage:"",//陪同人员
    visitTime: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),//访问时间
    sptime_data: new Date().getTime(),
    visitContent:"",//参观内容
    shzt:"",//审核状态
    xmlcid:"",//项目流程唯一值
    visitingpeo:'',//到访人数

     mainActiveIndex: 0,//左侧选中项的索引
    activeId: [],// 右侧选中项的 id，支持传入数组
    sxpeople: [],
    rowiddata: {
      rowid: ""
    },
  },

  cancel_sDate() {//时间取消
    this.setData({
      showStart: false
    });
  },
  confirm_sDate(e) {//时间确定
      this.setData({
        sptime_data: e.detail,
        visitTime: SysConfig.ToolBox.transTime(e.detail),
        showStart: false
      });
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
                    id: res.rows[j].mUserName,
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
    "XDLMSID": "DYBH201908231020302030256172",
    "XDLMA": options.id
  },
  method: "GET"   //请求方式  目前接口先暂时全部使用get方式
}).then((res)=>{
  let entouragearr = res.rows[0].entourage.split(",")
  let rydataarr = []
  if (entouragearr && entouragearr.length>0){
    for (let i = 0; i < entouragearr.length;i++) {
      rydataarr.push({
        "XDLM人员": entouragearr[i]
      })
    }
  }
  this.setData({
    rowiddata: {
      rowid: options.id
    },
    creator: res.rows[0].creator,
    entourage: res.rows[0].entourage,
    activeId: entouragearr,
    renyuanlistarr: rydataarr,
    visitingpeo: res.rows[0].visitingpeo,
    nameList: res.rows[0].nameList,
    visitingUnit: res.rows[0].visitingUnit,
    biaoti: res.rows[0].title,
    visitTime: res.rows[0].visitTime,
    sptime_data:new Date(res.rows[0].visitTime).getTime(),
    reason:res.rows[0].reason,
    creatorId: res.rows[0].creator_id,
    visitContent: res.rows[0].visitContent,
    remark: res.rows[0].remark,
    creatorId: res.rows[0].creator_id,
    onlynum: res.rows[0].onlynum,
  })
})
}else{
     // 获取人名
    SysConfig.UserInfo.GetUserName().then((res) => {
      console.log(res)
      this.setData({
        creator: res.data,
        biaoti: res.data + '的参观接待'
      })
    })
    // 获取部门
    SysConfig.UserInfo.GetUserDepart().then((res) => {
      this.setData({
        depart: res.data
      })
    })
    // 获取人员id
    SysConfig.UserInfo.GetUserID().then((res) => {
      this.setData({
        creatorId: res.data
      })
    })
    // 获取onlynum
    this.setData({
      onlynum: SysConfig.ToolBox.getTimeAndRandom()
    })
  }
},

  showDep() {
    this.setData({
      showDep: true
    });
  },
  onConfirmDep() {
    this.setData({
      showDep: false
    });
  },
  onConfirmleixing(e) {
    this.setData({
      showleixing: false,
      canguanneirong: e.detail.value
    });
  },
  showType() {
    this.setData({
      showleixing: true
    });
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 人员选择
  showRenyuan() {
    console.log(this.data.renyuanxianshi)
    this.setData({
      showrenyuan: true
    });
  },

  // 开始时间弹出层
  showPopupstartTime() {
    this.setData({
      showStart: true
    });

  },

  onConfirm(event) {
    this.setData({
      show: false,
      checkjiaqi: event.detail.value
    });
  },

  onCancel() {
    this.setData({
      show: false
    });
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/cgjd_sqjl/cgjd_sqjl'
    })
  },
  // 到访单位
  onChangedfdw(event) {
    this.setData({
      visitingUnit: event.detail
    })
  },
  // 到访人员名单
  onChangedfry(event) {
    this.setData({
      nameList: event.detail
    })
  },
  // 到访人员名单
  onChangedfrs(event) {
    this.setData({
      visitingpeo: event.detail
    })
  },
    // 事由改变
    onChangedfsy(event) {
      this.setData({
        reason: event.detail
      })
    },
    // 监听备注
    onChangebeizhu(event) {
      this.setData({
        remark: event.detail
      })
    },
//陪同人员
traffic_event() {
  this.setData({
    traffic_show: true
  });
},

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickItem({ detail = {} }) {
    const { activeId } = this.data;
    const index = activeId.indexOf(detail.text);
    let tryqrarr = this.data.renyuanlistarr;
    let tryqrarr_name = ""
    if (index > -1) {
      tryqrarr.splice(index, 1);
      activeId.splice(index, 1);
    } else {
      tryqrarr.push({
        // "XDLM部门": detail.user_bm,
        "XDLM人员": detail.text,
        // "XDLM人员ID": detail.id,
        // "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
        // "XDLM关联编号": this.data.onlynum,
      })
      activeId.push(detail.text);
    }
    for (let i = 0; i < tryqrarr.length; i++) {
      if (i == tryqrarr.length - 1) {
        tryqrarr_name += tryqrarr[i]["XDLM人员"]
      } else {
        tryqrarr_name += tryqrarr[i]["XDLM人员"] + ","
      }
    }
    this.setData({
      entourage: tryqrarr_name,
      renyuanlistarr: tryqrarr,
      activeId
    });

  },
  showrenyuan_close(e) {
    this.setData({ traffic_show: false })
  },
// 参观内容
Add_event() {
  this.setData({
    Add_show: true
  });
},
Add_confirm(e){
  this.setData({
    visitContent: e.detail.value,
    Add_show: false
  });
},
Add_cancel(e) {
  this.setData({
    Add_show: false
  });
},
  // 提交表单
  submitTijiao() {
    var that = this
    let dataparams={}
    if (that.data.rowiddata.rowid){
      dataparams={
        "XDLMCID": "6000",
        "XDLMSID": "DYBH20190823102030203046175",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMentourage": that.data.entourage,
        "XDLMvisitingpeo": that.data.visitingpeo,
        "XDLMnameList": that.data.nameList,
        "XDLMvisitingUnit": that.data.visitingUnit,
        "XDLMtitle": that.data.biaoti,
        "XDLMvisitTime": that.data.visitTime,
        "XDLMreason": that.data.reason,
        "XDLMvisitContent": that.data.visitContent,
        "XDLMremark": that.data.remark,
      }
    }else{
      dataparams= { //接口body体内参数
        "XDLMCID": '5000',
        "XDLMSID": 'DYBH20190823102030203071173',
        "XDLMonlynum": that.data.onlynum,//唯一编号
        "XDLMshzt": "待提交",
        "XDLMvisitTime": that.data.visitTime,//到访时间
        "XDLMnameList": that.data.nameList,//到访人员
        "XDLMvisitingUnit": that.data.visitingUnit,//到访人员单位
        "XDLMcreator_id": that.data.creatorId,
        "XDLMtitle": that.data.creator + '的参观接待',
        "XDLMcreator": that.data.creator,
        "XDLMdepart": that.data.depart,
        "XDLMentourage": that.data.entourage,
        "XDLMvisitContent":that.data.visitContent,
        "XDLMremark":that.data.remark,//备注
        "XDLMvisitingpeo":that.data.visitingpeo,
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
        console.log(data)
        if(that.data.visitContent=="五楼展室"){
        return SysConfig.WorkflowManage.create(that.data.onlynum, '参观接待_五楼展室');
        }else{
        return SysConfig.WorkflowManage.create(that.data.onlynum, '参观接待_泾渭基地');
        }
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
              url: '/pages/cgjd_sqjl/cgjd_sqjl'
            })
            }
          }
        })
      })
  },
  tishikuang(shlc) {
    let icon;
    if (shlc.success) {
      icon = 'success';

    } else {
      icon = 'none';

    }
    wx.showToast({
      title: shlc.message,
      icon: 'success',
      duration: 2000
    }, wx.navigateTo({
      url: '/pages/cgjd_sqjl/cgjd_sqjl'
    }))
  },
  // 到访人员
  daofangrenyuan(event) {
    console.log(event.detail)
    this.setData({
      daofangrenyuan: event.detail
    })
  },
  //到访单位
  daofangdanwei(event) {
    this.setData({
      daofangdanwei: event.detail
    })
  },
  //到访人数
  daofangrenshu(event) {
    this.setData({
      daofangrenshu: event.detail
    })
  },
  //到访事由
  daofangshiyou(event) {
    this.setData({
      daofangshiyou: event.detail
    })
  },
  //标题
  biaoti(event) {
    this.setData({
      biaoti: event.detail
    })
  },
  //备注
  beizhu(event) {
    this.setData({
      beizhu: event.detail
    })
  }
})
