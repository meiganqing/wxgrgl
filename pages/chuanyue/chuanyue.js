import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var SysConfig = require('../../utils/util.js');
var until = require('../../utils/utils.js')
var timeget = require('../../utils/time.js')
var until = require('../../utils/utils.js')

console.log(until)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jieshouren:[],
    fileArray: [],
    showarea: false,

    renyuanlist: [],
    showrenyuan: false,
    showleixing: false,
    showDep: false,
    date: until.formatDataTime(new Date()),
    disabled: false, //设置是否能点击 false可以 true不能点击
    startDate: '2000-12-31 23:59',
    endDate: '2099-12-31 23:59',
    placeholder: '请选择时间',
    date1: until.formatDataTime(new Date()),
    disabled1: false, //设置是否能点击 false可以 true不能点击
    startDate1: '2000-12-31 23:59',
    endDate1: '2099-12-31 23:59',
    placeholder1: '请选择时间',
    show: false,
    show1: false,
    showEnd: false,
    showStart: false,
    checkjiaqi: '请选择假期类型',

  },

  onCancel() {
    Toast('取消');
    this.setData({
      showDep: false,
      showleixing: false,
    });
  },



  onLoad: function (options) {

    let time = until.formatDataTime(new Date());
    time = time.concat(':00')
    this.setData({
      nowtime: time
    })
    console.log(time)

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
    }).then((data) => {
      //接口成功之后返回值 失败则不会返回

      let depArr = []
      var bmData = data
      if (bmData.success) {
        for (var i = 0; i < bmData.rows.length; i++) {
          depArr.push(bmData.rows[i].DepartName)
        }
      }
      this.setData({
        depxuanze: depArr
      })
    })
    // 获取onlynum
    let res = SysConfig.ToolBox.getTimeAndRandom()
    this.setData({
      onlynum: res
    })







  },

  // 部门类型选择
  onChangeDep(event) {
    this.setData({
      dep: event.detail.value
    })
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
    // 获取部门人员
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYYHGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数

        "XDLMCID": "1001",
        "XDLMSID": "DYBH20190823102601261253201",
        "XDLMD": this.data.dep
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((getbmcy) => {
      //接口成功之后返回值 失败则不会返回
      if (getbmcy.success) {
        let renyuanArr = [];
        let renyuanxianshi = [];
        console.log(getbmcy)
        for (var i = 0; i < getbmcy.rows.length; i++) {
          // $("#人员").append('<option value="' + getbmcy.rows[i].mUserID + '"  nameid="' + getbmcy.rows[i].mUserName + '"  bumen="' + getbmcy.rows[i].mDepart + '">' + getbmcy.rows[i].mUserName + "</option>");
          renyuanArr.push([{
            mUserID: getbmcy.rows[i].mUserID,
            mDepart: getbmcy.rows[i].mDepart,
            mUserName: getbmcy.rows[i].mUserName
          }])
          renyuanxianshi.push(getbmcy.rows[i].mUserName)
        }
        this.setData({
          renyuanxianshi: renyuanxianshi,
          renyuanArr: renyuanArr
        })

      }
    })
  },
  // 出差类型选择
  onChangeleixing(event) {
    this.setData({
      type: event.detail.value
    })  
  },
  onConfirmleixing() {
    this.setData({
      showleixing: false
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
  onConfirmrenyuan(event) {
    console.log(event)
    if (event.detail.value != "") {
      this.data.renyuanlist.push(event.currentTarget.dataset.renyuanarr[event.detail.index])
      this.data.jieshouren.push(event.detail.value)
    }

    console.log(this.data.renyuanlist)
    this.setData({
      renyuanlist: this.data.renyuanlist,
      showrenyuan: false,
      jieshouren: this.data.jieshouren
    });
  },
  onChangerenyuan(event) {
    
    this.setData({
      renyuan: event.detail.value
    });
  },
  // 开始时间弹出层
  showPopupstartTime() {
    this.setData({
      showStart: true
    });

  },
  // 结束时间弹出层
  showPopupendTime() {
    this.setData({
      showEnd: true
    });

  },
  // 出发城市弹出层
  showArea() {
    console.log(this.data.arealist)
    this.setData({
      showarea: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },




  onConfirm(event) {

    this.setData({
      show: false,
      checkjiaqi: event.detail.value
    });
  },

  onCancel() {
    Toast('取消');
    this.setData({
      show: false
    });
  },


  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/gwqf_sqjl/gwqf_sqjl'
    })
  },
  // 时间组件
  onPickerChange: function (e) {
    e.detail.dateString = e.detail.dateString.concat(':00')

    this.setData({
      date: e.detail.dateString,
      showStart: false
    })


  },
  onPickerChange1: function (e) {
    e.detail.dateString = e.detail.dateString.concat(':00')
    this.setData({
      date1: e.detail.dateString,
      showEnd: false
    })
    var qj_time = timeget.gettime(this.data.date, this.data.date1)
    console.log(qj_time)
    if (!qj_time.success) {

      wx.showModal({
        title: '提示',
        content: '您选择的日期不符合逻辑，请重新选择！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    var days = qj_time.days + '天（' + qj_time.hours + '小时)'
    this.setData({
      days: days,
      times: qj_time.hours
    })


  },
  // 事由改变
  onChangeReason(event) {
    console.log(event.detail);
    this.setData({
      leaveReason: event.detail
    })
  },


  // 提交表单
  submitTijiao() {
    let pl_addryarr = []
    var renyuanArr = this.data.renyuanlist
    console.log(renyuanArr)
    for (let i in renyuanArr) {

      pl_addryarr.push({
        "XDLM库内编号": SysConfig.ToolBox.getTimeAndRandom(),
        "XDLM关联编号": this.data.onlynum,
        "XDLM部门": renyuanArr[i][0].mDepart,
        "XDLM人员": renyuanArr[i][0].mUserName,
        "XDLM人员ID": renyuanArr[i][0].mUserID,
        "XDLM是否已读": "否",
      })
      console.log(pl_addryarr)

    }

    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数

        "XDLMCID": "5000  ",
        "XDLMSID": "DYBH2019082310203020305223",
        "XDLMcreator": this.data.creator,
        "XDLMcreator_id": this.data.creatorId,
        "XDLMdepart": this.data.depart,
        "XDLMshzt": "待提交",
        "XDLMonlynum": this.data.onlynum,
        "XDLMmessage": this.data.onChangemingcheng,
        "XDLMisInterrupt": "yes",
        "XDLMtitle": this.data.onChangemingcheng,
        "XDLMgwmc": this.data.onChangemingcheng,
        "XDLMzfsj": this.data.date,
        "XDLMfj": this.data.onChangeneirong,
  





      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      //接口成功之后返回值 失败则不会返回
      console.log(data)
      if (data.success) {
        console.log(data)

      }
    })

    // 2.提交表单
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数

        "XDLMCID": "5001",
        "XDLMSID": "DYBH2020031711390201378368",
        "datalist": JSON.stringify({ "key": pl_addryarr }),





      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      //接口成功之后返回值 失败则不会返回
      console.log(data)
      if (data.success) {
        console.log(data)

      }
    })

    // 3
    let gwlz_data =  SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数

        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030185221",
        "XDLMG":this.data.onlynum,





      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    })
    var shlc
    var lc_current_node_msg;
    if (gwlz_data.success && gwlz_data.rows && gwlz_data.rows.length > 0) {
      let getallLCXX =  SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数

          "XDLMCID": "5001",
          "XDLMSID": "DYBH2020031711390201378368",
          "XDLMA": gwlz_data.rows[0].xmlcid,
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      })
      if (getallLCXX.success && getallLCXX.rows && getallLCXX.rows.length > 0) {
        for (let i in getallLCXX.rows) {
          console.log(getallLCXX.rows[i].Lc_xh)
          console.log(gwlz_data.rows[0].currentLCxh)
          if (getallLCXX.rows[i].Lc_xh == gwlz_data.rows[0].currentLCxh) {
            lc_current_node_msg = getallLCXX.rows[i]
            break;
          }
        }
      }


      // 1. 获取下步节点信息 
      let lc_next_node_msg =  SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数

          "XDLMCID": "1001",
          "XDLMSID": "DYBH201908231020302030164411",
          "XDLMA": gwlz_data.rows[0].xmlcid,
          "XDLME": gwlz_data.rows[0].currentLCxh,
          "XDLMD": gwlz_data.rows[0].currentLCxh,
     
        },
        method: "GET"   //请求方式  目前接口先暂时全部使用get方式
      })

      if (lc_next_node_msg.success && lc_next_node_msg.rows && lc_next_node_msg.rows.length > 0) {
        //2. 获取下步节点审核人
        let lc_next_node_auditor = SysConfig.SubSystemData.request( {
     

           istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数

            "XDLMCID": "1001",
            "XDLMSID": "DYBH201908231020302030189261",
            "XDLMA": gwlz_data.rows[0].xmlcid,
            "XDLMB": lc_next_node_msg.rows[0].Lc_xh,
            "XDLMC": "3,4"
         
          },
          method: "GET"   //请求方式  目前接口先暂时全部使用get方式
        });
        if (lc_next_node_auditor.success && lc_next_node_auditor.rows && lc_next_node_auditor.rows.length > 0) {
          console.log(lc_current_node_msg)
          //5.  添加节点功能执行记录表
          SysConfig.SubSystemData.request({

            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数

              "XDLMCID": "5000",
              "XDLMSID": "DYBH20190823102030203065273",
              "XDLMlcbh": gwlz_data.rows[0].xmlcid,
              "XDLMjdbh":gwlz_data.rows[0].currentLCxh, //节点序号
              "XDLMfuncID": lc_current_node_msg.funcID, //功能编号

              "XDLMrunTime": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
              "XDLMrunPeo": SysConfig.UserInfo.GetUserName(),
              "XDLMrunCons": "完成",
              "XDLMxmonlynum": gwlz_data.rows[0].onlynum,
            },
            method: "GET"   //请求方式  目前接口先暂时全部使用get方式
          });
          // 7.添加节点完成表
          SysConfig.SubSystemData.request( {


            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数

              "XDLMCID": "5000",
              "XDLMSID": "DYBH2019082310203020306423",
              "XDLMcom_person": SysConfig.UserInfo.GetUserName(),
              "XDLMcom_time": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
              "XDLMjdxh": gwlz_data.rows[0].currentLCxh, //节点编号

              "XDLMxmlcmc": lc_current_node_msg.Lc_name, //流程名
              "XDLMxmlclx": gwlz_data.rows[0].xmlcid, //流程唯一编码
              "XDLMxmaddPerson": gwlz_data.rows[0].creator_id,
              "XDLMxmaddTime": gwlz_data.rows[0].zfsj,
              "XDLMcondepart": SysConfig.UserInfo.GetUserDepart(),
              "XDLMonlynum": gwlz_data.rows[0].onlynum,
              "XDLMconstat": "已完成",
          
            },
            method: "GET"   //请求方式  目前接口先暂时全部使用get方式
          });
          // 6.添加签批表
          SysConfig.SubSystemData.request({



              istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数

              "XDLMCID": "5000",
              "XDLMSID": "DYBH20190823102030203078343",
              "XDLMonlynum": gwlz_data.rows[0].onlynum,
              "XDLMLc_id": gwlz_data.rows[0].xmlcid, //流程唯一编码
              "XDLMjd": gwlz_data.rows[0].currentLCxh, //节点编号

              "XDLMqpr": SysConfig.UserInfo.GetUserName(),
              "XDLMqprbm": SysConfig.UserInfo.GetUserDepart(),
              "XDLMqpsj": SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
       

            },
            method: "GET"   //请求方式  目前接口先暂时全部使用get方式
          });
          //3. 向下一步审核人发送站内消息
          SysConfig.SubSystemData.request( {

            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数
             "XDLMCID": "9000",
            "XDLMTID": "9210",
            "XDLMSID": '9210001',
            "xmonlynum": gwlz_data.rows[0].onlynum, //项目唯一编码
            "lconlynum": gwlz_data.rows[0].xmlcid, //流程唯一编码

            "jdbh": lc_next_node_msg.rows[0].Lc_xh, //节点编号
            "senderID": SysConfig.UserInfo.GetUserID(),
            "recipientID": lc_next_node_auditor.rows[0].runPeoID,

            },
            method: "GET"   //请求方式  目前接口先暂时全部使用get方式  

          });

          shlc = SysConfig.SubSystemData.request( {

            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: { //接口body体内参数
              "XDLMCID": "6000",
              "XDLMSID": "DYBH201908231020302030135225",
              "XDLMID": gwlz_data.rows[0].id,
              "XDLMshzt": "待完成",
              "XDLMshr": lc_next_node_auditor.rows[0].runPeo, //流程配置中的审核人

              "XDLMcurrentLCxh": lc_next_node_auditor.rows[0].Lc_xh, //流程序号
      

            },
            method: "GET"   //请求方式  目前接口先暂时全部使用get方式  

          });
          if (shlc.success) {

            // layer.msg("已提交，请等待" + lc_next_node_auditor.rows[0].runPeo + "审核或反馈！", {
            //   icon: 1,
            //   time: 1500
            // }, function () {
            //   // layer.close(index001);

            //   // tableins.reload("mDataTable");
            // });

            wx.showModal({
              title: '已提交，请等待',
              content: lc_next_node_auditor.rows[0].runPeo + "审核或反馈！",
              success(res) { console.log(1) },
             
          })

          
          } else {
     
            wx.showModal({
              title: '',
              content: "提交失败！",
              success(res) { console.log(fail) },

            })
          }
        }
      } else {
        layer.msg("未找到可执行的流程！", {
          icon: 2,
          time: 1500
        }, function () {
          // layer.close(index001);
          QXALL();
          // tableins.reload("mDataTable");
        });

        wx.showModal({
          title: '',
          content:  "未找到可执行的流程！",
          success(res) { console.log(fail) },

        })
      }

      


    }





    // 1.先获取用户信息
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYYHGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: { //接口body体内参数

        "XDLMCID": "1001",
        "XDLMSID": "DYBH20190823102601261253201",
        "XDLMH": this.data.creatorId
      },
      method: "GET"   //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {
      //接口成功之后返回值 失败则不会返回
      if (data.success) {
        this.setData({

          shlx: data.rows[0].isbmzr

        })
      }
    })





    // 3.流程创建
    var that = this
    // wx.showModal({
    //   title: '提示',
    //   content: '确定提交申请吗',
    //   success(res) {


    //     if (res.confirm) {


    //       SysConfig.WorkflowManage.create(that.data.onlynum, '公文群发').then((res) => {
    //         that.tishikuang(res)
    //         that.setData({
    //           shlc: res
    //         })
    //       })






    //     } else if (res.cancel) {
    //       wx.reLaunch({
    //         url: '/pages/index/index'
    //       })
    //     }
    //   }
    // })






  },
  tishikuang(shlc) {
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
      duration: 2000
    }, console.log(1))
  },

  // 上传文件

  upload: function (e) {
    var that = this
    console.log(e)
    wx.chooseMessageFile({
      count: 3,
      type: 'file',
      success(res) {
        console.log(res.tempFiles[0].path)
        that.data.filename = res.tempFiles[0].name
        that.data.fileArray.push(that.data.filename)
        that.setData(that.data)
        var formData = {
          'XDLMCID': '5000',
          'XDLMSID': 'DYBH202002181047204720151333',
          'XDLM库内编号': SysConfig.ToolBox.getTimeAndRandom(),
          'XDLM关联编号': that.data.onlynum,
          'XDLM文件名': res.tempFiles[0].name,
          'XDLM原文件名': res.tempFiles[0].name,
          'XDLM文件地址': res.tempFiles[0].path,
          'XDLM类型': "发起报文申请",
          'XDLM添加人': that.data.creator
        }
        SysConfig.Upload.upLoadFile(res.tempFiles[0].path, res.tempFiles[0].name, formData)
      }
    })

    // function upLoadFile(url, filePath, name, formData, success, fail) {

    //   wx.uploadFile({
    //     url: url,
    //     filePath: filePath,
    //     name: name,
    //     header: {
    //       'content-type': 'multipart/form-data'
    //     },
    //     formData: formData,    //请求额外的form data
    //     success: function (res) {
    //       console.log(res);
    //       if (res.statusCode == 200) {
    //         typeof success == "function" && success(res.data);
    //       } else {
    //         typeof fail == "function" && fail(res.data);
    //       }
    //     },
    //     fail: function (res) {
    //       console.log(res);
    //       typeof fail == "function" && fail(res.data);
    //     }
    //   })
    // }
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  onChangemingcheng: function (e) {

    this.setData({
      onChangemingcheng: e.detail
    })

  },
  onChangeneirong(e) {
    this.setData({
      onChangeneirong: e.detail
    })
  }






})